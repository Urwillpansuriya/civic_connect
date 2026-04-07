const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Comment = require('../models/Comment');
const cloudinary = require('../config/cloudinary');

exports.getComplaintSummary = async (req, res) => {
  try {
    const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];
    const statusCounts = {};

    for (const status of statuses) {
      statusCounts[status] = await Complaint.countDocuments({ status });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayCount = await Complaint.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalUsers = await User.countDocuments();
    console.log("Sending summary:", { totalUsers, statusCounts });
    res.json({
      statusCounts,
      todayCount,
      totalUsers
    });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};

// ✅ Submit Complaint
exports.submitComplaint = async (req, res) => {
  try {
    const { title, description, location, category, lat, lng, placeName, areaName, cityName } = req.body;
    console.log('Received data:', req.body);

    // Cloudinary: req.file.path = secure URL, req.file.filename = public_id
    const imageUrl = req.file ? req.file.path : null;
    const imagePublicId = req.file ? req.file.filename : null;

    let locationName = '';
    if (lat && lng) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const geoData = await geoRes.json();
        locationName =
          geoData.address?.suburb ||
          geoData.address?.city ||
          geoData.address?.town ||
          geoData.address?.village ||
          '';
      } catch (e) {
        console.warn('🌐 Reverse geocoding failed:', e.message);
      }
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      imageUrl,
      imagePublicId,
      location: locationName || location,
      placeName,
      areaName,
      cityName,
      coordinates: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      user: req.user._id,
      createdBy: req.user._id,
      date: new Date()
    });

    await complaint.save();

    // Emit real-time event so admin charts refresh
    const io = req.app.get('io');
    if (io) io.emit('complaint:new', { complaintId: complaint._id });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });

  } catch (err) {
    console.error('❌ Error in submitComplaint:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Something went wrong'
    });
  }
};

// Add Complaint (alias for submitComplaint)
exports.addComplaint = async (req, res) => {
  try {
    const { title, description, location, category, lat, lng, placeName, areaName, cityName } = req.body;
    console.log('Received data:', req.body);

    const imageUrl = req.file ? req.file.path : null;
    const imagePublicId = req.file ? req.file.filename : null;

    let locationName = '';
    if (lat && lng) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const geoData = await geoRes.json();
        locationName =
          geoData.address?.suburb ||
          geoData.address?.city ||
          geoData.address?.town ||
          geoData.address?.village ||
          '';
      } catch (e) {
        console.warn('🌐 Reverse geocoding failed:', e.message);
      }
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      imageUrl,
      imagePublicId,
      location: locationName || location || 'Unknown',
      placeName,
      areaName,
      cityName,
      coordinates: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      user: req.user._id,
      createdBy: req.user._id,
      date: new Date()
    });

    await complaint.save();

    const io = req.app.get('io');
    if (io) io.emit('complaint:new', { complaintId: complaint._id });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });

  } catch (err) {
    console.error('❌ Error in submitComplaint:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Something went wrong'
    });
  }
};

// Get My Complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const userId = req.user._id;
    const complaints = await Complaint.find({ user: userId })
      .sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (err) {
    console.error('Error fetching my complaints:', err);
    res.status(500).json({ message: 'Failed to fetch your complaints' });
  }
};

// ✅ Get All Complaints (With optional filtering and pagination)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, location, sort, category, page = 1, limit = 5 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (status) query.status = status;
    if (location) query.location = new RegExp(location, 'i');
    if (category) query.category = category;

    const totalComplaints = await Complaint.countDocuments(query);
    
    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name email location')
      .populate('user', 'name email')
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limitNum);

    const complaintsWithCommentCounts = await Promise.all(complaints.map(async (complaint) => {
      const commentCount = await Comment.countDocuments({ complaint: complaint._id });
      return {
        ...complaint.toObject(),
        commentCount
      };
    }));

    const totalUsers = await User.countDocuments();
    
    const statusCounts = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusMap = {
      pending: 0,
      'in-progress': 0,
      resolved: 0,
      rejected: 0
    };
    
    statusCounts.forEach(s => {
      if (s._id) statusMap[s._id] = s.count;
    });
    
    res.status(200).json({
      complaints: complaintsWithCommentCounts,
      totalComplaints,
      totalPages: Math.ceil(totalComplaints / limitNum),
      currentPage: pageNum,
      totalUsers,
      statusCounts: statusMap
    });
  } catch (err) {
    console.error('❌ getAllComplaints error:', err);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await Complaint.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Emit real-time event so admin charts refresh
    const io = req.app.get('io');
    if (io) io.emit('complaint:updated', { complaintId: updated._id, status: updated.status });

    return res.json({ message: 'Status updated', complaint: updated });

  } catch (error) {
    console.error('❌ Update Status Error:', error.message);
    return res.status(500).json({ error: 'Failed to update status' });
  }
};

// Delete a complaint (for admin only)
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Complaint.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Delete image from Cloudinary if public_id is stored
    if (deleted.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(deleted.imagePublicId);
      } catch (cloudErr) {
        console.warn('⚠️ Cloudinary image deletion failed:', cloudErr.message);
      }
    }

    // Emit real-time event
    const io = req.app.get('io');
    if (io) io.emit('complaint:deleted', { complaintId: deleted._id });
    
    return res.json({ message: 'Complaint deleted successfully' });
    
  } catch (error) {
    console.error('❌ Delete Complaint Error:', error.message);
    return res.status(500).json({ error: 'Failed to delete complaint' });
  }
};

const Complaint = require('../models/Complaint');

// ✅ Submit Complaint
exports.submitComplaint = async (req, res) => {
  try {
    const { title, description, location, category, lat, lng,placeName,
      areaName,cityName } = req.body;
      console.log('Received data:', req.body); // Log the received data
    const imageUrl = req.file ? req.file.filename : null;

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
      location: locationName,
     placeName,  // ✅
     areaName,   // ✅
     cityName,    // ✅
      coordinates: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      createdBy: req.userId,
      date: new Date()
    });

    await complaint.save();

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

// ✅ Get All Complaints (With optional filtering)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, location, sort, category } = req.query;

    const query = {};
    if (status) query.status = status;
    if (location) query.location = new RegExp(location, 'i');
    if (category) query.category = category;

    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name email location')
      .sort({ createdAt: sort === 'asc' ? 1 : -1 });

    res.json(complaints);
  } catch (err) {
    console.error('❌ getAllComplaints error:', err);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('🚀 PATCH status called');
    console.log('➡️ ID:', id);
    console.log('➡️ New Status:', status);

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await Complaint.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    return res.json({ message: 'Status updated', complaint: updated });

  } catch (error) {
    console.error('❌ Update Status Error:', error.message);
    return res.status(500).json({ error: 'Failed to update status' });
  }
};




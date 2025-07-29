const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const {
  submitComplaint,
  getAllComplaints,
  updateComplaintStatus
} = require('../controllers/complaintController');
const Complaint = require('../models/Complaint');
const { verify } = require('jsonwebtoken');

// ✅ Multer Upload Setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

/* ----------------------------------
   ✅ ROUTES
---------------------------------- */

// ✅ Submit Complaint
router.post('/add', authMiddleware, upload.single('image'), submitComplaint);

// ✅ Get Complaints of Logged-in User
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; 
    const complaints = await Complaint.find({ user: userId });
    res.json(complaints);
  } catch (err) {
    console.error('🔥 Error in /mine:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/complaints/all?page=1&limit=10
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get complaints with populated comments
    const complaintsQuery = Complaint.find()
      .populate('user', 'name')
      .populate('createdBy', 'name')
      .populate('comments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total complaints count
    const countQuery = Complaint.countDocuments();

    // Get user count
    const userCountQuery = require('../models/User').countDocuments();

    // Get status counts
    const statusQuery = Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Execute all queries in parallel
    const [complaints, total, totalUsers, statusCounts] = await Promise.all([
      complaintsQuery,
      countQuery,
      userCountQuery,
      statusQuery
    ]);

    // Transform status counts into a more usable object
    const statusCountsObj = {};
    statusCounts.forEach(item => {
      statusCountsObj[item._id] = item.count;
    });

    // Add comment count to each complaint
    const complaintsWithCommentCount = complaints.map(c => {
      const complaint = c.toObject();
      complaint.commentCount = complaint.comments ? complaint.comments.length : 0;
      return complaint;
    });

    res.json({
      complaints: complaintsWithCommentCount,
      total,
      totalUsers,
      statusCounts: statusCountsObj,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error in /all:', err);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});


// ✅ Public route to get all complaints with pagination (no auth middleware)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      Complaint.find()
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments()
    ]);

    res.json({
      complaints,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get single complaint by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name')
      .populate('createdBy', 'name');

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (err) {
    console.error(`Error fetching complaint ${req.params.id}:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Test Route to check user info from token
router.get('/test-auth', authMiddleware, (req, res) => {
  res.json({ userId: req.userId, role: req.userRole });
});

// ✅ Upvote / Unvote Complaint
router.post('/:id/upvote', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    const index = complaint.upvotes.indexOf(req.userId);

    if (index === -1) {
      complaint.upvotes.push(req.userId);
    } else {
      complaint.upvotes.splice(index, 1);
    }

    await complaint.save();
    res.json({ upvotes: complaint.upvotes.length });
  } catch (err) {
    console.error('❌ Upvote error:', err);
    res.status(500).json({ error: 'Failed to update upvotes' });
  }
});
// POST /api/complaints/:id/comments
router.post('/:id/comment', authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'Comment text required' });

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  complaint.comments.push({ user: req.user._id, text });
  await complaint.save();

  res.status(200).json({ message: 'Comment added', complaint });
});

// Like/Unlike
router.post('/like/:id', verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    const userId = req.user.id;

    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    if (complaint.likes.includes(userId)) {
      // Unlike
      complaint.likes = complaint.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      complaint.likes.push(userId);
    }

    await complaint.save();
    res.json({ likes: complaint.likes.length });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ Admin Status Update
router.patch('/status/:id', authMiddleware, updateComplaintStatus);

// GET /api/complaints/summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    // Count by status
    const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];
    const statusCounts = {};
    for (const status of statuses) {
      statusCounts[status] = await Complaint.countDocuments({ status });
    }
    
    // Count today's complaints
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayCount = await Complaint.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    res.json({
      statusCounts,
      todayCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Search route is now in complaintRoutes.js

// DELETE /api/complaints/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!deletedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;

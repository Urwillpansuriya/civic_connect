const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  submitComplaint,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint
} = require('../controllers/complaintController');
const Complaint = require('../models/Complaint');

/* ----------------------------------
   ✅ ROUTES
   NOTE: Static/named routes must be defined BEFORE parameterised /:id routes
---------------------------------- */

// ✅ Submit Complaint
router.post('/add', authMiddleware, upload.single('image'), submitComplaint);

// ✅ Get Complaints of Logged-in User
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const complaints = await Complaint.find({ user: userId }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error('🔥 Error in /mine:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/complaints/all?page=1&limit=10
router.get('/all', authMiddleware, getAllComplaints);

// GET /api/complaints/summary
router.get('/summary', authMiddleware, async (req, res) => {
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

    res.json({ statusCounts, todayCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// ✅ Public route to get all complaints with pagination (no auth)
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

    res.json({ complaints, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// ✅ Admin Status Update  (must be before /:id)
// Support both /status/:id (legacy) and /:id/status (REST convention)
router.patch('/status/:id', authMiddleware, updateComplaintStatus);
router.patch('/:id/status', authMiddleware, updateComplaintStatus);

// ✅ Upvote / Unvote Complaint
router.post('/:id/upvote', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    const index = complaint.upvotes.indexOf(req.user._id.toString());
    if (index === -1) {
      complaint.upvotes.push(req.user._id);
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

// POST /api/complaints/:id/comment
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
router.post('/like/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    const userId = req.user._id.toString();

    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    if (complaint.likes.map(id => id.toString()).includes(userId)) {
      complaint.likes = complaint.likes.filter(id => id.toString() !== userId);
    } else {
      complaint.likes.push(req.user._id);
    }

    await complaint.save();
    res.json({ likes: complaint.likes.length });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Something went wrong' });
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
    console.error('Error fetching complaint by id:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Delete a complaint
router.delete('/:id', authMiddleware, deleteComplaint);

module.exports = router;

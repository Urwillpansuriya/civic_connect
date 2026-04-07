const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  addComplaint,
  getMyComplaints,
  updateComplaintStatus,
  deleteComplaint,
} = require('../controllers/complaintController');
const { postComment, getComments } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // multer middleware
const Complaint = require('../models/Complaint');

// Add a new complaint
router.post('/add', authMiddleware, upload.single('image'), addComplaint);

// Get all complaints (for admin)
router.get('/all', authMiddleware, getAllComplaints);

// Get user's complaints
router.get('/mine', authMiddleware, getMyComplaints);

// Update complaint status
router.patch('/:id/status', authMiddleware, updateComplaintStatus);

// Delete a complaint (admin only)
router.delete('/:id', authMiddleware, deleteComplaint);

// Add comment to a complaint
router.post('/:complaintId/comments', authMiddleware, postComment);

// Get comments for a complaint
router.get('/:complaintId/comments', getComments);

// Get a single complaint by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name')
      .populate('createdBy', 'name');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.json(complaint);
  } catch (err) {
    console.error('Error fetching complaint:', err);
    res.status(500).json({ message: 'Failed to fetch complaint' });
  }
});
// @route GET /api/complaints/search?q=abc&page=1&limit=10
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const query = req.query.q || req.query.query || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const userId = req.user._id;

    const searchQuery = {
      user: userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    };

    const [complaints, total] = await Promise.all([
      Complaint.find(searchQuery)
        .populate('comments.user', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(searchQuery)
    ]);

    res.json({
      complaints,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;

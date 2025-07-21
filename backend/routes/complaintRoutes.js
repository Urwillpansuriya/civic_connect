const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  addComplaint,
  getMyComplaints,
  updateComplaintStatus,
} = require('../controllers/complaintController');
const { postComment, getComments } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Update status: PATCH /api/complaints/:id/status
router.patch('/:id/status', authMiddleware, updateComplaintStatus);
// @route GET /api/complaints/search?query=abc
router.get('/search', protect, async (req, res) => {
  try {
    const query = req.query.query || '';
    const userId = req.user._id;

    const complaints = await Complaint.find({
      user: userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    }).populate('comments.user', 'name');

    res.json(complaints);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;

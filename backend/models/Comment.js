// const mongoose = require('mongoose');
// const express = require('express');
// const router = express.Router();
// const Comment = require('../models/Comment');
// const { verifyToken } = require('../middleware/authMiddleware');

// const commentSchema = new mongoose.Schema({
//   text: String,
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });
// router.post('/:complaintId', verifyToken, async (req, res) => {
//   try {
//     const comment = await Comment.create({
//       complaintId: req.params.complaintId,
//       userId: req.user.id,
//       content: req.body.content
//     });
//     res.json(comment);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to add comment' });
//   }
// });

// // Get all comments for a complaint
// router.get('/:complaintId', async (req, res) => {
//   try {
//     const comments = await Comment.find({ complaintId: req.params.complaintId }).populate('userId', 'name');
//     res.json(comments);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch comments' });
//   }
// });

// module.exports = router;
// module.exports = mongoose.model('Comment', commentSchema);




const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);

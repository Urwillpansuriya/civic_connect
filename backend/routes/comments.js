// const express = require('express');
// const router = express.Router();
// const Comment = require('../models/Comment');
// const auth = require('../middleware/authMiddleware');

// // Add a new comment
// router.post('/:complaintId', auth, async (req, res) => {
//   try {
//     const { text } = req.body;
//     const comment = new Comment({
//       text,
//       complaintId: req.params.complaintId,
//       user: req.userId
//     });
//     await comment.save();
//     res.status(201).json(comment);
//   } catch (err) {
//     console.error('❌ Error saving comment:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get comments for a complaint
// router.get('/:complaintId', async (req, res) => {
//   try {
//     const comments = await Comment.find({ complaintId: req.params.complaintId }).populate('user', 'name');
//     res.json(comments);
//   } catch (err) {
//     console.error('❌ Error fetching comments:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

// // const express = require('express');
// // const router = express.Router();
// // const Comment = require('../models/Comment');
// // const auth = require('../middleware/authMiddleware');

// // // ➕ Post a comment
// // router.post('/:complaintId', auth, async (req, res) => {
// //   try {
// //     const newComment = new Comment({
// //       content: req.body.content,
// //       user: req.userId,
// //       complaint: req.params.complaintId
// //     });
// //     await newComment.save();
// //     res.status(201).json({ message: 'Comment added', comment: newComment });
// //   } catch (err) {
// //     console.error('❌ Comment save failed:', err);
// //     res.status(500).json({ error: 'Failed to add comment' });
// //   }
// // });

// // // 🔄 Get all comments for a complaint
// // router.get('/:complaintId', async (req, res) => {
// //   try {
// //     const comments = await Comment.find({ complaint: req.params.complaintId })
// //       .populate('user', 'name');
// //     res.json(comments);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch comments' });
// //   }
// // });

// // module.exports = router;







const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); // your Comment model
const Complaint = require('../models/Complaint'); // your Complaint model
const auth = require('../middleware/authMiddleware'); // middleware to get user from token
const authMiddleware = require('../middleware/authMiddleware');

// ✅ POST a comment on a complaint
router.post('/:complaintId', authMiddleware, async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { text } = req.body;

    const comment = new Comment({
      complaint: complaintId,
      user: req.user._id, // from auth middleware
      text
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error('❌ Error posting comment:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ GET comments of a complaint
router.get('/:complaintId', async (req, res) => {
  try {
    const { complaintId } = req.params;
    const comments = await Comment.find({ complaint: complaintId }).populate('user', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

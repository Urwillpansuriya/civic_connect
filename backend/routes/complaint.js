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

// ✅ Get All Complaints (Admin/Public)
router.get('/all', authMiddleware, getAllComplaints);


// ✅ Public route to get all complaints (no auth middleware)
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'name');
    res.json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ error: 'Internal server error' });
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

// server/routes/complaints.js

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const regex = new RegExp(query, 'i'); // Case-insensitive search

    const complaints = await Complaint.find({
      $or: [
        { title: regex },
        { location: regex }
      ]
    });

    res.json(complaints);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

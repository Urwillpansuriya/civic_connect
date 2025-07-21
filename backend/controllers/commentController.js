const Complaint = require('../models/Complaint');

exports.postComment = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { text } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const newComment = {
      user: req.user._id,
      text,
    };

    complaint.comments.push(newComment);
    await complaint.save();

    const populatedComplaint = await complaint.populate('comments.user', 'name');
    res.status(201).json(populatedComplaint.comments);
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findById(complaintId).populate('comments.user', 'name');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.json(complaint.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

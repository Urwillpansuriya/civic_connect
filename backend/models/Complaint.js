// server/models/Complaint.js

const mongoose = require('mongoose');

// ✅ Comment Subschema
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Complaint Schema
const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  comments: [commentSchema],
  location: { type: String },
  placeName: String,     // ✅ Add this
  areaName: String,      // ✅ Add this
  cityName: String,     // ✅ Add this
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },

  imageUrl: { type: String },
  imagePublicId: { type: String },

  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },


  // ✅ Likes/Upvotes (only one array needed)
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  timestamp: {
    type: Date,
    default: Date.now
  },

  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);

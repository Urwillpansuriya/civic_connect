const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  profilePic: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // optional
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

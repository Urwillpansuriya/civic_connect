const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('TOKEN RECEIVED:', token);
    console.log('SECRET USED:', process.env.JWT_SECRET);
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;

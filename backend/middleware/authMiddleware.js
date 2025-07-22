// // const jwt = require('jsonwebtoken');
// // const User = require('../models/User');

// // const authMiddleware = async (req, res, next) => {
// //   const token = req.headers.authorization?.split(' ')[1];
// //   if (!token) return res.status(401).json({ error: 'No token provided' });

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.userId = decoded.userId;
// //     // req.userRole = decoded.role;

// //     const user = await User.findById(req.userId);
// //     if (!user) return res.status(401).json({ error: 'User not found' });
// //     req.userId = decoded.userId;
// //     req.userRole = user.role; // add user role for admin check
// //     next();
// //   } catch (err) {
// //     res.status(403).json({ error: 'Invalid token' });
// //   }
// // };

// // module.exports = authMiddleware;






// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const authMiddleware = async (req, res, next) => {
//   try {
//     // Extract token
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ error: 'No token provided' });

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId);

//     if (!user) return res.status(401).json({ error: 'User not found' });

//     // Attach user data
//     req.user = user;
//     req.userId = user._id;
//     req.userRole = user.role;

//     next();
//   } catch (err) {
//     console.error('🔐 Auth Error:', err.message);
//     return res.status(403).json({ error: 'Invalid token' });
//   }
// };

// module.exports = authMiddleware;
















const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
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

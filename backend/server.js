const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const commentRoutes = require('./routes/comments');
const categoryRoutes = require('./routes/categoryRoutes');
const complaintRoutes = require('./routes/complaintRoutes'); // Import complaint routes
const complaintRouter = require('./routes/complaint'); // Import main complaint router
const app = express();   // Init app
// Load env
dotenv.config();

// Add middleware first
app.use(cors({
  origin: 'http://localhost:3000', // allow frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Register routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/complaints', complaintRouter); // Register the main complaint router that has the like route
app.use('/api/complaints', complaintRoute); // Register the main complaint router that has the like route
app.use('/api/categories', categoryRoutes); // Category route works here
app.use('/api/comments', commentRoutes); // Comment route works here
// Middleware
// app.use(cors());
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
// Complaint routes already registered above
app.use('/api/export', require('./routes/export')); // ✅ CSV route works here
// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Serve React build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

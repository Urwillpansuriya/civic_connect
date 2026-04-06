const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load env first so all process.env values are available
dotenv.config();

const commentRoutes = require('./routes/comments');
const categoryRoutes = require('./routes/categoryRoutes');
const complaintRouter = require('./routes/complaint'); // Main complaint router

const app = express();

// ─── Global Middleware (must come before all routes) ────────────────────────

// Allow requests from any configured frontend origin.
// Set CORS_ORIGIN on Render to your Vercel URL (comma-separated for multiple).
// Example: CORS_ORIGIN=https://your-app.vercel.app,https://your-custom-domain.com
// When not set it falls back to allowing all origins so the API stays accessible
// during initial setup. Set this variable in production for better security.
const rawOrigin = process.env.CORS_ORIGIN || '';
const allowedOrigins = rawOrigin
  ? rawOrigin.split(',').map(o => o.trim()).filter(Boolean)
  : null; // null = allow all origins

app.use(cors({
  origin: allowedOrigins || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: !!allowedOrigins,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ─── MongoDB Connection ──────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', complaintRouter);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/export', require('./routes/export'));

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

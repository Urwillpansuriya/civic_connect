// backend/routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/authMiddleware'); // Make sure auth.js exists
const isAdmin = require('../middleware/isAdmin'); // Optional if using role-based access

// Add new category
router.post('/add', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(409).json({ error: 'Category already exists' });

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    console.error('❌ Category Add Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

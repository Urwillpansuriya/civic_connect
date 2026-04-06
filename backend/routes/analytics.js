const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/analytics/complaints-per-day?days=7  (default 7, max 30)
router.get('/complaints-per-day', authMiddleware, async (req, res) => {
  try {
    const rawDays = parseInt(req.query.days);
    const days = (!isNaN(rawDays) && rawDays > 0) ? Math.min(rawDays, 30) : 7;
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    since.setHours(0, 0, 0, 0);

    const results = await Complaint.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Build a full date range so days with 0 complaints are included
    const map = {};
    results.forEach(r => { map[r._id] = r.count; });

    const data = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      data.push({ date: key, count: map[key] || 0 });
    }

    res.json(data);
  } catch (err) {
    console.error('Analytics complaints-per-day error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/analytics/status-breakdown
router.get('/status-breakdown', authMiddleware, async (req, res) => {
  try {
    const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];
    const counts = await Promise.all(
      statuses.map(s => Complaint.countDocuments({ status: s }).then(c => ({ status: s, count: c })))
    );
    res.json(counts);
  } catch (err) {
    console.error('Analytics status-breakdown error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;

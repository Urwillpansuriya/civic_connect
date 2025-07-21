const express = require('express');
const Complaint = require('../models/Complaint');
const router = express.Router();
const { Parser } = require('json2csv');

router.get('/location-csv', async (req, res) => {
  const complaints = await Complaint.find({}, 'title category location coordinates');

  const fields = ['title', 'category', 'location', 'coordinates.lat', 'coordinates.lng'];
  const parser = new Parser({ fields });
  const csv = parser.parse(complaints);

  res.header('Content-Type', 'text/csv');
  res.attachment('complaints.csv');
  return res.send(csv);
});

module.exports = router;

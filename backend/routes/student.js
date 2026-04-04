const express = require('express');
const router = express.Router();
const Mark = require('../models/Mark');
const Form = require('../models/Form');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const bcrypt = require('bcryptjs');
const { protect, authorize } = require('../middleware/auth');

const studentAuth = [protect, authorize('student', 'admin')];

// GET /api/student/marks — own marks
router.get('/marks', ...studentAuth, async (req, res) => {
  try {
    const marks = await Mark.find({ studentId: req.user._id })
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/student/forms — own forms
router.get('/forms', ...studentAuth, async (req, res) => {
  try {
    const forms = await Form.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/student/forms — submit a form
router.post('/forms', ...studentAuth, async (req, res) => {
  try {
    const { formType, semester, subjects } = req.body;
    const form = await Form.create({ studentId: req.user._id, formType, semester, subjects: subjects || [] });
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/student/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/student/profile — update own profile (name, phone only, not role/email)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const update = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (password) update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

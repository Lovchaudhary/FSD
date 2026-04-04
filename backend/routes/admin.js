const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Mark = require('../models/Mark');
const Ticket = require('../models/Ticket');
const Form = require('../models/Form');
const { protect, authorize } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin')];

// GET /api/admin/stats
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const [students, teachers, tickets, forms, marks] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      Ticket.countDocuments(),
      Form.countDocuments(),
      Mark.countDocuments(),
    ]);
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const pendingForms = await Form.countDocuments({ status: 'pending' });
    res.json({ students, teachers, tickets, openTickets, forms, pendingForms, marks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users  (all users with optional role filter)
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', ...adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/users  (create user)
router.post('/users', ...adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department, subjects, groups } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash, role,
      rollNumber: rollNumber || '',
      department: department || '',
      subjects: subjects || [],
      groups: groups || [],
    });
    res.status(201).json({ ...user.toObject(), password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id  (edit user — admin can change name, email, password, etc.)
router.put('/users/:id', ...adminOnly, async (req, res) => {
  try {
    const { name, email, password, department, subjects, groups, phone, isActive, rollNumber } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (department !== undefined) update.department = department;
    if (subjects) update.subjects = subjects;
    if (groups) update.groups = groups;
    if (phone !== undefined) update.phone = phone;
    if (isActive !== undefined) update.isActive = isActive;
    if (rollNumber !== undefined) update.rollNumber = rollNumber;
    if (password) update.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', ...adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/tickets
router.get('/tickets', ...adminOnly, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('studentId', 'name rollNumber email')
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/marks
router.get('/marks', ...adminOnly, async (req, res) => {
  try {
    const marks = await Mark.find()
      .populate('studentId', 'name rollNumber')
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/marks/:id/finalize  — admin can finalize/unfinalize marks
router.put('/marks/:id/finalize', ...adminOnly, async (req, res) => {
  try {
    const mark = await Mark.findByIdAndUpdate(req.params.id, { isFinal: req.body.isFinal }, { new: true });
    res.json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/forms
router.get('/forms', ...adminOnly, async (req, res) => {
  try {
    const forms = await Form.find().populate('studentId', 'name rollNumber email').sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/forms/:id
router.put('/forms/:id', ...adminOnly, async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

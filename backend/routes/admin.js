const express = require('express');
const User = require('../models/User');
const Mark = require('../models/Mark');
const Ticket = require('../models/Ticket');
const Form = require('../models/Form');
const { protect, requireRole } = require('../middleware/auth');
const router = express.Router();

router.use(protect, requireRole('admin'));

// ── Users ──────────────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/users', async (req, res) => {
  try {
    if (req.body.password) req.body.plainPassword = req.body.password;
    const user = await User.create(req.body);
    const { password: _, ...safe } = user.toObject();
    res.status(201).json(safe);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/users/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      const bcrypt = require('bcryptjs');
      updates.plainPassword = updates.password;
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Calculate & save CGPA for a student from their finalized marks
router.post('/users/:id/calculate-cgpa', async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') return res.status(400).json({ message: 'Not a student' });
    const marks = await Mark.find({ studentId: student._id, isFinal: true });
    if (!marks.length) return res.status(400).json({ message: 'No finalized marks found' });
    // Grade point mapping
    const gp = (pct) => {
      if (pct >= 90) return 10; if (pct >= 80) return 9; if (pct >= 70) return 8;
      if (pct >= 60) return 7;  if (pct >= 50) return 6; if (pct >= 40) return 5; return 0;
    };
    const totalGP = marks.reduce((s, m) => s + gp((m.marks / m.maxMarks) * 100), 0);
    const cgpa = parseFloat((totalGP / marks.length).toFixed(2));
    await User.findByIdAndUpdate(student._id, { cgpa });
    res.json({ cgpa, marksCount: marks.length, message: `CGPA calculated: ${cgpa}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    const { password: _, ...safe } = user.toObject();
    res.json(safe);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Subject permissions for teachers
router.put('/users/:id/permissions', async (req, res) => {
  try {
    const { allowedSubjects } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { allowedSubjects }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id/grant-subject', async (req, res) => {
  try {
    const { subject } = req.body;
    const user = await User.findById(req.params.id);
    if (!user.allowedSubjects.includes(subject)) {
      user.allowedSubjects.push(subject);
      await user.save();
    }
    const { password: _, ...safe } = user.toObject();
    res.json(safe);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id/revoke-subject', async (req, res) => {
  try {
    const { subject } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { $pull: { allowedSubjects: subject } }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Stats ──────────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, students, teachers, marks, tickets, forms] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      Mark.countDocuments(),
      Ticket.countDocuments({ status: 'open' }),
      Form.countDocuments({ status: 'pending' }),
    ]);
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    res.json({ totalUsers, students, teachers, marks, tickets, forms, recentUsers });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Marks ──────────────────────────────────────────────────────────────────
router.get('/marks', async (req, res) => {
  try {
    const marks = await Mark.find().populate('studentId', 'name rollNumber').populate('teacherId', 'name').sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/marks/:id/toggle-final', async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id);
    mark.isFinal = !mark.isFinal;
    await mark.save();
    res.json(mark);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Forms ──────────────────────────────────────────────────────────────────
router.get('/forms', async (req, res) => {
  try {
    const forms = await Form.find().populate('studentId', 'name rollNumber').sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/forms/:id/approve', async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(form);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/forms/:id/reject', async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, { status: 'rejected', remarks: req.body.remarks || '' }, { new: true });
    res.json(form);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Tickets ────────────────────────────────────────────────────────────────
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('studentId', 'name rollNumber').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

const express = require('express');
const Mark = require('../models/Mark');
const Ticket = require('../models/Ticket');
const Form = require('../models/Form');
const { protect, requireRole } = require('../middleware/auth');
const router = express.Router();

router.use(protect, requireRole('student'));

// ── Marks ──────────────────────────────────────────────────────────────────
router.get('/marks', async (req, res) => {
  try {
    const marks = await Mark.find({ studentId: req.user._id, isFinal: true })
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Tickets ────────────────────────────────────────────────────────────────
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/tickets', async (req, res) => {
  try {
    const { title, category, description, isAnonymous, priority } = req.body;
    const ticket = await Ticket.create({
      studentId: req.user._id,
      studentName: isAnonymous ? 'Anonymous' : req.user.name,
      title, category, description, isAnonymous: !!isAnonymous, priority: priority || 'medium',
    });
    res.status(201).json(ticket);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/tickets/:id/reply', async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user._id },
      { $push: { replies: { sender: 'student', message: req.body.message, at: new Date() } } },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Forms ──────────────────────────────────────────────────────────────────
router.get('/forms', async (req, res) => {
  try {
    const forms = await Form.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/forms', async (req, res) => {
  try {
    const { examType, semester } = req.body;
    const form = await Form.create({
      studentId: req.user._id,
      studentName: req.user.name,
      rollNumber: req.user.rollNumber,
      examType: examType || 'regular',
      semester: semester || req.user.semester || 1,
    });
    res.status(201).json(form);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;

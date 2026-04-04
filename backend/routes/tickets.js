const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// POST /api/tickets — student creates ticket
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { subject, title, description, isAnonymous } = req.body;
    // Find teacher for this subject
    const teacher = await User.findOne({ role: 'teacher', subjects: subject });
    const ticket = await Ticket.create({
      studentId: req.user._id,
      subject,
      title,
      description,
      teacherId: teacher ? teacher._id : null,
      isAnonymous: isAnonymous !== false,
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tickets/mine — student's own tickets
router.get('/mine', protect, authorize('student'), async (req, res) => {
  try {
    const tickets = await Ticket.find({ studentId: req.user._id })
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tickets/:id/reply — student replies
router.put('/:id/reply', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    ticket.replies.push({
      senderId: req.user._id,
      senderRole: req.user.role,
      message: req.body.message,
    });
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tickets/:id — get single ticket
router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('studentId', 'name rollNumber')
      .populate('teacherId', 'name email');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

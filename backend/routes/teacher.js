const express = require('express');
const Mark = require('../models/Mark');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');
const router = express.Router();

router.use(protect, requireRole('teacher'));

// ── Marks ──────────────────────────────────────────────────────────────────
router.get('/marks', async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id);
    const allowed = teacher.allowedSubjects || teacher.subjects || [];
    const marks = await Mark.find({ subject: { $in: allowed } })
      .populate('studentId', 'name rollNumber')
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/marks', async (req, res) => {
  try {
    const { studentRollNumber, subject, marks, maxMarks, examType, semester, group } = req.body;
    // Verify teacher is allowed to upload for this subject
    const teacher = await User.findById(req.user._id);
    const allowed = teacher.allowedSubjects || teacher.subjects || [];
    if (!allowed.includes(subject))
      return res.status(403).json({ message: `Not permitted to upload marks for: ${subject}` });

    // Find student by roll number
    const student = await User.findOne({ rollNumber: studentRollNumber, role: 'student' });
    if (!student) return res.status(404).json({ message: `Student with roll number ${studentRollNumber} not found` });

    const mark = await Mark.create({
      studentId: student._id,
      rollNumber: studentRollNumber,
      teacherId: req.user._id,
      subject, marks: Number(marks), maxMarks: Number(maxMarks) || 100,
      examType, semester, group,
    });
    await mark.populate('studentId', 'name rollNumber');
    res.status(201).json(mark);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/marks/:id/finalize', async (req, res) => {
  try {
    const mark = await Mark.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user._id },
      { isFinal: true }, { new: true }
    );
    if (!mark) return res.status(404).json({ message: 'Mark not found or not yours' });
    res.json(mark);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Tickets ────────────────────────────────────────────────────────────────
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    // Mask identity for anonymous tickets
    const safe = tickets.map(t => {
      const obj = t.toObject();
      if (obj.isAnonymous) { obj.studentId = null; obj.studentName = 'Anonymous'; }
      return obj;
    });
    res.json(safe);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/tickets/:id/reply', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $push: { replies: { sender: 'teacher', message: req.body.message, at: new Date() } } },
      { new: true }
    );
    res.json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/tickets/:id/resolve', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
    res.json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Mark = require('../models/Mark');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const teacherAuth = [protect, authorize('teacher', 'admin')];

// GET /api/teacher/students — students in teacher's groups
router.get('/students', ...teacherAuth, async (req, res) => {
  try {
    const { group } = req.query;
    const filter = { role: 'student' };
    if (group) filter.groups = group;
    const students = await User.find(filter).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/teacher/marks — marks uploaded by this teacher
router.get('/marks', ...teacherAuth, async (req, res) => {
  try {
    const marks = await Mark.find({ teacherId: req.user._id })
      .populate('studentId', 'name rollNumber')
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/teacher/marks — upload marks (only if not final)
router.post('/marks', ...teacherAuth, async (req, res) => {
  try {
    const { studentRollNumber, subject, group, marks, maxMarks, examType, semester } = req.body;

    // Validate teacher has access to this subject
    if (req.user.role === 'teacher' && !req.user.subjects.includes(subject)) {
      return res.status(403).json({ message: 'You do not have access to this subject' });
    }

    const student = await User.findOne({ rollNumber: studentRollNumber, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found with this roll number' });

    // Check if final mark exists
    const existing = await Mark.findOne({ studentId: student._id, subject, examType, semester });
    if (existing && existing.isFinal) {
      return res.status(403).json({ message: 'Marks are finalized and cannot be changed' });
    }

    let mark;
    if (existing) {
      existing.marks = marks;
      existing.maxMarks = maxMarks || 100;
      existing.group = group;
      await existing.save();
      mark = existing;
    } else {
      mark = await Mark.create({
        studentId: student._id,
        teacherId: req.user._id,
        subject,
        group: group || '',
        rollNumber: studentRollNumber,
        studentName: student.name,
        marks,
        maxMarks: maxMarks || 100,
        examType: examType || 'internal',
        semester: semester || '',
      });
    }

    res.status(201).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/teacher/marks/:id/finalize — lock marks
router.put('/marks/:id/finalize', ...teacherAuth, async (req, res) => {
  try {
    const mark = await Mark.findOne({ _id: req.params.id, teacherId: req.user._id });
    if (!mark) return res.status(404).json({ message: 'Mark not found' });
    mark.isFinal = true;
    await mark.save();
    res.json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/teacher/tickets — tickets assigned to this teacher
router.get('/tickets', ...teacherAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ teacherId: req.user._id }).sort({ createdAt: -1 });
    // Hide student identity if anonymous
    const safeTickets = tickets.map((t) => {
      const obj = t.toObject();
      if (obj.isAnonymous) {
        obj.studentId = 'Anonymous';
      }
      return obj;
    });
    res.json(safeTickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/teacher/tickets/:id/reply
router.put('/tickets/:id/reply', ...teacherAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    ticket.replies.push({ senderId: req.user._id, senderRole: 'teacher', message: req.body.message });
    ticket.status = 'in-progress';
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/teacher/tickets/:id/resolve
router.put('/tickets/:id/resolve', ...teacherAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

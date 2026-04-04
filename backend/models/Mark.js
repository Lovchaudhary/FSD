const mongoose = require('mongoose');

const markSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    group: { type: String, required: true },
    rollNumber: { type: String, required: true },
    studentName: { type: String, required: true },
    marks: { type: Number, required: true, min: 0, max: 100 },
    maxMarks: { type: Number, default: 100 },
    examType: {
      type: String,
      enum: ['internal', 'external', 'assignment', 'practical'],
      default: 'internal',
    },
    isFinal: { type: Boolean, default: false },   // locked after final upload
    semester: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mark', markSchema);

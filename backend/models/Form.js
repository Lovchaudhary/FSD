const mongoose = require('mongoose');

const formSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    formType: {
      type: String,
      enum: ['exam', 'referal', 'admit_card'],
      required: true,
    },
    semester: { type: String, required: true },
    subjects: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    remarks: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Form', formSchema);

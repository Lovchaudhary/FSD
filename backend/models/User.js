const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  email:           { type: String, required: true, unique: true, lowercase: true },
  password:        { type: String, required: true },
  role:            { type: String, enum: ['student','teacher','admin'], default: 'student' },
  department:      { type: String, default: '' },
  rollNumber:      { type: String, default: '' },
  phone:           { type: String, default: '' },
  address:         { type: String, default: '' },
  avatar:          { type: String, default: '' },
  subjects:        [String],      // all subjects a teacher can teach
  allowedSubjects: [String],      // subjects admin has permitted for marks upload
  groups:          [String],
  semester:        { type: Number, default: 1 },
  year:            { type: Number, default: 1 },
  cgpa:            { type: Number, default: 0 },
  isActive:        { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', UserSchema);

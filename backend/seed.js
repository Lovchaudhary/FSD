/**
 * Seed all mock data into MongoDB
 * Run from: backend/ folder → node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Mark = require('./models/Mark');
const Ticket = require('./models/Ticket');
const Form = require('./models/Form');

const USERS = [
  { name: 'Dr. Priya Sharma',    email: 'admin@eduportal.com',                    password: 'Password123', role: 'admin',   department: 'Administration',   subjects: [], allowedSubjects: [], groups: [], phone: '+91-9876543200', isActive: true },
  { name: 'Prof. Rajinder Singh', email: 'rajinder.singh@eduportal.com',           password: 'Password123', role: 'teacher', department: 'Computer Science', subjects: ['Data Structures','Algorithms','Operating Systems'], allowedSubjects: ['Data Structures','Operating Systems'], groups: ['CS-A','CS-B','CS-C'], phone: '+91-9876543201', isActive: true },
  { name: 'Dr. Anita Mehta',     email: 'anita.mehta@eduportal.com',              password: 'Password123', role: 'teacher', department: 'Mathematics',      subjects: ['Calculus','Linear Algebra','Discrete Math'], allowedSubjects: ['Calculus'], groups: ['CS-A','EC-A','ME-A'], phone: '+91-9876543202', isActive: true },
  { name: 'Mr. Vikram Patel',    email: 'vikram.patel@eduportal.com',             password: 'Password123', role: 'teacher', department: 'Electronics',      subjects: ['Digital Electronics','VLSI Design','Microprocessors'], allowedSubjects: ['Digital Electronics','VLSI Design'], groups: ['EC-A','EC-B'], phone: '+91-9876543203', isActive: true },
  { name: 'Arjun Kapoor',        email: 'arjun.kapoor@student.eduportal.com',     password: 'Password123', role: 'student', department: 'Computer Science', rollNumber: 'CS2021001', groups: ['CS-A'], semester: 6, year: 3, cgpa: 8.7, isActive: true },
  { name: 'Simran Kaur',         email: 'simran.kaur@student.eduportal.com',      password: 'Password123', role: 'student', department: 'Computer Science', rollNumber: 'CS2021002', groups: ['CS-A'], semester: 6, year: 3, cgpa: 9.1, isActive: true },
  { name: 'Rohan Verma',         email: 'rohan.verma@student.eduportal.com',      password: 'Password123', role: 'student', department: 'Computer Science', rollNumber: 'CS2021003', groups: ['CS-B'], semester: 6, year: 3, cgpa: 7.8, isActive: true },
  { name: 'Priya Nair',          email: 'priya.nair@student.eduportal.com',       password: 'Password123', role: 'student', department: 'Electronics',      rollNumber: 'EC2022001', groups: ['EC-A'], semester: 4, year: 2, cgpa: 8.3, isActive: true },
  { name: 'Kabir Khan',          email: 'kabir.khan@student.eduportal.com',       password: 'Password123', role: 'student', department: 'Mechanical',       rollNumber: 'ME2023001', groups: ['ME-A'], semester: 2, year: 1, cgpa: 7.5, isActive: true },
  { name: 'Divya Rao',           email: 'divya.rao@student.eduportal.com',        password: 'Password123', role: 'student', department: 'Mathematics',      rollNumber: 'MA2021010', groups: ['CS-C'], semester: 6, year: 3, cgpa: 9.4, isActive: true },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  // Clear old data
  await Promise.all([User.deleteMany(), Mark.deleteMany(), Ticket.deleteMany(), Form.deleteMany()]);
  console.log('🗑️  Cleared existing data\n');

  // Insert users (password hashing is done in pre-save hook)
  const createdUsers = [];
  for (const u of USERS) {
    const user = await User.create(u);
    createdUsers.push(user);
    console.log(`✅ [${user.role.toUpperCase()}] ${user.name} — ${user.email}`);
  }

  const admin   = createdUsers.find(u => u.role === 'admin');
  const teacher = createdUsers.find(u => u.email.includes('rajinder'));
  const students = createdUsers.filter(u => u.role === 'student');

  // Seed some marks
  const markData = [
    { studentId: students[0]._id, rollNumber: students[0].rollNumber, teacherId: teacher._id, subject: 'Data Structures',  marks: 82, maxMarks: 100, examType: 'internal', semester: 'Semester 6', isFinal: true },
    { studentId: students[0]._id, rollNumber: students[0].rollNumber, teacherId: teacher._id, subject: 'Operating Systems', marks: 75, maxMarks: 100, examType: 'internal', semester: 'Semester 6', isFinal: true },
    { studentId: students[1]._id, rollNumber: students[1].rollNumber, teacherId: teacher._id, subject: 'Data Structures',  marks: 91, maxMarks: 100, examType: 'internal', semester: 'Semester 6', isFinal: true },
    { studentId: students[2]._id, rollNumber: students[2].rollNumber, teacherId: teacher._id, subject: 'Data Structures',  marks: 68, maxMarks: 100, examType: 'internal', semester: 'Semester 6', isFinal: false },
  ];
  await Mark.insertMany(markData);
  console.log(`\n📊 Seeded ${markData.length} marks`);

  // Seed some tickets
  await Ticket.insertMany([
    { studentId: students[0]._id, studentName: students[0].name, title: 'Marks not updated in portal', category: 'marks', priority: 'high', isAnonymous: false, status: 'open', replies: [] },
    { studentId: students[1]._id, studentName: 'Anonymous', title: 'Timetable conflict for CS-A', category: 'timetable', priority: 'low', isAnonymous: true, status: 'open', replies: [] },
  ]);
  console.log('🎫 Seeded 2 tickets');

  // Seed some forms
  await Form.insertMany([
    { studentId: students[0]._id, studentName: students[0].name, rollNumber: students[0].rollNumber, examType: 'regular', semester: 6, status: 'pending' },
    { studentId: students[1]._id, studentName: students[1].name, rollNumber: students[1].rollNumber, examType: 'regular', semester: 6, status: 'approved' },
  ]);
  console.log('📋 Seeded 2 forms');

  console.log('\n🎉 Seed complete! All users → password: Password123');
  await mongoose.disconnect();
}

seed().catch(err => { console.error('❌', err.message); process.exit(1); });

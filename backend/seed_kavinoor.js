require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Mark = require('./models/Mark');

async function run() {
  await require('./config/db')();
  
  // Find Kavinoor or create (checking multiple variants)
  let student = await User.findOne({ 
    $or: [{ email: /kavinoor/i }, { email: /kaa@gmail.com/i }, { name: /kavinoor/i }] 
  });
  
  if (!student) {
    student = await User.create({
      name: 'Kavinoor Kaur',
      email: 'kavinoor.kaur@student.eduportal.com',
      password: 'Password123',
      plainPassword: 'Password123',
      role: 'student'
    });
    console.log('CREATED NEW KAVINOOR');
  } else {
    student.name = 'Kavinoor Kaur';
    student.department = 'AI B';
    student.groups = ['AI B'];
    student.rollNumber = 'AI2021055';
    await student.save();
    console.log(`UPDATED EXISTING KAVINOOR (${student.email})`);
  }

  // Wipe old marks
  await Mark.deleteMany({ studentId: student._id });
  
  // Generate a full result marksheet
  const subjectsSem1 = ['Programming in C', 'Engineering Math I', 'Applied Physics', 'Communication Skills'];
  const subjectsSem2 = ['Data Structures', 'Engineering Math II', 'Digital Logic', 'Web Technologies'];
  
  let allMarks = [];
  
  for (let s of subjectsSem1) {
    allMarks.push({
      studentId: student._id,
      rollNumber: student.rollNumber,
      semester: 1,
      subject: s,
      marks: Math.floor(Math.random() * 20) + 75, // 75-94
      maxMarks: 100,
      isFinal: true
    });
  }
  
  for (let s of subjectsSem2) {
    allMarks.push({
      studentId: student._id,
      rollNumber: student.rollNumber,
      semester: 2,
      subject: s,
      marks: Math.floor(Math.random() * 15) + 85, // 85-99
      maxMarks: 100,
      isFinal: true
    });
  }
  
  await Mark.insertMany(allMarks);
  
  // Grade point mapping function
  const gp = (pct) => {
    if (pct >= 90) return 10; if (pct >= 80) return 9; if (pct >= 70) return 8;
    if (pct >= 60) return 7;  if (pct >= 50) return 6; if (pct >= 40) return 5; return 0;
  };
  
  const totalGP = allMarks.reduce((s, m) => s + gp((m.marks / m.maxMarks) * 100), 0);
  const newCgpa = (totalGP / allMarks.length).toFixed(2);
  
  student.cgpa = newCgpa;
  student.semester = 3;
  await student.save();
  
  console.log(`Successfully generated full marksheet! CGPA: ${newCgpa}`);
  process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});

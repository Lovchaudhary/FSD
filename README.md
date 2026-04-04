# 🎓 EduPortal — Student Management System (MERN)

## Quick Start

### Prerequisites
- Node.js installed
- MongoDB running locally on port 27017

### 1. Start MongoDB (if not already running)
```
mongod
```

### 2. Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

### 3. Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
App runs on: http://localhost:3000

---

## Default Admin Credentials
- **Email:** admin@portal.com
- **Password:** admin123

---

## Features by Role

### 👨‍💼 Admin
- View dashboard with charts and stats
- Create/Edit/Delete users (students & teachers)
- **Change any user's name, email, password**
- Assign subjects/groups to teachers
- View ALL tickets (including anonymous — identity visible to admin)
- Finalize/unlock marks
- Approve/reject student forms

### 👨‍🏫 Teacher
- Upload marks by student roll number
- Only for assigned subjects & groups
- Lock (finalize) marks — cannot edit after final
- View & reply to student tickets (student identity hidden if anonymous)

### 🎒 Student
- View dashboard with performance charts
- See own marks with bar charts
- Submit Exam Forms, Referal Forms, Admit Card requests
- Raise anonymous tickets to subject teachers
- View/reply to ticket threads
- Update own name/phone/password in Settings

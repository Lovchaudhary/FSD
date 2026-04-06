import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Auth Pages
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentMarks from './pages/student/Marks';
import StudentResults from './pages/student/Results';
import StudentAdmitCard from './pages/student/AdmitCard';
import StudentTimetable from './pages/student/Timetable';
import StudentAttendance from './pages/student/Attendance';
import StudentForms from './pages/student/Forms';
import StudentFees from './pages/student/Fees';
import StudentRevaluation from './pages/student/Revaluation';
import StudentBackPaper from './pages/student/BackPaper';
import StudentTickets from './pages/student/Tickets';
import StudentExamInfo from './pages/student/ExamInfo';
import StudentSettings from './pages/student/Settings';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherProfile from './pages/teacher/Profile';
import UploadMarks from './pages/teacher/UploadMarks';
import EvaluationForm from './pages/teacher/EvaluationForm';
import AnswerSheet from './pages/teacher/AnswerSheet';
import TeacherTimetable from './pages/teacher/Timetable';
import TeacherTickets from './pages/teacher/Tickets';
import TeacherSettings from './pages/teacher/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminMarks from './pages/admin/Marks';
import AdminForms from './pages/admin/Forms';
import AdminTimetable from './pages/admin/Timetable';
import AdminFees from './pages/admin/Fees';
import AdminTickets from './pages/admin/Tickets';
import AdminMonitoring from './pages/admin/Monitoring';
import AdminDatabase from './pages/admin/Database';
import AdminSettings from './pages/admin/AdminSettings';
import SecretAdmin from './pages/admin/SecretAdmin';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <Layout>{children}</Layout>;
};

const HomeRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'teacher') return <Navigate to="/teacher" />;
  return <Navigate to="/student" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/secret-admin" element={<SecretAdmin />} />
          <Route path="/" element={<HomeRoute />} />

          {/* Student Routes */}
          <Route path="/student" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/profile" element={<PrivateRoute role="student"><StudentProfile /></PrivateRoute>} />
          <Route path="/student/marks" element={<PrivateRoute role="student"><StudentMarks /></PrivateRoute>} />
          <Route path="/student/results" element={<PrivateRoute role="student"><StudentResults /></PrivateRoute>} />
          <Route path="/student/admit-card" element={<PrivateRoute role="student"><StudentAdmitCard /></PrivateRoute>} />
          <Route path="/student/timetable" element={<PrivateRoute role="student"><StudentTimetable /></PrivateRoute>} />
          <Route path="/student/attendance" element={<PrivateRoute role="student"><StudentAttendance /></PrivateRoute>} />
          <Route path="/student/forms" element={<PrivateRoute role="student"><StudentForms /></PrivateRoute>} />
          <Route path="/student/fees" element={<PrivateRoute role="student"><StudentFees /></PrivateRoute>} />
          <Route path="/student/revaluation" element={<PrivateRoute role="student"><StudentRevaluation /></PrivateRoute>} />
          <Route path="/student/backpaper" element={<PrivateRoute role="student"><StudentBackPaper /></PrivateRoute>} />
          <Route path="/student/tickets" element={<PrivateRoute role="student"><StudentTickets /></PrivateRoute>} />
          <Route path="/student/exam-info" element={<PrivateRoute role="student"><StudentExamInfo /></PrivateRoute>} />
          <Route path="/student/settings" element={<PrivateRoute role="student"><StudentSettings /></PrivateRoute>} />

          {/* Teacher Routes */}
          <Route path="/teacher" element={<PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>} />
          <Route path="/teacher/profile" element={<PrivateRoute role="teacher"><TeacherProfile /></PrivateRoute>} />
          <Route path="/teacher/marks" element={<PrivateRoute role="teacher"><UploadMarks /></PrivateRoute>} />
          <Route path="/teacher/evaluation" element={<PrivateRoute role="teacher"><EvaluationForm /></PrivateRoute>} />
          <Route path="/teacher/answersheet" element={<PrivateRoute role="teacher"><AnswerSheet /></PrivateRoute>} />
          <Route path="/teacher/timetable" element={<PrivateRoute role="teacher"><TeacherTimetable /></PrivateRoute>} />
          <Route path="/teacher/tickets" element={<PrivateRoute role="teacher"><TeacherTickets /></PrivateRoute>} />
          <Route path="/teacher/settings" element={<PrivateRoute role="teacher"><TeacherSettings /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute role="admin"><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/marks" element={<PrivateRoute role="admin"><AdminMarks /></PrivateRoute>} />
          <Route path="/admin/forms" element={<PrivateRoute role="admin"><AdminForms /></PrivateRoute>} />
          <Route path="/admin/timetable" element={<PrivateRoute role="admin"><AdminTimetable /></PrivateRoute>} />
          <Route path="/admin/fees" element={<PrivateRoute role="admin"><AdminFees /></PrivateRoute>} />
          <Route path="/admin/tickets" element={<PrivateRoute role="admin"><AdminTickets /></PrivateRoute>} />
          <Route path="/admin/monitoring" element={<PrivateRoute role="admin"><AdminMonitoring /></PrivateRoute>} />
          <Route path="/admin/database" element={<PrivateRoute role="admin"><AdminDatabase /></PrivateRoute>} />
          <Route path="/admin/settings" element={<PrivateRoute role="admin"><AdminSettings /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

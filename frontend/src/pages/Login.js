import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

const ROLES = [
  { id: 'student', emoji: '🎒', label: 'Student' },
  { id: 'teacher', emoji: '👨‍🏫', label: 'Teacher' },
  { id: 'admin', emoji: '⚙️', label: 'Admin' },
];

const LEFT_FEATURES = [
  { icon: '📋', text: 'Exam Form Submission & Tracking' },
  { icon: '📊', text: 'Live Marks & Performance Charts' },
  { icon: '🎫', text: 'Anonymous Ticket System' },
  { icon: '🎓', text: 'Admit Card & Result Download' },
];

const ANNOUNCEMENTS = [
  { type: 'notice', icon: 'ℹ️', text: 'Semester exam forms open until Apr 15' },
  { type: 'alert', icon: '⚠️', text: 'Fee submission deadline: Apr 30' },
];

// Simple calendar widget
function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const [view, setView] = useState({ year, month });

  const monthName = new Date(view.year, view.month).toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Event days (mock)
  const eventDays = [5, 12, 15, 22, 28];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="auth-calendar">
      <div className="auth-calendar-header">
        <button onClick={() => setView(v => {
          const m = v.month - 1;
          return m < 0 ? { year: v.year - 1, month: 11 } : { ...v, month: m };
        })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 4px' }}>
          <ChevronLeft size={14} />
        </button>
        <span>{monthName}</span>
        <button onClick={() => setView(v => {
          const m = v.month + 1;
          return m > 11 ? { year: v.year + 1, month: 0 } : { ...v, month: m };
        })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 4px' }}>
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="auth-calendar-grid">
        {dayLabels.map(d => <div key={d} className="cal-day header">{d}</div>)}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`cal-day ${day === today.getDate() && view.month === today.getMonth() && view.year === today.getFullYear()
                ? 'today'
                : eventDays.includes(day) ? 'has-event' : ''
              }`}
          >
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', rollNumber: '', department: '',
    subjects: '', groups: '',
  });
  const [resetEmail, setResetEmail] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Apply default theme on login page
  useEffect(() => {
    document.documentElement.classList.remove('theme-violet', 'theme-rose', 'theme-teal', 'theme-amber');
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isForgot) {
        toast.success('Password reset link sent to your email!');
        setIsForgot(false);
        setLoading(false);
        return;
      }
      if (isLogin) {
        const { data } = await API.post('/auth/login', { email: form.email, password: form.password });
        login(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}! 🎉`);
        navigate(`/${data.user.role}`);
      } else {
        const payload = {
          name: form.name, email: form.email, password: form.password, role,
          rollNumber: form.rollNumber,
          department: form.department,
          subjects: form.subjects ? form.subjects.split(',').map(s => s.trim()) : [],
          groups: form.groups ? form.groups.split(',').map(g => g.trim()) : [],
        };
        const { data } = await API.post('/auth/signup', payload);
        login(data.user, data.token);
        toast.success('Account created successfully! 🎓');
        navigate(`/${data.user.role}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const pageTitle = isForgot ? 'Reset Password' : isLogin ? 'Welcome back!' : 'Create account';
  const pageSubtitle = isForgot
    ? "We'll send a reset link to your email"
    : isLogin
      ? 'Sign in to your portal account'
      : 'Join EduPortal today';

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-page-left">
        <div className="auth-left-content">
          <div className="auth-left-logo">🎓</div>
          <h1>EduPortal</h1>
          <p>Your all-in-one academic management platform for students, teachers &amp; admins.</p>
          <div className="auth-features">
            {LEFT_FEATURES.map((f, i) => (
              <div key={i} className="auth-feature-item">
                <div className="auth-feature-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-page-right">
        <div className="auth-card">
          <div className="auth-logo">
            <h2>{pageTitle}</h2>
            <p>{pageSubtitle}</p>
          </div>

          {/* Role tabs — only for sign up */}
          {!isLogin && !isForgot && (
            <div className="role-tabs">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  className={`role-tab ${role === r.id ? 'active' : ''}`}
                  onClick={() => setRole(r.id)}
                  type="button"
                >
                  <span className="role-emoji">{r.emoji}</span>
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* Forgot Password Form */}
          {isForgot ? (
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="Enter your registered email"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <div className="auth-switch">
                <button type="button" onClick={() => setIsForgot(false)}>← Back to Sign In</button>
              </div>
            </form>
          ) : (
            <form onSubmit={submit}>
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-control" name="name" placeholder="" value={form.name} onChange={handle} required />
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" name="email" type="email" placeholder="" value={form.email} onChange={handle} required />
              </div>

              <div className="form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-control"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handle}
                    required
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {isLogin && (
                  <div style={{ textAlign: 'right', marginTop: 6 }}>
                    <button
                      type="button"
                      onClick={() => setIsForgot(true)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {!isLogin && role === 'student' && (
                <>
                  <div className="form-group">
                    <label>Roll Number</label>
                    <input className="form-control" name="rollNumber" placeholder="" value={form.rollNumber} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input className="form-control" name="department" placeholder="" value={form.department} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label>Section / Group</label>
                    <input className="form-control" name="groups" placeholder="" value={form.groups} onChange={handle} />
                  </div>
                </>
              )}

              {!isLogin && role === 'teacher' && (
                <>
                  <div className="form-group">
                    <label>Department</label>
                    <input className="form-control" name="department" placeholder="" value={form.department} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label>Subjects (comma-separated)</label>
                    <input className="form-control" name="subjects" placeholder="" value={form.subjects} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label>Groups / Classes</label>
                    <input className="form-control" name="groups" placeholder="" value={form.groups} onChange={handle} />
                  </div>
                </>
              )}

              <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} disabled={loading}>
                {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
              </button>

              <div className="auth-switch">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </div>

              {isLogin && (
                <div style={{ marginTop: 16, padding: '11px 14px', background: 'rgba(108,99,255,0.07)', borderRadius: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', border: '1px solid rgba(108,99,255,0.15)' }}>
                  <strong style={{ color: 'var(--accent)' }}>Default Admin:</strong> admin@portal.com / admin123
                </div>
              )}
            </form>
          )}

          {/* Announcement cards below the form */}
          <div className="auth-info-cards">
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={i} className={`auth-info-card ${a.type}`}>
                <span>{a.icon}</span>
                {a.text}
              </div>
            ))}
          </div>

          {/* Mini Calendar */}
          <MiniCalendar />
        </div>
      </div>
    </div>
  );
}

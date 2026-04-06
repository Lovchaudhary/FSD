import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const ROLES = [
  { id: 'student', emoji: '🎒', label: 'Student' },
  { id: 'teacher', emoji: '👨‍🏫', label: 'Teacher' },
  { id: 'admin', emoji: '⚙️', label: 'Admin' },
];

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
        const { data } = await API.post('/auth/register', payload);
        login(data.user, data.token);
        toast.success(`Account created! Welcome, ${data.user.name}! 🎉`);
        navigate(`/${data.user.role}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const pageTitle = isForgot ? 'Reset Password' : isLogin ? 'Welcome back!' : 'Create account';
  const pageSubtitle = isForgot
    ? "We'll send a reset link to your email"
    : isLogin ? 'Sign in to your portal account' : 'Join ExamCell today';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,124,84,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-15%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 24,
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
        padding: '48px 44px',
        width: '100%',
        maxWidth: 460,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(224,124,84,0.3)' }}>🎓</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>{pageTitle}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{pageSubtitle}</p>
        </div>


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
                <input className="form-control" name="name" placeholder="Your full name" value={form.name} onChange={handle} required />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input className="form-control" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
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
                  <input className="form-control" name="rollNumber" placeholder="e.g. CS2021001" value={form.rollNumber} onChange={handle} />
                </div>
              </>
            )}


            <button className="btn btn-primary btn-full" style={{ marginTop: 8, padding: '14px', fontSize: 15, borderRadius: 14 }} disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
            </button>

            <div className="auth-switch" style={{ marginTop: 20, textAlign: 'center' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

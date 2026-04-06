import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Camera, Edit3, Save, X, Mail, Phone, Building, Hash, User, BookOpen, Calendar } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Profile Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return <div style={{padding: '50px', color: 'red'}}><h1>Something went wrong.</h1><pre>{this.state.error && this.state.error.toString()}</pre></div>;
    }
    return this.props.children;
  }
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    rollNumber: user?.rollNumber || '',
    dob: user?.dob || '',
    address: user?.address || '',
    bio: user?.bio || '',
  });
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const fileRef = useRef(null);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result);
      const updated = { ...user, avatar: ev.target.result };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success('Profile photo updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updated = { ...user, ...form, avatar };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const roleLabel = user?.role === 'student' ? '🎒 Student'
    : user?.role === 'teacher' ? '👨‍🏫 Teacher'
    : '⚙️ Admin';

  const STATS = user?.role === 'student'
    ? [
        { label: 'Semester', value: '4th' },
        { label: 'CGPA', value: '8.4' },
        { label: 'Attendance', value: '87%' },
        { label: 'Backlogs', value: '0' },
      ]
    : user?.role === 'teacher'
    ? [
        { label: 'Classes', value: '5' },
        { label: 'Students', value: '148' },
        { label: 'Subjects', value: (user?.subjects || []).length || '3' },
        { label: 'Exp. (yrs)', value: '7' },
      ]
    : [
        { label: 'Users', value: '312' },
        { label: 'Active Now', value: '24' },
        { label: 'Tickets', value: '12' },
        { label: 'Exams', value: '6' },
      ];

  return (
    <ErrorBoundary>
    <div className="page-enter">
      <div className="page-content">
        {/* Hero Card */}
        <div className="profile-header-card" style={{ marginBottom: 24 }}>
          {/* Avatar upload */}
          <div className="avatar-upload-wrapper" onClick={() => fileRef.current.click()}>
            <div className="avatar-lg">
              {avatar ? <img src={avatar} alt="avatar" /> : initials}
            </div>
            <div className="avatar-upload-overlay">
              <Camera size={22} />
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </div>

          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{user?.name || 'User'}</h2>
            <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 12 }}>{roleLabel} · {user?.department || 'Department not set'}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.18)' }}>
                📧 {user?.email || 'No email'}
              </span>
              {user?.rollNumber && (
                <span style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.18)' }}>
                  🔢 {user.rollNumber}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, position: 'relative', zIndex: 1 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.08)', padding: '14px 10px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <style>{`
            @media (max-width: 768px) {
              .profile-header-card > div:last-child { grid-template-columns: repeat(2,1fr); }
            }
          `}</style>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Edit Form */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Personal Information</div>
                <div className="card-subtitle">Manage your account details</div>
              </div>
              {editing ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
                    <X size={14} /> Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleSave}>
                    <Save size={14} /> Save
                  </button>
                </div>
              ) : (
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                  <Edit3 size={14} /> Edit Profile
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {[
                { icon: User, label: 'Full Name', name: 'name', placeholder: 'John Doe' },
                { icon: Mail, label: 'Email Address', name: 'email', placeholder: 'you@example.com', type: 'email' },
                { icon: Phone, label: 'Phone Number', name: 'phone', placeholder: '+91 98765 43210' },
                { icon: Building, label: 'Department', name: 'department', placeholder: 'Computer Science' },
                ...(user?.role === 'student' ? [
                  { icon: Hash, label: 'Roll Number', name: 'rollNumber', placeholder: 'CS2021001' },
                  { icon: Calendar, label: 'Date of Birth', name: 'dob', placeholder: '2000-01-15', type: 'date' },
                ] : []),
              ].map(({ icon: Icon, label, name, placeholder, type = 'text' }) => (
                <div key={name} className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={13} /> {label}
                  </label>
                  {editing ? (
                    <input className="form-control" name={name} placeholder={placeholder} type={type} value={form[name]} onChange={handle} />
                  ) : (
                    <div style={{ padding: '12px 16px', background: 'var(--warm-1)', borderRadius: 'var(--radius)', border: '1.5px solid var(--card-border)', fontSize: 14, color: form[name] ? 'var(--text)' : 'var(--text-dim)', fontWeight: form[name] ? 500 : 400 }}>
                      {form[name] || <em style={{ color: 'var(--text-dim)' }}>Not set</em>}
                    </div>
                  )}
                </div>
              ))}

              <div className="form-group" style={{ gridColumn: '1/-1', marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BookOpen size={13} /> Bio / About
                </label>
                {editing ? (
                  <textarea className="form-control" name="bio" rows={3} placeholder="Tell us about yourself..." value={form.bio} onChange={handle} style={{ resize: 'vertical' }} />
                ) : (
                  <div style={{ padding: '12px 16px', background: 'var(--warm-1)', borderRadius: 'var(--radius)', border: '1.5px solid var(--card-border)', fontSize: 14, color: form.bio ? 'var(--text)' : 'var(--text-dim)', minHeight: 70 }}>
                    {form.bio || <em>No bio set yet.</em>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Photo Upload */}
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="card-title" style={{ marginBottom: 16 }}>Profile Photo</div>
              <div className="avatar-upload-wrapper" style={{ marginBottom: 16 }} onClick={() => fileRef.current.click()}>
                <div className="avatar-lg" style={{ width: 90, height: 90, fontSize: 30 }}>
                  {avatar ? <img src={avatar} alt="avatar" /> : initials}
                </div>
                <div className="avatar-upload-overlay"><Camera size={20} /></div>
              </div>
              <button className="btn btn-ghost btn-sm btn-full" onClick={() => fileRef.current.click()}>
                <Camera size={14} /> Change Photo
              </button>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8 }}>JPG, PNG up to 5MB</p>
            </div>

            {/* Account Info */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>Account Info</div>
              {[
                { label: 'Role', value: roleLabel },
                { label: 'Account ID', value: user?._id?.slice(-8) || 'N/A' },
                { label: 'Member Since', value: 'Jan 2024' },
                { label: 'Last Login', value: 'Today, 9:30 AM' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--card-border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}

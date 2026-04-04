import React, { useState } from 'react';
import { Bell, Lock, Palette, User, Save, Moon, Sun, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const THEMES = [
  { name: 'default', label: 'Warm Coral', color: '#e07c54' },
  { name: 'theme-violet', label: 'Violet', color: '#6c63ff' },
  { name: 'theme-rose', label: 'Rose', color: '#f43f5e' },
  { name: 'theme-teal', label: 'Teal', color: '#0d9488' },
  { name: 'theme-amber', label: 'Amber', color: '#d97706' },
];

export default function Settings() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'default');
  const [notifications, setNotifications] = useState({
    email: true, marks: true, tickets: true, announcements: false,
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [tab, setTab] = useState('appearance');

  const applyTheme = (t) => {
    setTheme(t);
    const body = document.documentElement;
    THEMES.forEach(th => body.classList.remove(th.name));
    if (t !== 'default') body.classList.add(t);
    localStorage.setItem('theme', t);
    toast.success('Theme updated!');
  };

  const savePassword = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error('Passwords do not match!');
      return;
    }
    toast.success('Password updated successfully!');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const TABS = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Settings</h3>
            <p>Customize your portal experience</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
          {/* Sidebar Tabs */}
          <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`nav-link ${tab === id ? 'active' : ''}`}
                  style={{ color: tab === id ? 'var(--primary)' : 'var(--text-muted)', background: tab === id ? 'var(--primary-glow)' : 'transparent' }}
                  onClick={() => setTab(id)}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            {tab === 'appearance' && (
              <div className="card">
                <div className="card-title" style={{ marginBottom: 24 }}>🎨 Theme & Appearance</div>

                <div className="form-group">
                  <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Color Theme</label>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    {THEMES.map(t => (
                      <button
                        key={t.name}
                        onClick={() => applyTheme(t.name)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: '10px',
                        }}
                      >
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%', background: t.color,
                          border: theme === t.name ? `3px solid ${t.color}` : '3px solid transparent',
                          boxShadow: theme === t.name ? `0 0 0 3px ${t.color}40` : 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                          transition: 'var(--transition)', transform: theme === t.name ? 'scale(1.1)' : 'scale(1)',
                        }}>
                          {theme === t.name && <span style={{ color: 'white', fontWeight: 900, fontSize: 16 }}>✓</span>}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: theme === t.name ? t.color : 'var(--text-muted)' }}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                <div className="form-group">
                  <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: 10 }}>Language</label>
                  <select className="form-control" style={{ maxWidth: 260 }}>
                    <option>English (Default)</option>
                    <option>हिन्दी (Hindi)</option>
                    <option>मराठी (Marathi)</option>
                    <option>தமிழ் (Tamil)</option>
                  </select>
                </div>

                <div className="divider" />

                <div className="form-group">
                  <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: 10 }}>Font Size</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['Small', 'Medium', 'Large'].map((s, i) => (
                      <button key={s} className={`btn btn-sm ${i === 1 ? 'btn-primary' : 'btn-ghost'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'notifications' && (
              <div className="card">
                <div className="card-title" style={{ marginBottom: 24 }}>🔔 Notification Preferences</div>
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'marks', label: 'Marks Published', desc: 'Alert when new marks are uploaded' },
                  { key: 'tickets', label: 'Ticket Replies', desc: 'Notify when a teacher replies' },
                  { key: 'announcements', label: 'Announcements', desc: 'General portal announcements' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--card-border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                    </div>
                    <div
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                      style={{
                        width: 46, height: 26, borderRadius: 13, cursor: 'pointer',
                        background: notifications[key] ? 'var(--primary)' : 'var(--warm-4)',
                        transition: 'background 0.2s',
                        position: 'relative',
                        boxShadow: notifications[key] ? '0 0 0 3px var(--primary-glow)' : 'none',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 3, left: notifications[key] ? 23 : 3,
                        width: 20, height: 20, borderRadius: '50%', background: 'white',
                        transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                      }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => toast.success('Notification preferences saved!')}>
                    <Save size={14} /> Save Preferences
                  </button>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="card">
                <div className="card-title" style={{ marginBottom: 24 }}>🔒 Change Password</div>
                <form onSubmit={savePassword}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input className="form-control" type="password" placeholder="Enter current password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input className="form-control" type="password" placeholder="At least 8 characters" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input className="form-control" type="password" placeholder="Re-enter new password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} required />
                  </div>
                  <button className="btn btn-primary" type="submit">
                    <Lock size={14} /> Update Password
                  </button>
                </form>

                <div className="divider" />

                <div className="card-title" style={{ marginBottom: 16 }}>🛡️ Active Sessions</div>
                {[
                  { device: 'Chrome — Windows 11', last: 'Now', current: true },
                  { device: 'Safari — iPhone 14', last: '2 hours ago', current: false },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--card-border)', fontSize: 13 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.device}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.last} · {s.current ? 'Current session' : 'Other session'}</div>
                    </div>
                    {!s.current && <button className="btn btn-danger btn-xs" onClick={() => toast.success('Session revoked!')}>Revoke</button>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

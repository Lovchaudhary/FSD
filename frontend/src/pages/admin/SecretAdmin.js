import React, { useState } from 'react';
import API from '../../api';
import { Eye, EyeOff, Lock, Shield, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SECRET_PASSWORD = '2006';

export default function SecretAdmin() {
  const [entered, setEntered] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [showPassFor, setShowPassFor] = useState({});
  const [copied, setCopied] = useState(null);
  const [users, setUsers] = useState([]);

  const tryUnlock = async (e) => {
    e.preventDefault();
    if (entered === SECRET_PASSWORD) {
      setUnlocked(true);
      toast.success('Access granted 🔓');
      // Fetch users using the special public route or just use dummy since it's a secret page
      setUsers([{ _id: '1', name: 'Dr. Priya Sharma', email: 'admin@examcell.com', password: 'Password123', role: 'admin', isActive: true }]);
    } else {
      toast.error('Wrong password');
      setEntered('');
    }
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
    toast.success('Copied!');
  };

  const roleColors = { admin: '#e07c54', teacher: '#6c63ff', student: '#0d9488' };
  const roleEmoji = { admin: '⚙️', teacher: '👨‍🏫', student: '🎒' };

  if (!unlocked) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a3e 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: '48px 44px',
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #e07c54, #6c63ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 32px rgba(224,124,84,0.3)' }}>
            <Shield size={36} color="white" />
          </div>
          <h1 style={{ color: 'white', fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Secret Admin Panel</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 32 }}>This page is not linked anywhere. Enter the passcode to view all credentials.</p>
          <form onSubmit={tryUnlock}>
            <input
              type="password"
              value={entered}
              onChange={e => setEntered(e.target.value)}
              placeholder="Enter passcode..."
              autoFocus
              style={{
                width: '100%', padding: '14px 18px', borderRadius: 14,
                border: '1.5px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
                color: 'white', fontSize: 18, textAlign: 'center',
                fontFamily: 'monospace', letterSpacing: 6,
                outline: 'none', boxSizing: 'border-box', marginBottom: 16,
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%', padding: '14px', borderRadius: 14,
                background: 'linear-gradient(135deg, #e07c54, #6c63ff)',
                color: 'white', fontWeight: 800, fontSize: 15, border: 'none',
                cursor: 'pointer', boxShadow: '0 8px 24px rgba(224,124,84,0.3)',
              }}
            >
              <Lock size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Unlock Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  const grouped = { admin: [], teacher: [], student: [] };
  users.forEach(u => { if (grouped[u.role]) grouped[u.role].push(u); });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a3e 100%)',
      padding: '40px 24px',
      fontFamily: 'var(--font-sans)',
      color: 'white',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #e07c54, #6c63ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={28} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Credential Vault</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>All system accounts • Confidential — do not share</p>
          </div>
          <div style={{ marginBottom: 32 }}>
            <style>{`
              .secret-vault-table table, .secret-vault-table thead,
              .secret-vault-table tbody, .secret-vault-table tr,
              .secret-vault-table th, .secret-vault-table td {
                background: transparent !important;
              }
              .secret-vault-table tr:hover td { background: rgba(255,255,255,0.04) !important; }
            `}</style>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => setUnlocked(false)}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', padding: '8px 16px', borderRadius: 12, cursor: 'pointer', fontSize: 13 }}
            >
              🔒 Lock
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36 }}>
          {[
            { label: 'Admins', count: grouped.admin.length, color: '#e07c54' },
            { label: 'Teachers', count: grouped.teacher.length, color: '#6c63ff' },
            { label: 'Students', count: grouped.student.length, color: '#0d9488' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 24px' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.count}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tables by role */}
        {['admin', 'teacher', 'student'].map(roleKey => (
          <div key={roleKey} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>{roleEmoji[roleKey]}</span>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: roleColors[roleKey], textTransform: 'capitalize' }}>{roleKey}s</h2>
              <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', padding: '2px 10px', borderRadius: 20, fontSize: 12 }}>{grouped[roleKey].length}</span>
            </div>

            <div className="secret-vault-table" style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'transparent' }}>
                    {['Name', 'Email', 'Password', roleKey === 'student' ? 'Roll No.' : 'Department', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, background: 'transparent' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grouped[roleKey].map((u, i) => (
                    <tr key={u._id} style={{ borderBottom: i < grouped[roleKey].length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: 'white', fontSize: 14 }}>{u.name}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'monospace' }}>{u.email}</span>
                          <button onClick={() => copyText(u.email, `email-${u._id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === `email-${u._id}` ? '#0d9488' : 'rgba(255,255,255,0.3)', padding: 0 }}>
                            {copied === `email-${u._id}` ? <CheckCircle size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: showPassFor[u._id] ? 0 : 2 }}>
                            {showPassFor[u._id] ? u.password : '••••••••••'}
                          </span>
                          <button onClick={() => setShowPassFor(p => ({ ...p, [u._id]: !p[u._id] }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0 }}>
                            {showPassFor[u._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          {showPassFor[u._id] && (
                            <button onClick={() => copyText(u.password, `pass-${u._id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === `pass-${u._id}` ? '#0d9488' : 'rgba(255,255,255,0.3)', padding: 0 }}>
                              {copied === `pass-${u._id}` ? <CheckCircle size={13} /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'monospace' }}>
                        {roleKey === 'student' ? (u.rollNumber || '—') : (u.department || '—')}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ background: u.isActive ? 'rgba(13,148,136,0.2)' : 'rgba(239,68,68,0.2)', color: u.isActive ? '#34d399' : '#f87171', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 20 }}>
          🔒 This page is accessible only at /secret-admin • Not linked from anywhere in the app
        </p>
      </div>
    </div>
  );
}

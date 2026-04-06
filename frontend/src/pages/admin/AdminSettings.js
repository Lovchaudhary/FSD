import React, { useState } from 'react';
import { ShieldCheck, Save, RefreshCw, Users, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    allowStudentSignup: true,
    allowTeacherSignup: false,
    maintenanceMode: false,
    emailNotifications: true,
    maxFileUploadMB: 10,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'admin@examcell.com',
  });

  const handle = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const save = () => toast.success('System settings saved successfully!');

  const Toggle = ({ value, onChange, label, desc }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--card-border)' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>}
      </div>
      <div onClick={() => onChange(!value)} style={{ width: 46, height: 26, borderRadius: 13, cursor: 'pointer', background: value ? 'var(--primary)' : 'var(--warm-4)', transition: 'background 0.2s', position: 'relative', boxShadow: value ? '0 0 0 3px var(--primary-glow)' : 'none', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
      </div>
    </div>
  );

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>System Configuration</h3>
            <p>Manage portal-wide settings and security</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={save}>
            <Save size={15} /> Save All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Security */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>🔐 Security Settings</div>
            <Toggle label="Allow Student Self-Signup" desc="Students can register without admin approval" value={settings.allowStudentSignup} onChange={v => handle('allowStudentSignup', v)} />
            <Toggle label="Allow Teacher Self-Signup" desc="Teachers can register without admin approval" value={settings.allowTeacherSignup} onChange={v => handle('allowTeacherSignup', v)} />
            <Toggle label="Maintenance Mode" desc="Restrict access to admin only" value={settings.maintenanceMode} onChange={v => handle('maintenanceMode', v)} />
            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Max Login Attempts</label>
              <input className="form-control" type="number" value={settings.maxLoginAttempts} onChange={e => handle('maxLoginAttempts', +e.target.value)} min={1} max={20} />
            </div>
            <div className="form-group">
              <label>Session Timeout (minutes)</label>
              <input className="form-control" type="number" value={settings.sessionTimeout} onChange={e => handle('sessionTimeout', +e.target.value)} min={5} max={1440} />
            </div>
          </div>

          {/* Email / SMTP */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>📧 Email Configuration (SMTP)</div>
            <Toggle label="Email Notifications" desc="Send system emails (marks, tickets, etc.)" value={settings.emailNotifications} onChange={v => handle('emailNotifications', v)} />
            <div style={{ marginTop: 14 }}>
              <div className="form-group">
                <label>SMTP Host</label>
                <input className="form-control" value={settings.smtpHost} onChange={e => handle('smtpHost', e.target.value)} />
              </div>
              <div className="form-group">
                <label>SMTP Port</label>
                <input className="form-control" type="number" value={settings.smtpPort} onChange={e => handle('smtpPort', +e.target.value)} />
              </div>
              <div className="form-group">
                <label>SMTP Username</label>
                <input className="form-control" value={settings.smtpUser} onChange={e => handle('smtpUser', e.target.value)} />
              </div>
              <div className="form-group">
                <label>SMTP Password</label>
                <input className="form-control" type="password" placeholder="••••••••" />
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => toast.success('Test email sent!')}>
                📨 Send Test Email
              </button>
            </div>
          </div>

          {/* Admin Tools */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>🛠️ Admin Tools</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: '🔑 Reset All Passwords', desc: 'Force all users to reset on next login', action: () => toast.success('Password reset flags set!'), cls: 'btn-danger' },
                { label: '🗑️ Clear Inactive Accounts', desc: 'Remove accounts unused for 180+ days', action: () => toast.success('Sweep completed: 0 accounts removed'), cls: 'btn-ghost' },
                { label: '📤 Export All Data', desc: 'Full data export as CSV/JSON', action: () => toast.success('Export started!'), cls: 'btn-ghost' },
                { label: '🔄 Rebuild Indexes', desc: 'Optimize database query performance', action: () => toast.success('Index rebuild queued!'), cls: 'btn-ghost' },
              ].map((tool, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--warm-1)', borderRadius: 'var(--radius)', border: '1.5px solid var(--card-border)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{tool.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tool.desc}</div>
                  </div>
                  <button className={`btn btn-sm ${tool.cls}`} onClick={tool.action}>Run</button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Settings */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>📁 File Settings</div>
            <div className="form-group">
              <label>Max Upload Size (MB)</label>
              <input className="form-control" type="number" value={settings.maxFileUploadMB} onChange={e => handle('maxFileUploadMB', +e.target.value)} min={1} max={100} />
            </div>
            <div className="form-group">
              <label>Allowed File Types</label>
              <input className="form-control" defaultValue="jpg,jpeg,png,pdf,doc,docx,xlsx" />
            </div>
            <div className="form-group">
              <label>Storage Provider</label>
              <select className="form-control">
                <option>Local Filesystem</option>
                <option>AWS S3</option>
                <option>Google Cloud Storage</option>
              </select>
            </div>
            <div className="divider" />
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              📦 Storage Used: <strong style={{ color: 'var(--text)' }}>1.2 GB / 10 GB</strong>
              <div className="marks-bar" style={{ marginTop: 8 }}>
                <div className="marks-bar-fill" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

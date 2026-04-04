import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';

const passFailData = [
  { subject: 'DSA',  Pass: 62, Fail: 12 },
  { subject: 'DBMS', Pass: 70, Fail: 4  },
  { subject: 'OS',   Pass: 55, Fail: 19 },
  { subject: 'CN',   Pass: 58, Fail: 16 },
  { subject: 'SE',   Pass: 68, Fail: 6  },
];

const scoreDistribution = [
  { range: 'O (90+)', count: 18, color: '#34c77b' },
  { range: 'A+ (80+)', count: 24, color: '#6c63ff' },
  { range: 'A (70+)',  count: 20, color: '#3b82f6' },
  { range: 'B+ (60+)', count: 15, color: '#f59e0b' },
  { range: 'B (50+)',  count: 10, color: '#f05252' },
  { range: 'Fail',     count: 7,  color: '#9ca3af' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'white', border: '1.5px solid var(--card-border)', borderRadius: 10, padding: '10px 14px', fontSize: 12, boxShadow: 'var(--shadow)' }}>
        <strong>{label}</strong>
        {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
      </div>
    );
  }
  return null;
};

export default function TeacherDashboard() {
  const { user } = useAuth();

  const QUICK = [
    { to: '/teacher/marks',       icon: '📤', label: 'Upload Marks'  },
    { to: '/teacher/evaluation',  icon: '📝', label: 'Evaluation'    },
    { to: '/teacher/answersheet', icon: '📋', label: 'Answer Sheets' },
    { to: '/teacher/timetable',   icon: '📅', label: 'Timetable'     },
    { to: '/teacher/tickets',     icon: '🎫', label: 'Tickets'       },
    { to: '/teacher/profile',     icon: '👤', label: 'My Profile'    },
  ];

  return (
    <div className="page-enter">
      <div className="page-content">
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f4c75, #1b6ca8)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          marginBottom: 24,
          color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -80, right: -80 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 4 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Prof. {user?.name?.split(' ').pop() || 'Teacher'} 👨‍🏫</h2>
            <p style={{ fontSize: 14, opacity: 0.7 }}>{user?.department || 'Department'} · {(user?.subjects || ['DSA', 'OS', 'DBMS']).slice(0, 2).join(', ')}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Classes', val: 5 },
              { label: 'Students', val: 148 },
              { label: 'Pending', val: 3 },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{s.val}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid">
          {[
            { icon: '👥', label: 'Total Students', value: 148, sub: 'Across 5 classes', cls: 'blue' },
            { icon: '📊', label: 'Avg Class Score', value: '74%', sub: 'Semester average', cls: 'violet' },
            { icon: '✅', label: 'Forms Graded', value: 34, sub: 'This semester', cls: 'green' },
            { icon: '🎫', label: 'Open Tickets', value: 7, sub: 'Awaiting reply', cls: 'amber' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${s.cls}`} style={{ fontSize: 22 }}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>⚡ Quick Actions</div>
          <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))' }}>
            {QUICK.map(q => (
              <Link key={q.to} to={q.to} className="quick-action-card">
                <div className="quick-action-icon">{q.icon}</div>
                <div className="quick-action-label">{q.label}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>Pass/Fail by Subject</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={passFailData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Pass" fill="var(--success)" radius={[4,4,0,0]} name="Pass" stackId="a" />
                <Bar dataKey="Fail" fill="var(--danger)" radius={[4,4,0,0]} name="Fail" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>Grade Distribution</div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={scoreDistribution} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="count" paddingAngle={2}>
                    {scoreDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {scoreDistribution.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                      <span style={{ color: 'var(--text-muted)' }}>{s.range}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Classes */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>📚 My Classes</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Subject</th><th>Class</th><th>Students</th><th>Last Marks Upload</th><th>Avg Score</th><th>Action</th></tr>
              </thead>
              <tbody>
                {[
                  { subject: 'Data Structures', cls: 'CS-A', students: 35, date: '3 days ago', avg: 78 },
                  { subject: 'Data Structures', cls: 'CS-B', students: 31, date: '3 days ago', avg: 74 },
                  { subject: 'Operating Systems', cls: 'CS-A', students: 35, date: '1 week ago', avg: 65 },
                  { subject: 'Database MGMT', cls: 'IT-A', students: 47, date: '5 days ago', avg: 80 },
                ].map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.subject}</td>
                    <td><span className="chip">{r.cls}</span></td>
                    <td>{r.students} students</td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.date}</td>
                    <td>
                      <span style={{ fontWeight: 800, color: r.avg >= 75 ? 'var(--success)' : r.avg >= 60 ? 'var(--warning)' : 'var(--danger)' }}>{r.avg}%</span>
                    </td>
                    <td>
                      <Link to="/teacher/marks" className="btn btn-ghost btn-xs">Upload Marks</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

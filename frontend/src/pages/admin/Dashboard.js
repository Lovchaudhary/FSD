import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Users, BookOpen, Ticket, Monitor, Database, TrendingUp } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', Students: 280, Teachers: 18 },
  { month: 'Feb', Students: 290, Teachers: 18 },
  { month: 'Mar', Students: 300, Teachers: 20 },
  { month: 'Apr', Students: 312, Teachers: 22 },
];

const examData = [
  { name: 'Appeared', value: 298, color: '#6c63ff' },
  { name: 'Pass',     value: 245, color: '#34c77b' },
  { name: 'Fail',     value: 53,  color: '#f05252' },
];

const subjectAvg = [
  { subject: 'DSA',  avg: 74 },
  { subject: 'DBMS', avg: 80 },
  { subject: 'OS',   avg: 65 },
  { subject: 'CN',   avg: 70 },
  { subject: 'SE',   avg: 78 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'white', border: '1.5px solid var(--card-border)', borderRadius: 10, padding: '10px 14px', fontSize: 12, boxShadow: 'var(--shadow)' }}>
        <strong>{label}</strong>
        {payload.map((p, i) => <div key={i} style={{ color: p.color || 'var(--primary)' }}>{p.name}: {p.value}</div>)}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const STATS = [
    { icon: '👥', label: 'Total Users', value: 312, sub: '+12 this month', cls: 'violet' },
    { icon: '🎒', label: 'Students', value: 280, sub: '5 departments', cls: 'blue' },
    { icon: '👨‍🏫', label: 'Teachers', value: 22, sub: 'Active faculty', cls: 'teal' },
    { icon: '📝', label: 'Open Tickets', value: 18, sub: 'Needs attention', cls: 'amber' },
    { icon: '📋', label: 'Exam Forms', value: 156, sub: 'Submitted', cls: 'coral' },
    { icon: '💰', label: 'Fee Collected', value: '₹8.4L', sub: 'This semester', cls: 'green' },
  ];

  const QUICK = [
    { to: '/admin/users',      icon: '👥', label: 'Manage Users'   },
    { to: '/admin/marks',      icon: '📊', label: 'Marks Control'  },
    { to: '/admin/forms',      icon: '📋', label: 'Exam Forms'     },
    { to: '/admin/timetable',  icon: '📅', label: 'Timetable'      },
    { to: '/admin/fees',       icon: '💳', label: 'Fees'           },
    { to: '/admin/tickets',    icon: '🎫', label: 'Tickets'        },
    { to: '/admin/monitoring', icon: '🖥️', label: 'Monitoring'     },
    { to: '/admin/database',   icon: '🗄️', label: 'Database'       },
  ];

  const RECENT_USERS = [
    { name: 'Ravi Sharma',  role: 'student', dept: 'CS', joined: 'Today' },
    { name: 'Dr. Meena',    role: 'teacher', dept: 'IT', joined: 'Yesterday' },
    { name: 'Priya Singh',  role: 'student', dept: 'EE', joined: '2 days ago' },
    { name: 'Arjun Kumar',  role: 'student', dept: 'CS', joined: '3 days ago' },
  ];

  return (
    <div className="page-enter">
      <div className="page-content">
        {/* Admin Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1625, #2d1f5e)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px', marginBottom: 24, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(224,124,84,0.1)', top: -100, right: -50 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 13, opacity: 0.55, marginBottom: 4 }}>System Overview</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>⚙️ Admin Control Panel</h2>
            <p style={{ fontSize: 14, opacity: 0.65 }}>Full control over users, exams, marks, and system settings.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Uptime', val: '99.9%' },
              { label: 'Requests', val: '2.4K' },
              { label: 'Errors', val: '3' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{s.val}</div>
                <div style={{ fontSize: 11, opacity: 0.55 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          {STATS.map((s, i) => (
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

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* User Growth */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>📈 User Growth</div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Students" stroke="var(--accent)" strokeWidth={2} fill="url(#g1)" name="Students" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pass/Fail */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>📊 Exam Stats</div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={examData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={3}>
                    {examData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {examData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                      <span style={{ color: 'var(--text-muted)' }}>{d.name}</span>
                    </div>
                    <span style={{ fontWeight: 800 }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Average */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>📚 Subject Avg</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={subjectAvg} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avg" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">👥 Recent Registrations</div>
            <Link to="/admin/users" className="btn btn-ghost btn-sm">View All Users</Link>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Name</th><th>Role</th><th>Department</th><th>Joined</th><th>Action</th></tr>
              </thead>
              <tbody>
                {RECENT_USERS.map((u, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td><span className={`badge-role ${u.role}`}>{u.role}</span></td>
                    <td>{u.dept}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.joined}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                        <button className="btn btn-danger btn-xs">Remove</button>
                      </div>
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

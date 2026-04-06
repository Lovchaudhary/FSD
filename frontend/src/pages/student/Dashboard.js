import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../../api';
import {
  BarChart2, Ticket, FileText, BookOpen, TrendingUp,
  Award, Clock, CreditCard, Calendar, CheckSquare,
  RotateCcw, User
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';





const attendancePie = [
  { name: 'Present', value: 87, color: '#34c77b' },
  { name: 'Absent',  value: 13, color: '#f05252' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'white', border: '1.5px solid var(--card-border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow)', fontSize: 12 }}>
        <strong>{label}</strong>
        {payload.map((p, i) => <div key={i} style={{ color: p.color || 'var(--primary)' }}>{p.name}: {p.value}</div>)}
      </div>
    );
  }
  return null;
};

const QUICK = [
  { to: '/student/admit-card',  icon: '🎫', label: 'Admit Card' },
  { to: '/student/results',     icon: '📊', label: 'Results'    },
  { to: '/student/timetable',   icon: '📅', label: 'Timetable'  },
  { to: '/student/attendance',  icon: '✅', label: 'Attendance' },
  { to: '/student/fees',        icon: '💳', label: 'Pay Fees'   },
  { to: '/student/forms',       icon: '📋', label: 'Exam Forms' },
  { to: '/student/revaluation', icon: '🔄', label: 'Revaluation'},
  { to: '/student/tickets',     icon: '🎫', label: 'Tickets'    },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/student/marks').then(res => {
      setMarks(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const dynamicSubjectData = marks.map(m => {
    return { name: m.subject.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4), score: Math.round((m.marks / m.maxMarks) * 100) };
  });

  const dynamicPerformanceData = React.useMemo(() => {
    if (!marks || marks.length === 0) return [];
    const bySem = {};
    marks.forEach(m => {
      const s = m.semester || 1;
      if (!bySem[s]) bySem[s] = [];
      bySem[s].push(m);
    });
    return Object.keys(bySem).sort().map(sem => {
      const semMarks = bySem[sem];
      const avg = semMarks.reduce((acc, m) => acc + (m.marks / m.maxMarks) * 100, 0) / semMarks.length;
      return { sem: `Sem ${sem}`, SGPA: parseFloat((avg / 10).toFixed(1)) };
    });
  }, [marks]);

  const avg = marks.length
    ? Math.round(marks.reduce((s, m) => s + (m.marks / m.maxMarks) * 100, 0) / marks.length)
    : 87;

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const pendingForms = forms.filter(f => f.status === 'pending').length;

  return (
    <div className="page-enter">
      <div className="page-content">

        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--sidebar-bg) 0%, #3b1f8c 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(224,124,84,0.12)', top: -100, right: -100 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: 'white', marginBottom: 6, letterSpacing: -0.5 }}>
              Good {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              Roll: <strong style={{ color: 'var(--primary-light)' }}>{user?.rollNumber || 'N/A'}</strong>
              &nbsp;·&nbsp; Dept: {user?.department || 'Not set'}
              &nbsp;·&nbsp; Sem: <strong style={{ color: '#6c63ff' }}>4th</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1 }}>
            {[
              { label: 'CGPA', val: '8.9', icon: '🏆' },
              { label: 'Attendance', val: '87%', icon: '✅' },
              { label: 'Backlogs', val: '0', icon: '🎯' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'white', marginTop: 4 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid">
          {[
            { icon: '📚', label: 'Total Subjects', value: marks.length || 5, cls: 'coral', change: '', sub: 'This semester' },
            { icon: '📈', label: 'Avg Score', value: `${avg}%`, cls: 'violet', sub: 'Overall average' },
            { icon: '🎫', label: 'Open Tickets', value: openTickets || 2, cls: 'amber', sub: 'Awaiting response' },
            { icon: '📋', label: 'Pending Forms', value: pendingForms || 1, cls: 'rose', sub: 'Awaiting approval' },
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
          <div className="quick-actions-grid">
            {QUICK.map(q => (
              <Link key={q.to} to={q.to} className="quick-action-card">
                <div className="quick-action-icon">{q.icon}</div>
                <div className="quick-action-label">{q.label}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 20, marginBottom: 24 }}>
          {/* Performance Trend */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>📈 Academic Trend</div>
            {dynamicPerformanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={dynamicPerformanceData}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                  <XAxis dataKey="sem" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="SGPA" stroke="var(--primary)" strokeWidth={2.5} fill="url(#grad1)" dot={{ fill: 'var(--primary)', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No performance data available.
              </div>
            )}
          </div>

          {/* Subject Scores */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>📊 Subject Scores</div>
            {dynamicSubjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dynamicSubjectData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill="var(--accent)" radius={[6, 6, 0, 0]} name="Score" />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No finalized subject scores available.
              </div>
            )}
          </div>

          {/* Attendance Pie */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="card-title" style={{ marginBottom: 16 }}>✅ Attendance</div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {attendancePie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--success)', marginTop: -4 }}>87%</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Overall Attendance</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 10 }}>
              {attendancePie.map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
                  {p.name}: {p.value}%
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Marks */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📚 Recent Marks</div>
            <Link to="/student/marks" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 14 }}>
              {marks.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13, gridColumn: '1 / -1', padding: '20px 0' }}>
                  No recent marks published by teachers.
                </div>
              ) : marks.slice(0, 5).map(m => {
                const pct = Math.round((m.marks / m.maxMarks) * 100);
                return (
                  <div key={m._id} style={{ padding: '14px 16px', background: 'var(--warm-1)', borderRadius: 'var(--radius)', border: '1.5px solid var(--card-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{m.subject}</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: pct >= 75 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                        {m.marks}/{m.maxMarks}
                      </span>
                    </div>
                    <div className="marks-bar">
                      <div
                        className={`marks-bar-fill ${pct < 40 ? 'danger' : pct < 60 ? 'warning' : ''}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>{pct}% · {pct >= 75 ? '✅ Good' : pct >= 50 ? '⚠️ Average' : '❌ Below Pass'}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

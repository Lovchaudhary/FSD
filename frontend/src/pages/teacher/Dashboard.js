import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const GRADE_CONFIG = [
  { label: 'O (90+)',  min: 90, color: '#34c77b' },
  { label: 'A+ (80+)', min: 80, color: '#6c63ff' },
  { label: 'A (70+)',  min: 70, color: '#3b82f6' },
  { label: 'B+ (60+)', min: 60, color: '#f59e0b' },
  { label: 'B (50+)',  min: 50, color: '#f05252' },
  { label: 'Fail',     min: 0,  color: '#9ca3af' },
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

  const [myMarks, setMyMarks] = React.useState([]);
  const [allTickets, setAllTickets] = React.useState([]);
  const allowedSubjects = React.useMemo(() => user?.allowedSubjects || [], [user?.allowedSubjects]);

  React.useEffect(() => {
    API.get('/teacher/marks').then(res => setMyMarks(res.data)).catch(() => {});
    API.get('/teacher/tickets').then(res => setAllTickets(res.data)).catch(() => {});
  }, []);

  // Pass/Fail per allowed subject
  const passFailData = useMemo(() => {
    return allowedSubjects.map(sub => {
      const subMarks = myMarks.filter(m => m.subject === sub);
      const pass = subMarks.filter(m => (m.marks / m.maxMarks) * 100 >= 40).length;
      const fail = subMarks.length - pass;
      // Abbreviate subject name (first letters of words)
      const abbr = sub.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4);
      return { subject: abbr, fullName: sub, Pass: pass || 0, Fail: fail || 0 };
    });
  }, [allowedSubjects, myMarks]);

  // Grade distribution across all my marks
  const scoreDistribution = useMemo(() => {
    return GRADE_CONFIG.map((g, i) => {
      const next = GRADE_CONFIG[i - 1];
      const count = myMarks.filter(m => {
        const pct = (m.marks / m.maxMarks) * 100;
        return pct >= g.min && (next ? pct < next.min : true);
      }).length;
      return { range: g.label, count, color: g.color };
    });
  }, [myMarks]);

  // My classes table: group by subject + group from marks
  const myClasses = useMemo(() => {
    const map = {};
    myMarks.forEach(m => {
      const key = `${m.subject}__${m.semester || 'Sem'}`;
      if (!map[key]) map[key] = { subject: m.subject, cls: m.semester || 'General', students: new Set(), scores: [], latest: m.createdAt };
      map[key].students.add(m.rollNumber);
      map[key].scores.push((m.marks / m.maxMarks) * 100);
      if (m.createdAt > map[key].latest) map[key].latest = m.createdAt;
    });
    return Object.values(map).map(c => ({
      subject: c.subject,
      cls: c.cls,
      students: c.students.size,
      avg: c.scores.length ? Math.round(c.scores.reduce((a, b) => a + b, 0) / c.scores.length) : 0,
      date: c.latest ? new Date(c.latest).toLocaleDateString() : '—',
    }));
  }, [myMarks]);

  const openTickets = allTickets.filter(t => t.status === 'open').length;
  const totalStudents = new Set(myMarks.map(m => m.rollNumber)).size;
  const avgScore = myMarks.length
    ? Math.round(myMarks.reduce((a, m) => a + (m.marks / m.maxMarks) * 100, 0) / myMarks.length)
    : 0;

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
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>{user?.name} 👨‍🏫</h2>
            <p style={{ fontSize: 14, opacity: 0.7 }}>
              {user?.department || 'Department'}
              {allowedSubjects.length > 0 && ` · ${allowedSubjects.slice(0, 2).join(', ')}${allowedSubjects.length > 2 ? ` +${allowedSubjects.length - 2} more` : ''}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Subjects', val: allowedSubjects.length || '—' },
              { label: 'Students', val: totalStudents || '—' },
              { label: 'Open Tickets', val: openTickets },
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
            { icon: '👥', label: 'Unique Students', value: totalStudents || '—', sub: 'From uploaded marks', cls: 'blue' },
            { icon: '📊', label: 'Avg Score',        value: myMarks.length ? `${avgScore}%` : '—', sub: 'Across all subjects', cls: 'violet' },
            { icon: '📚', label: 'Records Uploaded', value: myMarks.length, sub: 'Total mark entries', cls: 'green' },
            { icon: '🎫', label: 'Open Tickets',     value: openTickets, sub: 'Awaiting reply', cls: 'amber' },
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
          {/* Pass/Fail — only allowed subjects */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>Pass/Fail by Subject</div>
            {passFailData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                <p style={{ fontSize: 13 }}>No marks data yet.<br />Upload marks to see stats.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={passFailData} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Pass" fill="var(--success)" radius={[4,4,0,0]} name="Pass" stackId="a" />
                  <Bar dataKey="Fail" fill="var(--danger)"  radius={[4,4,0,0]} name="Fail" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Grade Distribution */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>Grade Distribution</div>
            {myMarks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
                <p style={{ fontSize: 13 }}>No marks uploaded yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={scoreDistribution.filter(s => s.count > 0)} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="count" paddingAngle={2}>
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
            )}
          </div>
        </div>

        {/* My Classes */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>📚 My Classes</div>
          {myClasses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
              <p style={{ fontSize: 13 }}>No marks uploaded yet for your subjects.<br />
                {allowedSubjects.length === 0 ? 'Contact admin to get subject permissions.' : 'Go to Upload Marks to add records.'}
              </p>
              {allowedSubjects.length === 0 && (
                <div style={{ marginTop: 12, padding: '10px 16px', background: 'var(--warm-1)', borderRadius: 10, fontSize: 12, color: 'var(--warning)', fontWeight: 700, display: 'inline-block' }}>
                  ⚠️ No subjects permitted by admin yet
                </div>
              )}
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Subject</th><th>Semester</th><th>Students</th><th>Last Upload</th><th>Avg Score</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {myClasses.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{r.subject}</td>
                      <td><span className="chip">{r.cls}</span></td>
                      <td>{r.students} student{r.students !== 1 ? 's' : ''}</td>
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
          )}
        </div>
      </div>
    </div>
  );
}

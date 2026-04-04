import React, { useEffect, useState } from 'react';
import API from '../../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingUp, Award, BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function StudentMarks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/student/marks').then(r => setMarks(r.data)).finally(() => setLoading(false));
  }, []);

  const chartData = marks.map(m => ({
    subject: m.subject?.slice(0, 8),
    marks: m.marks,
    max: m.maxMarks,
    pct: Math.round((m.marks / m.maxMarks) * 100),
  }));

  const avg = marks.length ? Math.round(marks.reduce((s, m) => s + (m.marks / m.maxMarks) * 100, 0) / marks.length) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: 'white', border: '1.5px solid var(--card-border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow)', fontSize: 12 }}>
          <strong>{label}</strong>
          {payload.map((p, i) => <div key={i} style={{ color: p.color || 'var(--primary)' }}>{p.name}: {p.value}%</div>)}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>My Academic Record</h3>
            <p>Comprehensive view of your marks and performance benchmarks</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>Print Report</button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stat-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'Overall Average', value: `${avg}%`, icon: <TrendingUp size={20} />, sub: 'Across all subjects', cls: 'violet' },
            { label: 'Highest Score', value: marks.length ? `${Math.max(...marks.map(m => Math.round((m.marks/m.maxMarks)*100)))}%` : '0%', icon: <Award size={20} />, sub: 'Best performance', cls: 'green' },
            { label: 'Total Subjects', value: marks.length, icon: <BookOpen size={20} />, sub: 'This semester', cls: 'coral' },
            { label: 'Finalized', value: marks.filter(m => m.isFinal).length, icon: <CheckCircle size={20} />, sub: 'Locked by teacher', cls: 'teal' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${s.cls}`} style={{ fontSize: 20 }}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart View */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-title" style={{ marginBottom: 20 }}>Performance Distribution</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pct" fill="var(--primary)" radius={[8, 8, 0, 0]} name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table View */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Detailed Marks Sheet</div>
          </div>
          {loading ? <div className="loading-spinner" /> : marks.length === 0 ? (
            <div className="empty-state" style={{ padding: 60 }}>
              <div className="empty-icon">📊</div>
              <h4>No marks published yet</h4>
              <p>Your subject teachers have not uploaded any marks for this semester.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Exam Type</th>
                    <th>Marks</th>
                    <th>Weightage (%)</th>
                    <th>Teacher</th>
                    <th>Sem</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map(m => {
                    const pct = Math.round((m.marks / m.maxMarks) * 100);
                    return (
                      <tr key={m._id}>
                        <td style={{ fontWeight: 700, color: 'var(--text)' }}>{m.subject}</td>
                        <td><span className="chip" style={{ textTransform: 'capitalize', fontWeight: 600 }}>{m.examType}</span></td>
                        <td>
                          <div style={{ fontWeight: 800, fontSize: 14 }}>{m.marks} / {m.maxMarks}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontWeight: 800, color: pct >= 50 ? 'var(--success)' : 'var(--danger)', fontSize: 13, minWidth: 35 }}>{pct}%</span>
                            <div className="marks-bar" style={{ width: 60 }}>
                              <div className={`marks-bar-fill ${pct < 40 ? 'danger' : pct < 60 ? 'warning' : ''}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{m.teacherId?.name || '—'}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{m.semester || '—'}</td>
                        <td>
                          <span className={`badge ${m.isFinal ? 'badge-approved' : 'badge-pending'}`}>
                            {m.isFinal ? <><CheckCircle size={10} /> Finalized</> : <><Clock size={10} /> Draft</>}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

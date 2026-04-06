import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import { Download, Trophy, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

const GRADE_COLORS = { O: '#34c77b', 'A+': '#6c63ff', A: '#3b82f6', 'B+': '#f59e0b', B: '#f05252', Fail: '#9ca3af' };

const gradeFromPct = (pct) => {
  if (pct >= 90) return 'O';
  if (pct >= 80) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B+';
  if (pct >= 50) return 'B';
  return 'Fail';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'white', border: '1.5px solid var(--card-border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow)', fontSize: 12 }}>
        <strong>{label}</strong>
        {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
      </div>
    );
  }
  return null;
};

export default function Results() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/student/marks')
      .then(r => setMarks(r.data))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner" style={{ margin: '80px auto' }} />;

  const total = marks.reduce((s, m) => s + m.marks, 0);
  const maxTotal = marks.reduce((s, m) => s + m.maxMarks, 0);
  const overallPct = maxTotal ? Math.round((total / maxTotal) * 100) : 0;
  const allPass = marks.every(m => (m.marks / m.maxMarks) * 100 >= 40);

  const chartData = marks.map(m => ({ name: m.subject?.slice(0, 6), Marks: m.marks, Max: m.maxMarks }));
  const radarData = marks.map(m => ({ subject: m.subject?.slice(0, 6), score: Math.round((m.marks / m.maxMarks) * 100) }));

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Exam Results</h3>
            <p>Finalized marks published by your teachers</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-primary btn-sm" onClick={() => toast.success('Result card downloaded!')}>
              <Download size={15} /> Download Result Card
            </button>
          </div>
        </div>

        {marks.length === 0 ? (
          <div className="card">
            <div className="empty-state" style={{ padding: 80 }}>
              <div className="empty-icon">📋</div>
              <h4>No finalized results yet</h4>
              <p>Your teachers have not finalized any marks yet. Check back after your exams.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Performance Banner */}
            <div style={{ background: 'linear-gradient(135deg, var(--sidebar-bg), #2d1b69)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ color: 'white' }}>
                <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 4 }}>Overall Performance</div>
                <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1 }}>{overallPct}%</div>
                <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{marks.length} subject{marks.length !== 1 ? 's' : ''} · {user?.name}</div>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                {[
                  { label: 'Total Marks', value: `${total}/${maxTotal}` },
                  { label: 'Subjects', value: marks.length },
                  { label: 'Status', value: allPass ? 'PASS' : 'FAIL', color: allPass ? '#34c77b' : '#f05252' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: s.color || 'white' }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            {marks.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                <div className="card">
                  <div className="card-title" style={{ marginBottom: 20 }}>Marks Breakdown</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Marks" fill="var(--primary)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card">
                  <div className="card-title" style={{ marginBottom: 20 }}>Performance Radar</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="var(--card-border)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                      <Radar name="Score" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} strokeWidth={2} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Result Table */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Subject-wise Results</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {Object.entries(GRADE_COLORS).map(([g, c]) => (
                    <span key={g} style={{ background: `${c}20`, color: c, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{g}</span>
                  ))}
                </div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th><th>Exam Type</th><th>Marks</th><th>Percentage</th><th>Grade</th><th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map(m => {
                      const pct = Math.round((m.marks / m.maxMarks) * 100);
                      const grade = gradeFromPct(pct);
                      const gradeColor = GRADE_COLORS[grade] || 'var(--text)';
                      return (
                        <tr key={m._id}>
                          <td style={{ fontWeight: 600 }}>{m.subject}</td>
                          <td><span className="chip" style={{ textTransform: 'capitalize' }}>{m.examType}</span></td>
                          <td style={{ fontWeight: 800 }}>{m.marks} / {m.maxMarks}</td>
                          <td>
                            <div>
                              <span style={{ fontWeight: 700 }}>{pct}%</span>
                              <div className="marks-bar" style={{ width: 80, marginTop: 4 }}>
                                <div className={`marks-bar-fill ${pct < 40 ? 'danger' : pct < 60 ? 'warning' : ''}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ background: `${gradeColor}20`, color: gradeColor, padding: '4px 12px', borderRadius: 20, fontWeight: 800, fontSize: 13 }}>{grade}</span>
                          </td>
                          <td>
                            <span className={`badge ${pct >= 40 ? 'badge-approved' : 'badge-rejected'}`}>
                              {pct >= 40 ? '✅ PASS' : '❌ FAIL'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

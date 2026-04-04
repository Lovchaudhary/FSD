import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Download, Trophy, TrendingUp, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

const RESULTS = [
  { code: 'CS401', subject: 'Data Structures & Algorithms', internal: 28, external: 68, total: 96, max: 100, grade: 'O',  desc: 'Outstanding' },
  { code: 'CS402', subject: 'Database Management Systems', internal: 25, external: 62, total: 87, max: 100, grade: 'A+', desc: 'Excellent' },
  { code: 'CS403', subject: 'Computer Networks',           internal: 22, external: 55, total: 77, max: 100, grade: 'B+', desc: 'Very Good' },
  { code: 'CS404', subject: 'Operating Systems',           internal: 24, external: 58, total: 82, max: 100, grade: 'A',  desc: 'Good' },
  { code: 'CS405', subject: 'Software Engineering',        internal: 27, external: 66, total: 93, max: 100, grade: 'O',  desc: 'Outstanding' },
];

const GRADE_COLORS = { O: '#34c77b', 'A+': '#6c63ff', A: '#3b82f6', 'B+': '#f59e0b', B: '#f05252' };

const TOTAL_MARKS = RESULTS.reduce((s, r) => s + r.total, 0);
const MAX_MARKS = RESULTS.reduce((s, r) => s + r.max, 0);
const OVERALL_PCT = Math.round((TOTAL_MARKS / MAX_MARKS) * 100);
const SGPA = 8.9;

const chartData = RESULTS.map(r => ({
  name: r.code,
  Internal: r.internal,
  External: r.external,
  pct: Math.round((r.total / r.max) * 100),
}));

const radarData = RESULTS.map(r => ({
  subject: r.code,
  score: Math.round((r.total / r.max) * 100),
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'white', border: '1.5px solid var(--card-border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow)', fontSize: 12 }}>
        <strong>{label}</strong>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Results() {
  const { user } = useAuth();

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Exam Results</h3>
            <p>Semester 4 End-Term Results — Academic Year 2025-26</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-primary btn-sm" onClick={() => toast.success('Result card downloaded!')}>
              <Download size={15} /> Download Result Card
            </button>
          </div>
        </div>

        {/* Performance Banner */}
        <div style={{ background: 'linear-gradient(135deg, var(--sidebar-bg), #2d1b69)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 4 }}>Semester 4 Performance</div>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1 }}>{OVERALL_PCT}%</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>Overall Score · SGPA: {SGPA}</div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { label: 'Total Marks', value: `${TOTAL_MARKS}/${MAX_MARKS}` },
              { label: 'SGPA', value: SGPA },
              { label: 'Rank', value: '12 / 87' },
              { label: 'Result', value: 'PASS', color: '#34c77b' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color || 'white' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>Marks Breakdown</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Internal" fill="var(--primary)" radius={[4,4,0,0]} />
                <Bar dataKey="External" fill="var(--accent)" radius={[4,4,0,0]} />
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
                  <th>Code</th>
                  <th>Subject</th>
                  <th>Internal</th>
                  <th>External</th>
                  <th>Total</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {RESULTS.map(r => {
                  const pct = Math.round((r.total / r.max) * 100);
                  const gradeColor = GRADE_COLORS[r.grade] || 'var(--text)';
                  return (
                    <tr key={r.code}>
                      <td><span className="chip">{r.code}</span></td>
                      <td style={{ fontWeight: 600 }}>{r.subject}</td>
                      <td>{r.internal}/30</td>
                      <td>{r.external}/70</td>
                      <td style={{ fontWeight: 800 }}>{r.total}/{r.max}</td>
                      <td>
                        <div>
                          <span style={{ fontWeight: 700 }}>{pct}%</span>
                          <div className="marks-bar" style={{ width: 80, marginTop: 4 }}>
                            <div className={`marks-bar-fill ${pct < 40 ? 'danger' : pct < 60 ? 'warning' : ''}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ background: `${gradeColor}20`, color: gradeColor, padding: '4px 12px', borderRadius: 20, fontWeight: 800, fontSize: 13 }}>
                          {r.grade}
                        </span>
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
      </div>
    </div>
  );
}

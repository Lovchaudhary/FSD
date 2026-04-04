import React, { useState } from 'react';
import { Clock, Info } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [
  { label: '9:00–10:00 AM', start: '9:00' },
  { label: '10:00–11:00 AM', start: '10:00' },
  { label: '11:00–12:00 PM', start: '11:00' },
  { label: '12:00–1:00 PM', start: '12:00' },
  { label: '2:00–3:00 PM', start: '14:00' },
  { label: '3:00–4:00 PM', start: '15:00' },
];

const TIMETABLE = [
  // [day][period] = subject or null
  ['Data Structures',     'Computer Networks', '—',                  'Database MGMT',     null,                'Software Engg'],
  ['Database MGMT',       '—',                 'Operating Systems',  'Data Structures',   'Computer Networks', '—'           ],
  ['Operating Systems',   'Data Structures',   'Database MGMT',      '—',                 'Software Engg',     'Data Structures'],
  ['Computer Networks',   'Software Engg',     'Data Structures',    'Operating Systems', 'Database MGMT',     null          ],
  ['Software Engg',       'Operating Systems', 'Computer Networks',  'Software Engg',     'Data Structures',   '—'           ],
  ['—',                   'Database MGMT',     '—',                  '—',                 '—',                 null          ],
];

const TEACHERS = {
  'Data Structures': 'Dr. Sharma',
  'Database MGMT': 'Prof. Gupta',
  'Computer Networks': 'Dr. Patel',
  'Operating Systems': 'Prof. Singh',
  'Software Engg': 'Dr. Verma',
};

const SUBJECT_COLORS = {
  'Data Structures':  '#e07c54',
  'Database MGMT':    '#6c63ff',
  'Computer Networks': '#0d9488',
  'Operating Systems': '#f59e0b',
  'Software Engg':    '#f43f5e',
};

const today = new Date().getDay(); // 0=Sun

export default function Timetable() {
  const [view, setView] = useState('table'); // 'table' | 'day'

  const currentDay = today >= 1 && today <= 6 ? today - 1 : 0; // Mon-Sat index

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Class Timetable</h3>
            <p>Semester 4 — Academic Year 2025-26</p>
          </div>
          <div className="page-header-actions">
            <button className={`btn btn-sm ${view === 'table' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('table')}>
              Weekly View
            </button>
            <button className={`btn btn-sm ${view === 'day' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('day')}>
              Today
            </button>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          {Object.entries(SUBJECT_COLORS).map(([sub, color]) => (
            <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', padding: '6px 12px', borderRadius: 20, border: '1.5px solid var(--card-border)', fontSize: 12, fontWeight: 600 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
              <span style={{ color: 'var(--text-2)' }}>{sub}</span>
              <span style={{ color: 'var(--text-dim)' }}>· {TEACHERS[sub]}</span>
            </div>
          ))}
        </div>

        {view === 'table' ? (
          /* Weekly Table */
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: 700 }} className="timetable-table">
                <thead>
                  <tr>
                    <th style={{ background: 'var(--sidebar-bg)', color: 'rgba(255,255,255,0.7)', textAlign: 'center', width: 110, fontSize: 11 }}>TIME</th>
                    {DAYS.map((d, i) => (
                      <th key={d} style={{ background: i === currentDay ? 'var(--primary)' : 'var(--warm-1)', color: i === currentDay ? 'white' : 'var(--text-2)', textAlign: 'center', fontWeight: 800 }}>
                        {d}
                        {i === currentDay && <div style={{ fontSize: 9, fontWeight: 400, opacity: 0.8 }}>Today</div>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((period, pi) => (
                    <tr key={pi}>
                      <td style={{ background: 'var(--warm-1)', textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: '10px 8px', borderRight: '1.5px solid var(--card-border)' }}>
                        <Clock size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                        {period.label}
                      </td>
                      {DAYS.map((d, di) => {
                        const subject = TIMETABLE[di][pi];
                        const color = subject && subject !== '—' ? SUBJECT_COLORS[subject] : null;
                        const isCurrentPeriod = di === currentDay;
                        return (
                          <td key={di} style={{ padding: '6px 8px', textAlign: 'center', background: isCurrentPeriod && di === currentDay ? 'rgba(224,124,84,0.04)' : 'white' }}>
                            {subject && subject !== '—' && subject !== null ? (
                              <div style={{
                                padding: '8px 6px',
                                borderRadius: 10,
                                background: `${color}15`,
                                border: `1.5px solid ${color}40`,
                                cursor: 'default',
                                transition: 'var(--transition)',
                              }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: color }}>{subject}</div>
                                <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{TEACHERS[subject]}</div>
                              </div>
                            ) : subject === '—' ? (
                              <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: 8 }}>Break</div>
                            ) : (
                              <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: 8 }}>—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Today's Schedule */
          <div style={{ maxWidth: 500 }}>
            <div className="alert alert-info" style={{ marginBottom: 16 }}>
              <Info size={16} /> Showing today's schedule — <strong>{DAYS[currentDay]}</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PERIODS.map((period, pi) => {
                const subject = TIMETABLE[currentDay][pi];
                const color = subject && subject !== '—' ? SUBJECT_COLORS[subject] : null;
                return (
                  <div key={pi} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: 'white', borderRadius: 'var(--radius)', padding: '14px 18px',
                    border: `1.5px solid ${color ? color + '40' : 'var(--card-border)'}`,
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{ textAlign: 'center', minWidth: 80, fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {period.label}
                    </div>
                    <div style={{ width: 3, height: 40, borderRadius: 4, background: color || 'var(--warm-4)', flexShrink: 0 }} />
                    {subject && subject !== '—' && subject !== null ? (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{subject}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{TEACHERS[subject]} · Room A-102</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 14, color: 'var(--text-dim)', fontStyle: 'italic' }}>
                        {subject === '—' ? '☕ Break Time' : 'No class scheduled'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

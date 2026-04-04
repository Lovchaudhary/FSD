import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const MOCK_ATTENDANCE = {
  present: [3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26],
  absent: [1,13,14,20],
  holiday: [6,7,27,28],
};

export default function Attendance() {
  const { user } = useAuth();
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const monthName = MONTHS[view.month];
  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getDayClass = (d) => {
    if (!d) return '';
    if (MOCK_ATTENDANCE.holiday.includes(d)) return 'holiday';
    if (MOCK_ATTENDANCE.present.includes(d)) return 'present';
    if (MOCK_ATTENDANCE.absent.includes(d)) return 'absent';
    if (new Date(view.year, view.month, d) > today) return 'future';
    return '';
  };

  const getDayLabel = (cls) => {
    if (cls === 'present') return '✓';
    if (cls === 'absent') return '✗';
    if (cls === 'holiday') return '—';
    return '';
  };

  const totalWorkingDays = MOCK_ATTENDANCE.present.length + MOCK_ATTENDANCE.absent.length;
  const attendancePct = Math.round((MOCK_ATTENDANCE.present.length / totalWorkingDays) * 100);
  const status = attendancePct >= 75 ? 'Eligible' : attendancePct >= 65 ? 'Conditional' : 'Not Eligible';
  const statusColor = attendancePct >= 75 ? 'var(--success)' : attendancePct >= 65 ? 'var(--warning)' : 'var(--danger)';

  const SUBJECTS = [
    { name: 'Data Structures',           present: 20, total: 22, pct: 91 },
    { name: 'Database Management',       present: 18, total: 22, pct: 82 },
    { name: 'Computer Networks',         present: 16, total: 22, pct: 73 },
    { name: 'Operating Systems',         present: 15, total: 22, pct: 68 },
    { name: 'Software Engineering',      present: 21, total: 22, pct: 95 },
  ];

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Attendance Tracker</h3>
            <p>Monitor your attendance across all subjects</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'Overall', value: `${attendancePct}%`, icon: '📊', sub: `${MOCK_ATTENDANCE.present.length}/${totalWorkingDays} days` },
            { label: 'Present Days', value: MOCK_ATTENDANCE.present.length, icon: '✅', sub: 'This month' },
            { label: 'Absent Days', value: MOCK_ATTENDANCE.absent.length, icon: '❌', sub: 'This month' },
            { label: 'Exam Eligibility', value: status, icon: attendancePct >= 75 ? '🏆' : '⚠️', sub: 'Min 75% required', color: statusColor },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon coral" style={{ fontSize: 22 }}>{s.icon}</div>
              <div>
                <div className="stat-value" style={{ color: s.color || 'var(--text)' }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Subject-wise Table */}
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div className="card-title">Subject-wise Attendance</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {SUBJECTS.map(s => (
                  <div key={s.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13.5 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{s.present}/{s.total} classes</span>
                        <span style={{
                          fontWeight: 800, fontSize: 13,
                          color: s.pct >= 75 ? 'var(--success)' : s.pct >= 65 ? 'var(--warning)' : 'var(--danger)',
                        }}>{s.pct}%</span>
                      </div>
                    </div>
                    <div className="marks-bar">
                      <div
                        className={`marks-bar-fill ${s.pct < 65 ? 'danger' : s.pct < 75 ? 'warning' : ''}`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                    {s.pct < 75 && (
                      <div style={{ fontSize: 11, color: s.pct < 65 ? 'var(--danger)' : 'var(--warning)', marginTop: 3, fontWeight: 600 }}>
                        {s.pct < 65
                          ? `⚠️ Critical: Need ${Math.ceil((0.75 * s.total - s.present) / (1 - 0.75))} more classes`
                          : `⚠️ Low: Attend ${Math.ceil((0.75 * s.total - s.present) / (1 - 0.75))} more to be safe`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Calendar */}
          <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="card-title">{monthName} {view.year}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-ghost btn-xs" onClick={() => setView(v => {
                  const m = v.month - 1;
                  return m < 0 ? { year: v.year - 1, month: 11 } : { ...v, month: m };
                })}><ChevronLeft size={14} /></button>
                <button className="btn btn-ghost btn-xs" onClick={() => setView(v => {
                  const m = v.month + 1;
                  return m > 11 ? { year: v.year + 1, month: 0 } : { ...v, month: m };
                })}><ChevronRight size={14} /></button>
              </div>
            </div>

            <div className="attendance-calendar">
              {DAYS.map(d => <div key={d} className="att-day header">{d}</div>)}
              {cells.map((day, i) => {
                const cls = getDayClass(day);
                return (
                  <div key={i} className={`att-day ${cls}`} title={cls ? cls.charAt(0).toUpperCase() + cls.slice(1) : ''}>
                    {day || ''}
                    {day && <span style={{ fontSize: 8, display: 'block', lineHeight: 1 }}>{getDayLabel(cls)}</span>}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { label: 'Present', cls: 'present', color: 'var(--success)' },
                { label: 'Absent', cls: 'absent', color: 'var(--danger)' },
                { label: 'Holiday', cls: 'holiday', color: 'var(--info)' },
              ].map(({ label, cls, color }) => (
                <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 4, background: color, opacity: 0.7 }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

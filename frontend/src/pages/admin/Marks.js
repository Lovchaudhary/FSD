import React, { useEffect, useState } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { Lock, Unlock, Search, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function AdminMarks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMarks = () => {
    API.get('/admin/marks').then(r => setMarks(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchMarks(); }, []);

  const toggleFinal = async (mark) => {
    const action = mark.isFinal ? 'UNLOCK' : 'FINALIZE';
    if (!window.confirm(`${action} marks for ${mark.studentId?.name} in ${mark.subject}? Only admin can unlock entries.`)) return;
    try {
      await API.put(`/admin/marks/${mark._id}/finalize`, { isFinal: !mark.isFinal });
      toast.success(`Marks ${mark.isFinal ? 'unlocked and restored to teacher edit mode' : 'finalized across all student views'}!`);
      fetchMarks();
    } catch (err) {
      toast.error('Failed to update lock status');
    }
  };

  const filtered = marks.filter(m => {
    const q = search.toLowerCase();
    return !q || m.studentId?.name?.toLowerCase().includes(q) || m.rollNumber?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q);
  });

  const avg = filtered.length ? Math.round(filtered.reduce((s, m) => s + (m.marks / m.maxMarks) * 100, 0) / filtered.length) : 0;

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Global Academic Record Control</h3>
            <p>Master override for mark finalization and system-wide performance audit</p>
          </div>
          <div className="page-header-actions">
             <button className="btn btn-ghost btn-sm" onClick={fetchMarks}><TrendingUp size={15} /> All Performance Metrics</button>
          </div>
        </div>

        {/* Oversight Stats */}
        <div className="stat-grid" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {[
            { label: 'Total Scored Entries', value: marks.length, icon: '📊', color: 'var(--primary)' },
            { label: 'Finalized & Locked', value: marks.filter(m => m.isFinal).length, icon: '🔒', color: 'var(--success)' },
            { label: 'Merchantable Drafts', value: marks.filter(m => !m.isFinal).length, icon: '📝', color: 'var(--warning)' },
            { label: 'University Average', value: `${avg}%`, icon: '📈', color: 'var(--accent)' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ padding: '16px 22px' }}>
              <div style={{ fontSize: 24 }}>{s.icon}</div>
              <div>
                 <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>{s.value}</div>
                 <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
           <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div className="card-title">Detailed Marks Audit</div>
              <div className="search-bar" style={{ maxWidth: 320, flex: 1 }}>
                 <Search size={15} />
                 <input placeholder="Filter by student, roll no or subject specialist..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
           </div>

           {loading ? <div className="loading-spinner" /> : filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: 60 }}>
                 <div className="empty-icon"><TrendingUp size={42} /></div>
                 <h4>No academic data recovered</h4>
                 <p>Database shows zero entries matching your current parameters.</p>
              </div>
           ) : (
              <div className="table-wrapper">
                 <table>
                    <thead>
                       <tr>
                          <th>Student Identity</th>
                          <th>Academic Roll</th>
                          <th>Subject Field</th>
                          <th>Recorded Marks</th>
                          <th>Score %</th>
                          <th>Phase</th>
                          <th>Teacher Auth</th>
                          <th style={{ textAlign: 'right' }}>Security Lock</th>
                       </tr>
                    </thead>
                    <tbody>
                       {filtered.map(m => {
                          const pct = Math.round((m.marks / m.maxMarks) * 100);
                          return (
                            <tr key={m._id}>
                               <td><div style={{ fontWeight: 800, color: 'var(--text)' }}>{m.studentId?.name || '—'}</div></td>
                               <td><span className="chip" style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-dim)', fontSize: 12 }}>{m.rollNumber}</span></td>
                               <td><span style={{ fontWeight: 700, color: 'var(--text-2)', fontSize: 13 }}>{m.subject}</span></td>
                               <td><div style={{ fontWeight: 800, fontSize: 14 }}>{m.marks} / {m.maxMarks}</div></td>
                               <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                     <span style={{ fontWeight: 800, fontSize: 13, color: pct >= 50 ? 'var(--success)' : 'var(--danger)', minWidth: 35 }}>{pct}%</span>
                                     <div className="marks-bar" style={{ width: 40, height: 6 }}>
                                        <div className={`marks-bar-fill ${pct < 40 ? 'danger' : pct < 60 ? 'warning' : ''}`} style={{ width: `${pct}%` }} />
                                     </div>
                                  </div>
                               </td>
                               <td><span className="badge bg-warm-2" style={{ textTransform: 'uppercase', fontWeight: 900, fontSize: 9 }}>{m.examType}</span></td>
                               <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{m.teacherId?.name || '—'}</td>
                               <td style={{ textAlign: 'right' }}>
                                  <button className={`btn btn-xs ${m.isFinal ? 'btn-ghost' : 'btn-primary'}`} style={{ borderRadius: 20, padding: '6px 14px' }} onClick={() => toggleFinal(m)}>
                                     {m.isFinal ? <><Unlock size={12} /> Unlock Access</> : <><Lock size={12} /> Force Finalize</>}
                                  </button>
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

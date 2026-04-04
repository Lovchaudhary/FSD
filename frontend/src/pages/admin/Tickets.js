import React, { useEffect, useState } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { Search, ChevronDown, ChevronUp, Lock, Eye, MessageSquare, Info, Shield, Filter, Database } from 'lucide-react';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    API.get('/admin/tickets').then(r => setTickets(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || t.title?.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q) || t.studentId?.name?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const countByStatus = (s) => tickets.filter(t => t.status === s).length;

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Global Support Audit</h3>
            <p>Master oversight for all system tickets. Student anonymity is lifted for administrative security reasons.</p>
          </div>
          <div className="page-header-actions">
             <button className="btn btn-ghost btn-sm" onClick={() => window.location.reload()}><Database size={15} /> All Active Tickets</button>
          </div>
        </div>

        {/* Support Pipeline Stats */}
        <div className="stat-grid" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
           {[
             { label: 'Total Queries Raised', value: tickets.length, icon: '🎫', color: 'var(--primary)' },
             { label: 'Open & Unassigned', value: countByStatus('open'), icon: '🔴', color: 'var(--danger)' },
             { label: 'Merchant Specialist Review', value: countByStatus('in-progress'), icon: '⏳', color: 'var(--warning)' },
             { label: 'Resolved Tickets', value: countByStatus('resolved'), icon: '✅', color: 'var(--success)' },
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

        {/* Global Pipeline Queue */}
        <div className="card">
           <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div className="card-title">Live Conversation Audit</div>
              <div className="search-bar" style={{ maxWidth: 320, flex: 1 }}>
                 <Search size={15} />
                 <input placeholder="Search tickets, subjects or student identities..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                 {['all', 'open', 'in-progress', 'resolved', 'closed'].map(s => (
                    <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setStatusFilter(s)} style={{ borderRadius: 20 }}>
                       {s === 'all' ? 'All Live' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                 ))}
              </div>
           </div>

           {loading ? <div className="loading-spinner" /> : filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: 60 }}>
                 <div className="empty-icon"><MessageSquare size={42} /></div>
                 <h4>No global queries matching</h4>
                 <p>All student support communications are clear or no matches found.</p>
              </div>
           ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                 {filtered.map(t => (
                    <div key={t._id} className="card" style={{ padding: 0, overflow: 'hidden', border: '1.5px solid var(--card-border)' }}>
                       <div className="card-header" onClick={() => setExpanded(expanded === t._id ? null : t._id)} style={{ padding: '16px 24px', cursor: 'pointer', background: expanded === t._id ? 'var(--warm-1)' : 'transparent', transition: 'var(--transition)' }}>
                          <div style={{ flex: 1 }}>
                             <div style={{ fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{t.title}</div>
                             <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                <span className="badge bg-warm-2" style={{ fontWeight: 800, fontSize: 9 }}>{t.subject.toUpperCase()}</span>
                                <span className={`badge ${t.status === 'resolved' ? 'badge-approved' : 'badge-pending'}`}>{t.status.toUpperCase()}</span>
                                {t.isAnonymous && <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800 }}>🔒 PRIVATE (Real Identity: {t.studentId?.name || 'Unknown Identification'})</span>}
                                {!t.isAnonymous && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Student Participant: {t.studentId?.name || 'Expired Account'}</span>}
                                {t.teacherId && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>→ Handled by: {t.teacherId?.name || 'Specialist Expired'}</span>}
                             </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                             <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)' }}>
                                <div>{new Date(t.createdAt).toLocaleDateString()}</div>
                                <div style={{ fontWeight: 700 }}>{t.replies?.length || 0} Responses Recorded</div>
                             </div>
                             {expanded === t._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                       </div>

                       {expanded === t._id && (
                          <div style={{ padding: '24px', borderTop: '1px solid var(--card-border)', background: '#fff' }}>
                             <div style={{ background: 'var(--warm-1)', padding: '16px 20px', borderRadius: 16, marginBottom: 24, border: '1px solid var(--card-border)', fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                                <div style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><MessageSquare size={13} /> Original Support Request Details</div>
                                {t.description}
                             </div>

                             {t.replies?.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderLeft: '2px dashed var(--card-border)', paddingLeft: 24, marginLeft: 12 }}>
                                   {t.replies.map((r, i) => (
                                      <div key={i}>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                            <span style={{ fontWeight: 800, fontSize: 11, color: 'var(--text)', textTransform: 'uppercase' }}>{r.senderRole === 'teacher' ? '👨‍🏫 Specialist Response' : '🎒 Student Reply'}</span>
                                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleString()}</span>
                                         </div>
                                         <div style={{ background: r.senderRole === 'teacher' ? 'var(--primary-glow)' : 'var(--warm-1)', padding: '12px 18px', borderRadius: 12, border: '1.5px solid var(--card-border)', fontSize: 13.5, color: 'var(--text)', boxShadow: 'var(--shadow-sm)' }}>
                                            {r.message}
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             )}

                             <div style={{ marginTop: 24, padding: '14px 20px', background: 'var(--warm-1)', borderRadius: 12, border: '1.5px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛡️</div>
                                <div>
                                   <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>Administrative Master Override View</div>
                                   <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Under Global Privacy Policy, Admin participant sees all Identities regardless of participant settings.</div>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

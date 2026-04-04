import React, { useEffect, useState } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { Send, CheckCircle, ChevronDown, ChevronUp, Lock, Eye, MessageSquare, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TeacherTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchTickets = () => {
    API.get('/teacher/tickets').then(r => setTickets(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const sendReply = async (ticketId) => {
    if (!replyMsg.trim()) return;
    try {
      await API.put(`/teacher/tickets/${ticketId}/reply`, { message: replyMsg });
      setReplyMsg('');
      toast.success('Reply submitted successfully!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const resolve = async (ticketId) => {
    try {
      await API.put(`/teacher/tickets/${ticketId}/resolve`);
      toast.success('Ticket marked as resolved!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to resolve ticket');
    }
  };

  const filtered = tickets.filter(t => filter === 'all' ? true : t.status === filter);

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Student Support Hub</h3>
            <p>Publish responses to student queries while respecting identity privacy settings</p>
          </div>
          <div className="page-header-actions">
             <button className="btn btn-ghost btn-sm" onClick={fetchTickets}><Info size={15} /> All Active Support Queries</button>
          </div>
        </div>

        {/* Filter Management */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
           {['all', 'open', 'in-progress', 'resolved'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: 20 }}>
                 {f === 'all' ? 'All Live' : f.charAt(0).toUpperCase() + f.slice(1)}
                 <span style={{ marginLeft: 8, background: filter === f ? 'rgba(0,0,0,0.1)' : 'var(--warm-3)', color: filter === f ? '#fff' : 'var(--text-muted)', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                    {tickets.filter(t => f === 'all' ? true : t.status === f).length}
                 </span>
              </button>
           ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) 2fr', gap: 24, alignItems: 'start' }}>
           {/* Sidebar List */}
           <div className="card h-full" style={{ padding: 0 }}>
              <div className="card-header border-b" style={{ padding: 16 }}>
                 <div className="card-title">Pending Student Queries</div>
              </div>
              {loading ? <div className="loading-spinner" /> : filtered.length === 0 ? (
                 <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-dim)' }}>
                    <div style={{ fontSize: 36, marginBottom: 16 }}>📫</div>
                    <h4 style={{ fontWeight: 800 }}>No queries in queue</h4>
                    <p style={{ fontSize: 12 }}>Check back later or adjust filters.</p>
                 </div>
              ) : (
                <div style={{ overflowY: 'auto', maxHeight: 600 }}>
                   {filtered.map(t => {
                      const isSelected = expanded === t._id;
                      return (
                        <div key={t._id} onClick={() => setExpanded(t._id)} style={{ padding: '16px 20px', cursor: 'pointer', background: isSelected ? 'var(--primary-glow)' : 'transparent', borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent', borderBottom: '1px solid var(--card-border)', transition: 'var(--transition)' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ fontWeight: 800, fontSize: 13, color: isSelected ? 'var(--primary-dark)' : 'var(--text)' }}>{t.title}</span>
                              <span className={`badge ${t.status === 'resolved' ? 'badge-approved' : 'badge-pending'}`} style={{ fontSize: 9 }}>{t.status.toUpperCase()}</span>
                           </div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                              <span>{t.subject} · {new Date(t.createdAt).toLocaleDateString()}</span>
                              {t.isAnonymous && <span style={{ color: 'var(--accent)', fontWeight: 800 }}>🔒 PRIVATE</span>}
                           </div>
                        </div>
                      );
                   })}
                </div>
              )}
           </div>

           {/* Conversation Area */}
           <div className="card h-full" style={{ minHeight: 450, padding: 0, display: 'flex', flexDirection: 'column' }}>
              {expanded ? (() => {
                 const t = tickets.find(x => x._id === expanded);
                 return (
                   <>
                      <div className="card-header border-b" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <h4 style={{ fontWeight: 900, marginBottom: 2 }}>{t.title}</h4>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.subject} · From: {t.isAnonymous ? '🔒 Anonymous Student' : t.studentId?.name}</p>
                         </div>
                         {t.status !== 'resolved' && (
                            <button className="btn btn-success btn-xs" onClick={() => resolve(t._id)}>
                               <CheckCircle size={13} /> Mark Resolved
                            </button>
                         )}
                      </div>

                      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                            <div style={{ background: 'var(--warm-1)', border: '1.5px solid var(--card-border)', padding: '12px 18px', borderRadius: '4px 18px 18px 18px', fontSize: 13.5, lineHeight: 1.6 }}>
                               {t.description}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
                               <span style={{ fontWeight: 800 }}>🎒 {t.isAnonymous ? '🔒 Anonymous Student identity protected' : t.studentId?.name}</span>
                            </div>
                         </div>

                         {t.replies?.map((r, i) => (
                           <div key={i} style={{ alignSelf: r.senderRole === 'teacher' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                              <div style={{ background: r.senderRole === 'teacher' ? 'var(--primary)' : 'var(--warm-1)', color: r.senderRole === 'teacher' ? '#fff' : 'var(--text)', border: r.senderRole === 'teacher' ? 'none' : '1.5px solid var(--card-border)', padding: '12px 18px', borderRadius: r.senderRole === 'teacher' ? '18px 18px 4px 18px' : '4px 18px 18px 18px', fontSize: 13.5, lineHeight: 1.6 }}>
                                 {r.message}
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, textAlign: r.senderRole === 'teacher' ? 'right' : 'left' }}>
                                 <span style={{ fontWeight: 800 }}>{r.senderRole === 'teacher' ? '👨‍🏫 You (Specialist)' : '🎒 Student'}</span> · {new Date(r.createdAt).toLocaleDateString()}
                              </div>
                           </div>
                         ))}
                      </div>

                      {t.status !== 'resolved' && (
                        <div style={{ borderTop: '1px solid var(--card-border)', padding: '16px 20px', display: 'flex', gap: 10 }}>
                           <input className="form-control" placeholder="Reply as specialist..." value={replyMsg} onChange={e => setReplyMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply(t._id)} />
                           <button className="btn btn-primary" onClick={() => sendReply(t._id)} disabled={!replyMsg.trim()}>
                              <Send size={15}/>
                           </button>
                        </div>
                      )}
                   </>
                 );
              })() : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-dim)' }}>
                   <div style={{ fontSize: 60, marginBottom: 16 }}>💬</div>
                   <h4 style={{ fontWeight: 800 }}>Response Panel Ready</h4>
                   <p style={{ fontSize: 13 }}>Choose a conversation from the left queue to respond.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

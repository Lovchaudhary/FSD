import React, { useEffect, useState } from 'react';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Send, CheckCircle } from 'lucide-react';

export default function TeacherTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [filter, setFilter] = useState('open');

  const fetchTickets = () =>
    API.get('/teacher/tickets').then(r => setTickets(r.data)).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchTickets(); }, []);

  const sendReply = async (ticketId) => {
    if (!replyMsg.trim()) return;
    try {
      const { data } = await API.put(`/teacher/tickets/${ticketId}/reply`, { message: replyMsg });
      setTickets(prev => prev.map(t => t._id === ticketId ? data : t));
      setReplyMsg('');
      toast.success('Reply sent!');
    } catch (err) { toast.error('Failed to send reply'); }
  };

  const resolve = async (id) => {
    try {
      const { data } = await API.put(`/teacher/tickets/${id}/resolve`);
      setTickets(prev => prev.map(t => t._id === id ? data : t));
      toast.success('Ticket resolved');
    } catch { toast.error('Failed to resolve'); }
  };

  const filtered = tickets.filter(t => filter === 'all' ? true : t.status === filter);

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Student Support Queue</h3>
            <p>Reply to student queries from your classes</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['open','resolved','all'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
          {/* Ticket List */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? <div className="loading-spinner" style={{ margin: 40 }} /> :
              filtered.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <div className="empty-icon">✅</div>
                  <p>No {filter} tickets</p>
                </div>
              ) : filtered.map(t => (
                <div key={t._id}
                  onClick={() => { setExpanded(t._id); setReplyMsg(''); }}
                  style={{ padding: '14px 18px', borderBottom: '1px solid var(--card-border)', cursor: 'pointer', background: expanded === t._id ? 'var(--warm-2)' : 'transparent' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{t.title}</span>
                    <span className={`badge badge-${t.status === 'resolved' ? 'approved' : 'neutral'}`} style={{ fontSize: 10 }}>{t.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                    {t.isAnonymous ? '🔒 Anonymous' : `🎒 ${t.studentName}`} · <span className="chip" style={{ fontSize: 10 }}>{t.priority}</span>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Chat Panel */}
          <div className="card" style={{ minHeight: 400, display: 'flex', flexDirection: 'column', padding: 0 }}>
            {expanded ? (() => {
              const t = tickets.find(x => x._id === expanded);
              if (!t) return null;
              return (
                <>
                  <div className="card-header border-b" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 900, marginBottom: 2 }}>{t.title}</h4>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.category} · From: {t.isAnonymous ? '🔒 Anonymous' : t.studentName}</p>
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
                        {t.description || t.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
                        🎒 {t.isAnonymous ? '🔒 Anonymous' : t.studentName}
                      </div>
                    </div>

                    {(t.replies || []).map((r, i) => (
                      <div key={i} style={{ alignSelf: r.sender === 'teacher' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        <div style={{
                          background: r.sender === 'teacher' ? 'var(--primary)' : 'var(--warm-1)',
                          color: r.sender === 'teacher' ? '#fff' : 'var(--text)',
                          border: r.sender === 'teacher' ? 'none' : '1.5px solid var(--card-border)',
                          padding: '12px 18px', borderRadius: r.sender === 'teacher' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                          fontSize: 13.5, lineHeight: 1.6,
                        }}>
                          {r.message}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, textAlign: r.sender === 'teacher' ? 'right' : 'left' }}>
                          {r.sender === 'teacher' ? '👨‍🏫 You' : '🎒 Student'} · {new Date(r.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--card-border)', padding: '16px 20px', display: 'flex', gap: 10 }}>
                    <input className="form-control" placeholder="Reply to student..." value={replyMsg}
                      onChange={e => setReplyMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply(t._id)} />
                    <button className="btn btn-primary" onClick={() => sendReply(t._id)} disabled={!replyMsg.trim()}>
                      <Send size={15} />
                    </button>
                  </div>
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

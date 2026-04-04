import React, { useEffect, useState, useRef } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { Plus, Send, ChevronDown, ChevronUp, Lock, Eye, MessageSquare, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Biology', 'History'];

export default function StudentTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [form, setForm] = useState({ subject: '', title: '', description: '', isAnonymous: true });
  const chatEndRef = useRef(null);

  const fetchTickets = () => {
    API.get('/tickets/mine').then(r => setTickets(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tickets', form);
      toast.success('Ticket submitted successfully!');
      setShowModal(false);
      setForm({ subject: '', title: '', description: '', isAnonymous: true });
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    }
  };

  const sendReply = async (ticketId) => {
    if (!replyMsg.trim()) return;
    try {
      await API.put(`/tickets/${ticketId}/reply`, { message: replyMsg });
      setReplyMsg('');
      fetchTickets();
      toast.success('Reply sent!');
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Support Tickets</h3>
            <p>Connect with your subject teachers privately and securely</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
             <Plus size={15} /> Raise Support Ticket
          </button>
        </div>

        {/* Info Banner */}
        <div className="alert alert-info" style={{ marginBottom: 24 }}>
          <Lock size={16} />
          <strong>Your privacy matters.</strong> Anonymous tickets hide your identity even from the teachers. 
          Use this for queries or feedback without any hesitation.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Ticket List Sidebar */}
          <div className="card h-full" style={{ padding: 0 }}>
            <div className="card-header border-b" style={{ padding: 16 }}>
              <div className="card-title">My Recent Queries</div>
            </div>
            {loading ? <div className="loading-spinner" /> : tickets.length === 0 ? (
               <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)' }}>
                 <div style={{ fontSize: 32, marginBottom: 10 }}>🎫</div>
                 <h4 style={{ fontSize: 14 }}>No tickets here</h4>
                 <p style={{ fontSize: 11 }}>Submit a new ticket to get started.</p>
               </div>
            ) : (
               <div style={{ overflowY: 'auto', maxHeight: 600 }}>
                 {tickets.map(t => {
                   const isSelected = expanded === t._id;
                   return (
                     <div key={t._id} 
                       onClick={() => setExpanded(t._id)}
                       style={{ 
                         padding: '16px 20px', cursor: 'pointer', 
                         background: isSelected ? 'var(--primary-glow)' : 'transparent',
                         borderBottom: '1px solid var(--card-border)',
                         borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent',
                         transition: 'var(--transition)',
                        }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontWeight: 800, fontSize: 13, color: isSelected ? 'var(--primary-dark)' : 'var(--text)' }}>{t.title}</span>
                          <span className={`badge ${t.status === 'resolved' ? 'badge-approved' : 'badge-pending'}`} style={{ fontSize: 9 }}>{t.status}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
                          <span>{t.subject} · {new Date(t.createdAt).toLocaleDateString()}</span>
                          {t.isAnonymous && <Lock size={10} style={{ color: 'var(--accent)' }} />}
                        </div>
                     </div>
                   );
                 })}
               </div>
            )}
          </div>

          {/* Chat / Detail View */}
          <div className="card h-full" style={{ minHeight: 400, flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
            {expanded ? (() => {
              const t = tickets.find(x => x._id === expanded);
              return (
                <>
                  <div className="card-header border-b" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, marginBottom: 2 }}>{t.title}</h4>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.subject} · Created {new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                    <div className={`badge-status ${t.status}`} style={{ padding: '4px 14px' }}>{t.status.toUpperCase()}</div>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Opener */}
                    <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                       <div style={{ background: 'var(--warm-1)', border: '1.5px solid var(--card-border)', padding: '12px 18px', borderRadius: '4px 18px 18px 18px', fontSize: 13.5, color: 'var(--text)', lineHeight: 1.5 }}>
                          {t.description}
                       </div>
                       <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontWeight: 700 }}>🎒 You</span> {t.isAnonymous && <span style={{ opacity: 0.7 }}>(🔒 Private Identity)</span>}
                       </div>
                    </div>

                    {/* Replies */}
                    {t.replies?.map((r, i) => (
                       <div key={i} style={{ alignSelf: r.senderRole === 'teacher' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                         <div style={{ 
                            background: r.senderRole === 'teacher' ? 'var(--primary)' : 'var(--warm-1)', 
                            color: r.senderRole === 'teacher' ? '#fff' : 'var(--text)',
                            border: r.senderRole === 'teacher' ? 'none' : '1.5px solid var(--card-border)',
                            padding: '12px 18px', borderRadius: r.senderRole === 'teacher' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                            fontSize: 13.5, lineHeight: 1.5,
                            boxShadow: 'var(--shadow-sm)',
                          }}>
                           {r.message}
                         </div>
                         <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, textAlign: r.senderRole === 'teacher' ? 'right' : 'left' }}>
                            <span style={{ fontWeight: 700 }}>{r.senderRole === 'teacher' ? '👨‍🏫 Teacher' : '🎒 You'}</span> · {new Date(r.createdAt).toLocaleDateString()}
                         </div>
                       </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {t.status !== 'resolved' && (
                    <div style={{ borderTop: '1px solid var(--card-border)', padding: '16px 20px', display: 'flex', gap: 10 }}>
                      <input 
                        className="form-control" 
                        placeholder="Type your message..." 
                        value={replyMsg} 
                        onChange={e => setReplyMsg(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && sendReply(t._id)}
                      />
                      <button className="btn btn-primary" onClick={() => sendReply(t._id)} disabled={!replyMsg.trim()}>
                        <Send size={15}/>
                      </button>
                    </div>
                  )}
                </>
              );
            })() : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>📫</div>
                <h4 style={{ fontWeight: 800 }}>Select a ticket to view conversation</h4>
                <p style={{ fontSize: 13 }}>Choose one from the left sidebar or create a new one.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-title"><Plus size={20} /> Raise Support Ticket</div>
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Related Subject</label>
                <select className="form-control" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                  <option value="">Select subject teacher...</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Issue Title</label>
                <input className="form-control" placeholder="Brief subject or title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Detail Description</label>
                <textarea className="form-control" rows={4} placeholder="Explain your query or concern in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ resize: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--warm-1)', padding: '12px 16px', borderRadius: 12, border: '1.5px solid var(--card-border)', marginBottom: 20, cursor: 'pointer' }} onClick={() => setForm(f => ({ ...f, isAnonymous: !f.isAnonymous }))}>
                <div style={{ width: 44, height: 26, borderRadius: 13, background: form.isAnonymous ? 'var(--accent)' : 'var(--warm-4)', transition: 'background 0.2s', position: 'relative' }}>
                   <div style={{ position: 'absolute', top: 3, left: form.isAnonymous ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                </div>
                <div>
                   <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)' }}>Submit Anonymously</div>
                   <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Teachers will not see your identity</div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Raise Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

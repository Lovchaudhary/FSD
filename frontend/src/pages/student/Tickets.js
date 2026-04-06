import React, { useEffect, useState, useRef } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { Plus, Send, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Computer Science', 'Data Structures', 'Operating Systems', 'Calculus', 'Other'];

export default function StudentTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [form, setForm] = useState({ title: '', category: '', description: '', isAnonymous: true, priority: 'medium' });
  const chatEndRef = useRef(null);

  const fetchTickets = () =>
    API.get('/student/tickets').then(r => setTickets(r.data)).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchTickets(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [expanded, tickets]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/student/tickets', form);
      toast.success('Ticket submitted!');
      setShowModal(false);
      setForm({ title: '', category: '', description: '', isAnonymous: true, priority: 'medium' });
      fetchTickets();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit'); }
  };

  const sendReply = async (ticketId) => {
    if (!replyMsg.trim()) return;
    try {
      const { data } = await API.put(`/student/tickets/${ticketId}/reply`, { message: replyMsg });
      setTickets(prev => prev.map(t => t._id === ticketId ? data : t));
      setReplyMsg('');
    } catch (err) { toast.error('Failed to send reply'); }
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Support Tickets</h3>
            <p>Connect with your teachers privately and securely</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Raise Support Ticket
          </button>
        </div>

        <div className="alert alert-info" style={{ marginBottom: 24 }}>
          <Lock size={16} />
          <strong>Your privacy matters.</strong> Anonymous tickets hide your identity from teachers.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'flex-start' }}>
          {/* Ticket List */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? <div className="loading-spinner" style={{ margin: 40 }} /> :
              tickets.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <div className="empty-icon">🎫</div>
                  <p>No tickets yet. Raise one!</p>
                </div>
              ) : tickets.map(t => (
                <div key={t._id}
                  onClick={() => { setExpanded(t._id); setReplyMsg(''); }}
                  style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)', cursor: 'pointer', background: expanded === t._id ? 'var(--warm-2)' : 'transparent', transition: 'background 0.15s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{t.title}</span>
                    <span className={`badge badge-${t.status === 'resolved' ? 'approved' : t.status === 'in-progress' ? 'pending' : 'neutral'}`} style={{ fontSize: 10 }}>{t.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                    <span className="chip" style={{ fontSize: 10 }}>{t.priority}</span>
                    {' '}{new Date(t.createdAt).toLocaleDateString()}
                    {t.isAnonymous && <Lock size={10} style={{ color: 'var(--accent)', marginLeft: 6, verticalAlign: 'middle' }} />}
                  </div>
                </div>
              ))
            }
          </div>

          {/* Chat Panel */}
          <div className="card" style={{ minHeight: 400, flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
            {expanded ? (() => {
              const t = tickets.find(x => x._id === expanded);
              if (!t) return null;
              return (
                <>
                  <div className="card-header border-b" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, marginBottom: 2 }}>{t.title}</h4>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.category} · {new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                    <div className={`badge-status ${t.status}`} style={{ padding: '4px 14px' }}>{t.status.toUpperCase()}</div>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Original message */}
                    <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                      <div style={{ background: 'var(--warm-1)', border: '1.5px solid var(--card-border)', padding: '12px 18px', borderRadius: '4px 18px 18px 18px', fontSize: 13.5, lineHeight: 1.6 }}>
                        {t.description || t.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
                        🎒 {t.isAnonymous ? '(Anonymous)' : 'You'}
                      </div>
                    </div>

                    {/* Reply thread */}
                    {(t.replies || []).map((r, i) => (
                      <div key={i} style={{ alignSelf: r.sender === 'teacher' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        <div style={{
                          background: r.sender === 'teacher' ? 'var(--primary)' : 'var(--warm-1)',
                          color: r.sender === 'teacher' ? '#fff' : 'var(--text)',
                          border: r.sender === 'teacher' ? 'none' : '1.5px solid var(--card-border)',
                          padding: '12px 18px', borderRadius: r.sender === 'teacher' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                          fontSize: 13.5, lineHeight: 1.5,
                        }}>
                          {r.message}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, textAlign: r.sender === 'teacher' ? 'right' : 'left' }}>
                          {r.sender === 'teacher' ? '👨‍🏫 Teacher' : '🎒 You'} · {new Date(r.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <div style={{ borderTop: '1px solid var(--card-border)', padding: '16px 20px', display: 'flex', gap: 10 }}>
                    <input className="form-control" placeholder="Type your message..." value={replyMsg}
                      onChange={e => setReplyMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply(t._id)} />
                    <button className="btn btn-primary" onClick={() => sendReply(t._id)} disabled={!replyMsg.trim()}>
                      <Send size={15} />
                    </button>
                  </div>
                </>
              );
            })() : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>📫</div>
                <h4 style={{ fontWeight: 800 }}>Select a ticket to view conversation</h4>
                <p style={{ fontSize: 13 }}>Choose one from the left or create a new one.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-title"><Plus size={20} /> Raise Support Ticket</div>
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Related Subject</label>
                <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select subject...</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Issue Title *</label>
                <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Brief summary of your issue" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Explain your issue in detail..." />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  {['low','medium','high'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
                <input type="checkbox" id="anon" checked={form.isAnonymous} onChange={e => setForm({ ...form, isAnonymous: e.target.checked })} />
                <label htmlFor="anon" style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Submit anonymously (teacher won't see your name)</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

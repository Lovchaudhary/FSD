import React, { useState } from 'react';
import { RotateCcw, Plus, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const REVALUATION_REQUESTS = [
  { id: 'R001', subject: 'Computer Networks', sem: 'Sem 3', obtainedMarks: 38, submittedOn: 'Dec 15, 2025', status: 'resolved', newMarks: 45, remarks: 'Re-checked, marks updated.' },
  { id: 'R002', subject: 'Data Structures',   sem: 'Sem 2', obtainedMarks: 52, submittedOn: 'May 2, 2025',  status: 'pending',  newMarks: null, remarks: '' },
];

const SUBJECTS = ['Data Structures', 'Database MGMT', 'Computer Networks', 'Operating Systems', 'Software Engg'];

export default function Revaluation() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ subject: '', marks: '', reason: '' });
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    toast.success('Revaluation request submitted successfully!');
    setModal(false);
    setForm({ subject: '', marks: '', reason: '' });
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Revaluation Requests</h3>
            <p>Apply for re-checking of your answer sheets</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>
            <Plus size={15} /> New Request
          </button>
        </div>

        {/* Info Banner */}
        <div className="alert alert-info" style={{ marginBottom: 24 }}>
          <RotateCcw size={16} />
          Revaluation requests once submitted cannot be withdrawn. Fee of ₹500 per subject applies. Results typically take 2-3 weeks.
        </div>

        {/* Requests */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Your Requests</div>
          {REVALUATION_REQUESTS.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h4>No requests yet</h4>
              <p>Submit a revaluation request if you want your answer sheet re-checked.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {REVALUATION_REQUESTS.map(r => (
                <div key={r.id} style={{ background: 'var(--warm-1)', borderRadius: 'var(--radius)', padding: '18px 20px', border: '1.5px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: r.status === 'resolved' ? 'var(--success-bg)' : 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {r.status === 'resolved' ? '✅' : '⏳'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{r.subject}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.sem} · Submitted: {r.submittedOn}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Marks when applied: <strong>{r.obtainedMarks}</strong></div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${r.status === 'resolved' ? 'badge-approved' : 'badge-pending'}`} style={{ marginBottom: 6 }}>
                      {r.status === 'resolved' ? <><CheckCircle size={10} /> Resolved</> : <><Clock size={10} /> Pending</>}
                    </span>
                    {r.status === 'resolved' && (
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 800 }}>New Marks: {r.newMarks}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.remarks}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {modal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title"><RotateCcw size={20} /> New Revaluation Request</div>
              <div className="alert alert-warning" style={{ marginBottom: 20 }}>
                ⚠️ Revaluation fee of <strong>₹500</strong> will be charged per subject.
              </div>
              <form onSubmit={submit}>
                <div className="form-group">
                  <label>Subject</label>
                  <select className="form-control" name="subject" value={form.subject} onChange={handle} required>
                    <option value="">Select subject...</option>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Obtained Marks</label>
                  <input className="form-control" name="marks" type="number" placeholder="e.g. 38" value={form.marks} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label>Reason for Revaluation</label>
                  <textarea className="form-control" name="reason" rows={4} placeholder="Explain why you believe your marks should be re-evaluated..." value={form.reason} onChange={handle} required style={{ resize: 'vertical' }} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { BookOpen, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BACK_PAPERS = [
  { id: 'B001', subject: 'Computer Networks', sem: 'Sem 2', failedMarks: 30, examDate: 'May 15, 2026', status: 'applied', fee: 1500 },
];

const FAILED_SUBJECTS = [
  { subject: 'Digital Electronics', sem: 'Sem 1', marks: 28, fee: 1500 },
];

export default function BackPaper() {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleApply = (sub) => {
    setSelected(sub);
    setModal(true);
  };

  const submit = () => {
    toast.success(`Back paper application for ${selected.subject} submitted!`);
    setModal(false);
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Back Paper</h3>
            <p>Apply for supplementary examinations for failed subjects</p>
          </div>
        </div>

        <div className="alert alert-warning" style={{ marginBottom: 24 }}>
          <AlertTriangle size={16} />
          Back paper forms are accepted until <strong>Apr 30, 2026</strong>. Late submissions will not be entertained.
        </div>

        {/* Active Applications */}
        {BACK_PAPERS.length > 0 && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title" style={{ marginBottom: 16 }}>📋 Active Applications</div>
            {BACK_PAPERS.map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--warm-1)', borderRadius: 'var(--radius)', border: '1.5px solid var(--card-border)', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 46, height: 46, background: 'rgba(245,158,11,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📖</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{b.subject}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.sem} · Failed Marks: <strong style={{ color: 'var(--danger)' }}>{b.failedMarks}</strong></div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Exam Date: <strong>{b.examDate}</strong></div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-pending" style={{ marginBottom: 6 }}><CheckCircle size={10} /> Applied</span>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Fee: ₹{b.fee}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Failed Subjects — eligible for back paper */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>❌ Failed Subjects (Eligible)</div>
          {FAILED_SUBJECTS.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <div className="empty-icon">🎉</div>
              <h4>No failed subjects!</h4>
              <p>You have cleared all your exams. Keep it up!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FAILED_SUBJECTS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: 'rgba(240,82,82,0.04)', borderRadius: 'var(--radius)', border: '1.5px solid rgba(240,82,82,0.2)', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 46, height: 46, background: 'var(--danger-bg)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📚</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{s.subject}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.sem} · Obtained: <span style={{ color: 'var(--danger)', fontWeight: 800 }}>{s.marks}</span> / 100 — <strong>FAIL</strong></div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Application Fee: ₹{s.fee}</div>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleApply(s)}>
                    <Plus size={14} /> Apply
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {modal && selected && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 420 }}>
              <div className="modal-title"><BookOpen size={20} /> Apply for Back Paper</div>
              <div style={{ background: 'var(--warm-1)', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 20, border: '1.5px solid var(--card-border)' }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{selected.subject}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selected.sem} · Application Fee: ₹{selected.fee}</div>
              </div>
              <div className="alert alert-warning">
                <AlertTriangle size={15} /> Once submitted, the application fee is non-refundable.
              </div>
              <div className="form-group">
                <label>Preferred Exam Slot</label>
                <select className="form-control">
                  <option>Morning Slot (9:00 AM – 12:00 PM)</option>
                  <option>Afternoon Slot (2:00 PM – 5:00 PM)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Any special requirements?</label>
                <textarea className="form-control" rows={3} placeholder="Leave blank if none..." style={{ resize: 'vertical' }} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={submit}>Submit Application</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

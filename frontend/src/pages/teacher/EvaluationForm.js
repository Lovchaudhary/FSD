import React, { useState } from 'react';
import { FileText, Save, List, CheckCircle, Search, ClipboardList, Clock, Plus, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const EVALUATIONS = [
  { id: 'E001', student: 'Ravi Kumar',   subject: 'DSA',   group: 'CS-A', score: 27, max: 30, status: 'submitted', date: 'Apr 1' },
  { id: 'E002', student: 'Priya Sharma', subject: 'DSA',   group: 'CS-A', score: 25, max: 30, status: 'submitted', date: 'Apr 1' },
  { id: 'E003', student: 'Arjun Singh',  subject: 'OS',    group: 'CS-B', score: null, max: 30, status: 'pending', date: '—'    },
  { id: 'E004', student: 'Meena Patel',  subject: 'DBMS',  group: 'IT-A', score: 28, max: 30, status: 'submitted', date: 'Mar 30' },
];

export default function EvaluationForm() {
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState('');
  const [remarks, setRemarks] = useState('');

  const filtered = EVALUATIONS.filter(e => filter === 'all' ? true : e.status === filter);

  const handleFill = (ev) => {
    setSelected(ev);
    setScore(ev.score || '');
    setRemarks('');
    setModal(true);
  };

  const submit = () => {
    toast.success(`Evaluation for ${selected.student} saved!`);
    setModal(false);
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Evaluation Forms</h3>
            <p>Fill and manage student evaluation scores</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => toast.success('Report downloaded!')}>
              <Download size={15} /> Export Report
            </button>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['all', 'pending', 'submitted'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={{ marginLeft: 6, background: filter === f ? 'rgba(255,255,255,0.25)' : 'var(--warm-3)', color: filter === f ? 'white' : 'var(--text-muted)', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                {EVALUATIONS.filter(e => f === 'all' ? true : e.status === f).length}
              </span>
            </button>
          ))}
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Student</th><th>Subject</th><th>Group</th><th>Score</th><th>Status</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(ev => (
                  <tr key={ev.id}>
                    <td style={{ fontWeight: 600 }}>{ev.student}</td>
                    <td><span className="chip">{ev.subject}</span></td>
                    <td>{ev.group}</td>
                    <td>
                      {ev.score !== null
                        ? <strong>{ev.score}/{ev.max}</strong>
                        : <span style={{ color: 'var(--text-dim)' }}>—</span>}
                    </td>
                    <td>
                      <span className={`badge ${ev.status === 'submitted' ? 'badge-approved' : 'badge-pending'}`}>
                        {ev.status === 'submitted' ? <><CheckCircle size={10} /> Submitted</> : <><Clock size={10} /> Pending</>}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{ev.date}</td>
                    <td>
                      <button className="btn btn-outline btn-xs" onClick={() => handleFill(ev)}>
                        {ev.status === 'submitted' ? 'Edit' : 'Fill'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {modal && selected && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title"><ClipboardList size={20} /> Evaluation — {selected.student}</div>
              <div style={{ background: 'var(--warm-1)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 20, border: '1.5px solid var(--card-border)', fontSize: 13 }}>
                Subject: <strong>{selected.subject}</strong> · Group: {selected.group}
              </div>
              <div className="form-group">
                <label>Score (out of {selected.max})</label>
                <input className="form-control" type="number" min={0} max={selected.max} placeholder={`0 – ${selected.max}`} value={score} onChange={e => setScore(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Remarks</label>
                <textarea className="form-control" rows={3} placeholder="Add comments about the student's performance..." value={remarks} onChange={e => setRemarks(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={submit}>Save Evaluation</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

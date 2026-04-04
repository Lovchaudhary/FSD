import React, { useState } from 'react';
import { FileSearch, Eye, CheckCircle, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const SHEETS = [
  { id: 'AS001', student: 'Ravi Kumar',    rollNo: 'CS2021001', subject: 'DSA',  sem: 'Sem 4', status: 'pending',  requestedOn: 'Apr 2' },
  { id: 'AS002', student: 'Priya Sharma',  rollNo: 'CS2021002', subject: 'OS',   sem: 'Sem 4', status: 'checked',  requestedOn: 'Apr 1', checkedOn: 'Apr 3' },
  { id: 'AS003', student: 'Arjun Singh',   rollNo: 'CS2021003', subject: 'DBMS', sem: 'Sem 3', status: 'pending',  requestedOn: 'Apr 2' },
];

export default function AnswerSheet() {
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = SHEETS.filter(s => filter === 'all' ? true : s.status === filter);

  const handleCheck = (sheet) => { setSelected(sheet); setModal(true); };
  const markChecked = () => { toast.success('Answer sheet marked as checked!'); setModal(false); };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Answer Sheet Management</h3>
            <p>Review and respond to answer sheet checking requests</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['all', 'pending', 'checked'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={{ marginLeft: 6, background: filter === f ? 'rgba(255,255,255,0.25)' : 'var(--warm-3)', color: filter === f ? 'white' : 'var(--text-muted)', borderRadius: 20, padding: '1px 7px', fontSize: 11 }}>
                {SHEETS.filter(s => f === 'all' ? true : s.status === f).length}
              </span>
            </button>
          ))}
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Student</th><th>Roll No</th><th>Subject</th><th>Semester</th><th>Requested</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.student}</td>
                    <td><span className="chip">{s.rollNo}</span></td>
                    <td>{s.subject}</td>
                    <td>{s.sem}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.requestedOn}</td>
                    <td>
                      {s.status === 'checked'
                        ? <span className="badge badge-approved"><CheckCircle size={10} /> Checked</span>
                        : <span className="badge badge-pending"><Clock size={10} /> Pending</span>}
                    </td>
                    <td>
                      <button className={`btn btn-xs ${s.status === 'pending' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => handleCheck(s)}>
                        {s.status === 'pending' ? <><Eye size={12}/> Review</> : 'View'}
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
              <div className="modal-title"><FileSearch size={20} /> Answer Sheet Review</div>
              <div style={{ background: 'var(--warm-1)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: 20, border: '1.5px solid var(--card-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  {[
                    { label: 'Student', value: selected.student },
                    { label: 'Roll No', value: selected.rollNo },
                    { label: 'Subject', value: selected.subject },
                    { label: 'Semester', value: selected.sem },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
                      <div style={{ fontWeight: 700, marginTop: 2 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'var(--warm-2)', borderRadius: 'var(--radius)', padding: '40px', textAlign: 'center', border: '2px dashed var(--warm-4)', marginBottom: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📑</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Answer sheet preview would appear here</div>
              </div>
              <div className="form-group">
                <label>Feedback / Comments</label>
                <textarea className="form-control" rows={3} placeholder="Add your comments about this answer sheet..." style={{ resize: 'vertical' }} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>Close</button>
                {selected.status === 'pending' && (
                  <button className="btn btn-success btn-sm" onClick={markChecked}><CheckCircle size={14} /> Mark as Checked</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

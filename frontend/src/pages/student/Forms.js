import React, { useEffect, useState } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { Plus, FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Biology', 'History'];
const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

const FORM_INFO = {
  exam: { label: 'Exam Form', emoji: '📋', desc: 'Secure your seat for end-term examinations', color: 'var(--primary)', bg: 'var(--primary-glow)' },
  referal: { label: 'Referal Form', emoji: '🔄', desc: 'Apply for re-examination or grade review', color: 'var(--accent)', bg: 'rgba(108,99,255,0.08)' },
  admit_card: { label: 'Admit Card', emoji: '🎫', desc: 'Generate and download official admit card', color: 'var(--success)', bg: 'var(--success-bg)' },
};

export default function StudentForms() {
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [form, setForm] = useState({ formType: '', semester: '', subjects: [] });

  const fetchForms = () => {
    API.get('/student/forms')
       .then(r => setForms(r.data))
       .catch(() => toast.error('Failed to load forms'))
       .finally(() => setLoading(false));
  };

  useEffect(() => { fetchForms(); }, [user]);

  const openForm = (type) => {
    setActiveType(type);
    setForm({ formType: type, semester: '', subjects: [] });
    setShowModal(true);
  };

  const toggleSubject = (s) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(s) ? f.subjects.filter(x => x !== s) : [...f.subjects, s]
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/student/forms', {
        semester: parseInt(form.semester?.replace(/\D/g, '')) || 1,
        examType: form.formType === 'exam' ? 'regular' : form.formType,
        subjects: form.subjects,
      });
      toast.success('Application submitted successfully!');
      setShowModal(false);
      fetchForms();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit form'); }
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Forms & Applications</h3>
            <p>Administer your exam eligibility and document requests</p>
          </div>
          <div className="page-header-actions">
             <span style={{ fontSize: 13, background: 'var(--warm-1)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: 20, border: '1.5px solid var(--card-border)' }}>
               Academic Year 2025-26
             </span>
          </div>
        </div>

        {/* Form Quick Access */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginBottom: 30 }}>
          {Object.entries(FORM_INFO).map(([type, info]) => (
            <div key={type} className="card h-full" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16 }}>{info.emoji}</div>
              <h4 style={{ fontWeight: 800, marginBottom: 8 }}>{info.label}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, flex: 1 }}>{info.desc}</p>
              <button className="btn btn-primary btn-sm btn-full" onClick={() => openForm(type)}>
                <Plus size={14} /> Start Application
              </button>
            </div>
          ))}
        </div>

        {/* Status Tracker */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">My Recent Applications</div>
          </div>
          {loading ? <div className="loading-spinner" /> : forms.length === 0 ? (
            <div className="empty-state" style={{ padding: 60 }}>
              <div className="empty-icon"><FileText size={42} /></div>
              <h4>No applications found</h4>
              <p>You haven't submitted any forms yet. Use the cards above to start.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Semester</th>
                    <th>Subjects</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Ref ID</th>
                  </tr>
                </thead>
                <tbody>
                  {forms.map(f => (
                    <tr key={f._id}>
                      <td style={{ fontWeight: 800, color: 'var(--text)' }}>
                        {FORM_INFO[f.formType]?.label || f.formType}
                      </td>
                      <td><span className="chip">{f.semester}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: 200 }}>
                          {f.subjects?.slice(0, 3).map(s => <span key={s} className="badge bg-warm-2" style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 600 }}>{s}</span>)}
                          {f.subjects?.length > 3 && <span className="badge bg-warm-2" style={{ fontSize: 10, fontWeight: 700 }}>+{f.subjects.length - 3}</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${f.status === 'approved' ? 'badge-approved' : f.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                          {f.status === 'approved' ? <><CheckCircle size={10} /> Approved</> : f.status === 'rejected' ? <><XCircle size={10} /> Rejected</> : <><Clock size={10} /> Pending</>}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(f.submittedAt || f.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</td>
                      <td><span className="chip" style={{ fontFamily: 'monospace', fontSize: 11 }}>{f._id.slice(-6).toUpperCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-title">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: FORM_INFO[activeType]?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginRight: 12 }}>{FORM_INFO[activeType]?.emoji}</div>
              {FORM_INFO[activeType]?.label}
            </div>
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Target Semester</label>
                <select className="form-control" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} required>
                  <option value="">Select your semester...</option>
                  {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Select Included Subjects</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {SUBJECTS.map(s => (
                    <button type="button" key={s}
                      className={`btn btn-xs ${form.subjects.includes(s) ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ borderRadius: 20, padding: '6px 14px' }}
                      onClick={() => toggleSubject(s)}
                    >
                      {form.subjects.includes(s) && '✓ '}{s}
                    </button>
                  ))}
                </div>
                {form.subjects.length === 0 && <span style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8, display: 'block' }}>⚠️ Select at least one subject</span>}
              </div>

              <div className="alert alert-info" style={{ marginTop: 10, fontSize: 12 }}>
                <AlertCircle size={14} /> Please verify all details. Once submitted, applications enter review phase and cannot be modified.
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={!form.semester || form.subjects.length === 0}>
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

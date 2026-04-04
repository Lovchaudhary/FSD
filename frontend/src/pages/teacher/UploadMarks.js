import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import toast from 'react-hot-toast';
import { Upload, Lock, Trash2, Search, Database, Info } from 'lucide-react';

const EXAM_TYPES = ['internal', 'external', 'assignment', 'practical'];
const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

export default function UploadMarks() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    studentRollNumber: '', subject: user?.subjects?.[0] || '',
    marks: '', maxMarks: 100, examType: 'internal', semester: '', group: ''
  });

  const fetchMarks = () => {
    setLoading(true);
    API.get('/teacher/marks')
      .then(r => setMarks(Array.isArray(r.data) ? r.data : []))
      .catch(() => setMarks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMarks(); }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/teacher/marks', { ...form, marks: Number(form.marks), maxMarks: Number(form.maxMarks) });
      toast.success('Marks uploaded successfully!');
      setForm(p => ({ ...p, studentRollNumber: '', marks: '' }));
      fetchMarks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload marks');
    }
    setSaving(false);
  };

  const finalize = async (id) => {
    if (!window.confirm('⚠️ Finalizing marks will LOCK them permanently. Are you sure?')) return;
    try {
      await API.put(`/teacher/marks/${id}/finalize`);
      toast.success('Marks finalized and locked!');
      fetchMarks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to finalize');
    }
  };

  const filtered = marks.filter(m => {
     const q = search.toLowerCase();
     return !q || (m.rollNumber?.toLowerCase().includes(q)) || (m.subject?.toLowerCase().includes(q));
  });

  const grouped = filtered.reduce((acc, m) => {
    const key = `${m.subject || 'Unknown'}__${m.examType || 'Regular'}__${m.semester || 'Batch'}`;
    acc[key] = acc[key] || [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header" style={{ marginBottom: 24 }}>
          <div className="page-header-left">
            <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>Upload Student Marks</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Publish academic results with automated lock and review features</p>
          </div>
          <div className="page-header-actions">
             <button className="btn btn-ghost btn-sm" onClick={fetchMarks}><Database size={15} /> Refresh Archive</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(360px, 400px) 1fr', gap: 24, alignItems: 'start' }}>
          {/* Marks Entry Sidebar */}
          <div className="card h-full" style={{ position: 'sticky', top: 90 }}>
            <div style={{ padding: '0 0 20px', borderBottom: '1.5px solid var(--card-border)', marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>🚀 Batch Score Entry</div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Enter student details for rapid portal publication</p>
            </div>
            
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Student Roll Number *</label>
                <input className="form-control" name="studentRollNumber" placeholder="" value={form.studentRollNumber} onChange={handle} required />
              </div>

              <div className="form-group">
                <label>Specialist Subject Area *</label>
                <select className="form-control" name="subject" value={form.subject} onChange={handle} required>
                  <option value="">Choose your assigned subject...</option>
                  {(user?.subjects || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Marks Scored *</label>
                  <input className="form-control text-center" type="number" name="marks" placeholder="0" min="0" max={form.maxMarks} value={form.marks} onChange={handle} required style={{ fontWeight: 900, fontSize: 18 }} />
                </div>
                <div className="form-group">
                  <label>Max Marks</label>
                  <input className="form-control text-center" type="number" name="maxMarks" value={form.maxMarks} onChange={handle} style={{ fontSize: 18 }} />
                </div>
              </div>

              <div className="divider" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Exam Type</label>
                  <select className="form-control" name="examType" value={form.examType} onChange={handle}>
                    {EXAM_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Semester</label>
                  <select className="form-control" name="semester" value={form.semester} onChange={handle} required>
                    <option value="">Choose...</option>
                    {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Academic Group/Section</label>
                <input className="form-control" name="group" placeholder="" value={form.group} onChange={handle} />
              </div>

              <button className="btn btn-primary btn-full" style={{ marginTop: 10, padding: '14px' }} disabled={saving || !user?.subjects?.length}>
                 <Upload size={16} /> {saving ? 'Publishing...' : 'Upload Student Record'}
              </button>
            </form>

            <div style={{ marginTop: 20, padding: 12, background: 'var(--warm-1)', border: '1.5px solid var(--card-border)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
               <Info size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
               <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>Only finalized records are visible to students. Any draft can be updated by the teacher.</p>
            </div>
          </div>

          {/* Records Panel */}
          <div className="card h-full flex-1">
             <div className="card-header" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div className="card-title">🔍 Academic Record Summary</div>
                <div className="search-bar" style={{ maxWidth: 280, flex: 1 }}>
                  <Search size={15} />
                  <input placeholder="Filter roll numbers or subject names..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
             </div>

             {loading ? <div className="loading-spinner" /> : Object.keys(grouped).length === 0 ? (
                <div className="empty-state" style={{ padding: 60 }}>
                  <div style={{ fontSize: 44, marginBottom: 16 }}>📂</div>
                  <h4>No data to display</h4>
                  <p>You haven't uploaded any student marks for this semester yet.</p>
                </div>
             ) : (
                Object.entries(grouped).map(([key, group]) => {
                  const [subject, examType, semester] = key.split('__');
                  const allFinal = group.every(m => m.isFinal);
                  return (
                    <div key={key} style={{ marginBottom: 32, border: '1.5px solid var(--card-border)', borderRadius: 16, overflow: 'hidden' }}>
                      <div style={{ background: 'var(--warm-1)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: 15 }}>{subject}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: 11.5, marginLeft: 8 }}>· {examType.toUpperCase()} · {semester}</span>
                         </div>
                         {!allFinal && (
                            <button className="btn btn-primary btn-xs" onClick={() => group.forEach(m => !m.isFinal && finalize(m._id))}>
                               <Lock size={12} /> Lock Whole Batch
                            </button>
                         )}
                      </div>
                      <div className="table-wrapper">
                         <table>
                            <thead>
                               <tr>
                                  <th>Identity</th>
                                  <th>Roll Number</th>
                                  <th>Obtained</th>
                                  <th>Status Tracking</th>
                                  <th style={{ textAlign: 'right' }}>Security Action</th>
                               </tr>
                            </thead>
                            <tbody>
                               {group.map(m => {
                                  const pct = Math.round((m.marks / m.maxMarks) * 100);
                                  return (
                                     <tr key={m._id}>
                                        <td style={{ fontWeight: 800, color: 'var(--text)' }}>{m.studentId?.name || m.studentName || '—'}</td>
                                        <td><span className="chip" style={{ fontFamily: 'monospace', fontWeight: 800 }}>{m.rollNumber}</span></td>
                                        <td>
                                           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                              <span style={{ fontWeight: 900, color: 'var(--text)', fontSize: 14 }}>{m.marks} / {m.maxMarks}</span>
                                              <div className="marks-bar" style={{ width: 40, height: 6 }}>
                                                 <div className={`marks-bar-fill ${pct < 40 ? 'danger' : pct < 60 ? 'warning' : ''}`} style={{ width: `${pct}%` }} />
                                              </div>
                                           </div>
                                        </td>
                                        <td>
                                           <span className={`badge ${m.isFinal ? 'badge-approved' : 'badge-pending'}`} style={{ textTransform: 'uppercase', fontSize: 9 }}>
                                              {m.isFinal ? 'Locked & Published' : 'In Progress (Draft)'}
                                           </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                           {!m.isFinal ? (
                                              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                 <button className="btn btn-ghost btn-xs" onClick={() => finalize(m._id)} title="Finalize entry">
                                                    <Lock size={13} /> Lock
                                                 </button>
                                                 <button className="btn btn-ghost btn-xs text-danger" title="Purge Record">
                                                    <Trash2 size={13} />
                                                 </button>
                                              </div>
                                           ) : (
                                              <span style={{ fontSize: 10, color: 'var(--success)', fontWeight: 900 }}>SECURED</span>
                                           )}
                                        </td>
                                     </tr>
                                  );
                               })}
                            </tbody>
                         </table>
                      </div>
                    </div>
                  );
                })
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

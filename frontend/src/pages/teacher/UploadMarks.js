import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import toast from 'react-hot-toast';
import { Upload, FileText, CheckCircle, Search } from 'lucide-react';

const EXAM_TYPES = ['internal', 'external', 'assignment', 'practical'];
const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

export default function UploadMarks() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [allowedSubjects, setAllowedSubjects] = useState([]);
  const [form, setForm] = useState({ studentRollNumber: '', subject: '', marks: '', maxMarks: 100, examType: 'internal', semester: '', group: '' });

  useEffect(() => {
    // Get teacher's allowed subjects from their profile
    setAllowedSubjects(user?.allowedSubjects || []);
    API.get('/teacher/marks')
      .then(r => setMarks(r.data))
      .catch(() => toast.error('Failed to load marks'))
      .finally(() => setLoading(false));
  }, [user]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.post('/teacher/marks', form);
      setMarks(prev => [data, ...prev]);
      setForm({ studentRollNumber: '', subject: '', marks: '', maxMarks: 100, examType: 'internal', semester: '', group: '' });
      toast.success(`✅ Marks uploaded for roll: ${form.studentRollNumber}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload marks');
    }
    setSaving(false);
  };

  const finalize = async (id) => {
    try {
      const { data } = await API.put(`/teacher/marks/${id}/finalize`);
      setMarks(prev => prev.map(m => m._id === id ? data : m));
      toast.success('Marks finalized — now visible to student');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to finalize'); }
  };

  const filtered = marks.filter(m =>
    m.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase()) ||
    m.studentId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Upload Marks</h3>
            <p>Upload and finalize student marks for your assigned subjects</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'flex-start' }}>
          {/* Upload Form */}
          <div className="card" style={{ position: 'sticky', top: 24 }}>
            <div className="card-title" style={{ marginBottom: 20 }}>
              <Upload size={18} /> Upload Record
            </div>

            {allowedSubjects.length === 0 ? (
              <div style={{ padding: '16px', background: 'var(--warm-1)', border: '1.5px solid var(--warning)', borderRadius: 12, fontSize: 13, color: 'var(--warning)', textAlign: 'center' }}>
                <Lock size={18} style={{ marginBottom: 8 }} />
                <div><strong>No subjects permitted yet</strong></div>
                <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>Contact admin to grant subject upload permissions.</div>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-group">
                  <label>Student Roll Number *</label>
                  <input className="form-control" name="studentRollNumber" placeholder="e.g. CS2021001" value={form.studentRollNumber} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <select className="form-control" name="subject" value={form.subject} onChange={handle} required>
                    <option value="">Choose your assigned subject...</option>
                    {allowedSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Marks Scored *</label>
                    <input className="form-control" name="marks" type="number" min="0" max={form.maxMarks} placeholder="0" value={form.marks} onChange={handle} required />
                  </div>
                  <div className="form-group">
                    <label>Maximum Marks</label>
                    <input className="form-control" name="maxMarks" type="number" min="1" value={form.maxMarks} onChange={handle} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Exam Type *</label>
                  <select className="form-control" name="examType" value={form.examType} onChange={handle}>
                    {EXAM_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Semester</label>
                    <select className="form-control" name="semester" value={form.semester} onChange={handle}>
                      <option value="">Select...</option>
                      {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Group / Section</label>
                    <input className="form-control" name="group" placeholder="e.g. CS-A" value={form.group} onChange={handle} />
                  </div>
                </div>
                <button className="btn btn-primary btn-full" style={{ marginTop: 10, padding: '14px' }} disabled={saving}>
                  <Upload size={16} /> {saving ? 'Uploading...' : 'Upload Student Record'}
                </button>
              </form>
            )}
          </div>

          {/* Marks Table */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: 16 }}>
              <div className="card-title">Uploaded Records ({filtered.length})</div>
              <div className="search-box" style={{ maxWidth: 280 }}>
                <Search size={15} />
                <input placeholder="Search by roll no, name, subject..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>

            {loading ? <div className="loading-spinner" /> : filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: 60 }}>
                <div className="empty-icon">📊</div>
                <h4>No records uploaded yet</h4>
                <p>Start uploading student marks using the form on the left.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Roll No</th><th>Student</th><th>Subject</th><th>Marks</th><th>Type</th><th>Sem</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(m => {
                      const pct = Math.round((m.marks / m.maxMarks) * 100);
                      return (
                        <tr key={m._id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{m.rollNumber}</td>
                          <td style={{ fontWeight: 600 }}>{m.studentId?.name || '—'}</td>
                          <td>{m.subject}</td>
                          <td>
                            <span style={{ fontWeight: 800 }}>{m.marks}/{m.maxMarks}</span>
                            <span style={{ fontSize: 11, color: pct >= 40 ? 'var(--success)' : 'var(--danger)', marginLeft: 6 }}>({pct}%)</span>
                          </td>
                          <td><span className="chip" style={{ textTransform: 'capitalize', fontSize: 11 }}>{m.examType}</span></td>
                          <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.semester || '—'}</td>
                          <td>
                            <span className={`badge ${m.isFinal ? 'badge-approved' : 'badge-pending'}`} style={{ fontSize: 11 }}>
                              {m.isFinal ? '🔒 Final' : '⏳ Draft'}
                            </span>
                          </td>
                          <td>
                            {!m.isFinal && (
                              <button className="btn btn-success btn-xs" onClick={() => finalize(m._id)} title="Finalize — makes visible to student">
                                Finalize
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

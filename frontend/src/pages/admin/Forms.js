import React, { useEffect, useState } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Search, Clock, FileText, Filter, MoreVertical, Database } from 'lucide-react';

const FORM_LABELS = {
  exam: '📝 Exam Form',
  referal: '🔄 Referal Form',
  admit_card: '🎫 Admit Card',
};

export default function AdminForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchForms = () => {
    API.get('/admin/forms').then(r => setForms(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchForms(); }, []);

  const updateStatus = async (id, status) => {
    const remarks = status === 'rejected' ? window.prompt('Reason for rejection (optional):') : '';
    try {
      await API.put(`/admin/forms/${id}`, { status, remarks: remarks || '' });
      toast.success(`Application decision published: ${status.toUpperCase()}`);
      fetchForms();
    } catch (err) {
      toast.error('Failed to publish application decision');
    }
  };

  const filtered = forms.filter(f => {
    const matchStatus = statusFilter === 'all' || f.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || f.studentId?.name?.toLowerCase().includes(q) || f.studentId?.rollNumber?.toLowerCase().includes(q) || f.formType?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Global Application Oversight</h3>
            <p>Administer student registrations, exam eligibility, and document issuance requests</p>
          </div>
          <div className="page-header-actions">
             <button className="btn btn-ghost btn-sm" onClick={fetchForms}><Database size={15} /> All Active Requests</button>
          </div>
        </div>

        {/* Audit Pipeline Stats */}
        <div className="stat-grid" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
           {[
             { label: 'Total Submissions', value: forms.length, icon: '📋', color: 'var(--primary)' },
             { label: 'Pending Review', value: forms.filter(f => f.status === 'pending').length, icon: '⏳', color: 'var(--warning)' },
             { label: 'Approved & Issued', value: forms.filter(f => f.status === 'approved').length, icon: '✅', color: 'var(--success)' },
             { label: 'Rejected / Disputed', value: forms.filter(f => f.status === 'rejected').length, icon: '❌', color: 'var(--danger)' },
           ].map((s, i) => (
             <div key={i} className="stat-card" style={{ padding: '16px 22px' }}>
                <div style={{ fontSize: 24 }}>{s.icon}</div>
                <div>
                   <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>{s.value}</div>
                   <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
             </div>
           ))}
        </div>

        {/* Pipeline & Queue */}
        <div className="card">
           <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div className="search-bar" style={{ flex: 1, minWidth: 260 }}>
                 <Search size={15} />
                 <input placeholder="Filter by student name, roll ID or document type..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                 {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setStatusFilter(s)} style={{ borderRadius: 20 }}>
                       {s.charAt(0).toUpperCase() + s.slice(1)} Submissions
                    </button>
                 ))}
              </div>
           </div>

           {loading ? <div className="loading-spinner" /> : filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: 60 }}>
                 <div className="empty-icon"><FileText size={42} /></div>
                 <h4>No applications in queue</h4>
                 <p>All student requests have been processed or none have been submitted yet.</p>
              </div>
           ) : (
              <div className="table-wrapper">
                 <table>
                    <thead>
                       <tr>
                          <th>Student Profiling</th>
                          <th>Academic Roll</th>
                          <th>Application Type</th>
                          <th>Academic Semester</th>
                          <th>Registered Subjects</th>
                          <th>Recorded Date</th>
                          <th>Approval Tracking</th>
                          <th style={{ textAlign: 'right' }}>Administrative Action</th>
                       </tr>
                    </thead>
                    <tbody>
                       {filtered.map(f => (
                          <tr key={f._id}>
                             <td><div style={{ fontWeight: 800, color: 'var(--text)' }}>{f.studentId?.name || '—'}</div></td>
                             <td><span className="chip" style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-dim)', fontSize: 12 }}>{f.studentId?.rollNumber || 'NO ROLL'}</span></td>
                             <td><span style={{ fontWeight: 700, color: 'var(--text-2)', fontSize: 13 }}>{FORM_LABELS[f.formType] || f.formType}</span></td>
                             <td><span className="badge bg-warm-2" style={{ fontWeight: 900, fontSize: 10, letterSpacing: 0.5 }}>{f.semester.toUpperCase()}</span></td>
                             <td>
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 160 }}>
                                   {(f.subjects || []).slice(0,2).map(s => <span key={s} className="badge bg-warm-2" style={{ color: 'var(--text-dim)', fontSize: 9 }}>{s}</span>)}
                                   {(f.subjects || []).length > 2 && <span className="badge bg-warm-2" style={{ fontSize: 9 }}>+{f.subjects.length - 2}</span>}
                                </div>
                             </td>
                             <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(f.createdAt).toLocaleDateString()}</td>
                             <td>
                                <span className={`badge ${f.status === 'approved' ? 'badge-approved' : f.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                                    {f.status === 'approved' ? <><CheckCircle size={10} /> Published</> : f.status === 'rejected' ? <><XCircle size={10} /> Discarded</> : <><Clock size={10} /> Reviewing</>}
                                </span>
                             </td>
                             <td style={{ textAlign: 'right' }}>
                                {f.status === 'pending' ? (
                                   <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                      <button className="btn btn-success btn-xs" style={{ borderRadius: 20, padding: '6px 12px' }} onClick={() => updateStatus(f._id, 'approved')}>
                                         <CheckCircle size={12} /> Approve
                                      </button>
                                      <button className="btn btn-danger btn-xs" style={{ borderRadius: 20, padding: '6px 12px' }} onClick={() => updateStatus(f._id, 'rejected')}>
                                         <XCircle size={12} /> Reject
                                      </button>
                                   </div>
                                ) : (
                                   <button className="btn btn-ghost btn-xs" onClick={() => updateStatus(f._id, 'pending')} title="Reset application state">
                                      Restore to Queue
                                   </button>
                                )}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

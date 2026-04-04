import React, { useEffect, useState } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Search, UserCheck, UserX, Key, User, Shield, Info, Filter } from 'lucide-react';

const ROLES = ['student', 'teacher', 'admin'];
const SUBJECTS_LIST = ['Math', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Biology', 'History'];

const EMPTY_FORM = {
  name: '', email: '', password: '', role: 'student',
  rollNumber: '', department: '', subjects: '', groups: '', phone: '', isActive: true,
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null); 
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    API.get('/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({
      name: u.name || '',
      email: u.email || '',
      password: '',
      role: u.role || 'student',
      rollNumber: u.rollNumber || '',
      department: u.department || '',
      subjects: (u.subjects || []).join(', '),
      groups: (u.groups || []).join(', '),
      phone: u.phone || '',
      isActive: u.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        subjects: form.subjects ? form.subjects.split(',').map(s => s.trim()).filter(Boolean) : [],
        groups:   form.groups   ? form.groups.split(',').map(g => g.trim()).filter(Boolean)   : [],
      };
      if (!payload.password) delete payload.password; 

      if (editUser) {
        await API.put(`/admin/users/${editUser._id}`, payload);
        toast.success('User profile updated!');
      } else {
        await API.post('/admin/users', payload);
        toast.success('New user account created!');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
    setSaving(false);
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Permanently delete user "${name}"? This action cannot be revoked.`)) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User removed from system');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const toggleActive = async (u) => {
    try {
      await API.put(`/admin/users/${u._id}`, { isActive: !u.isActive });
      toast.success(`User ${u.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.rollNumber?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Global User Directory</h3>
            <p>Administer accounts, roles, and security permissions across the portal</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Plus size={15} /> Provision New User
          </button>
        </div>

        {/* Global Directory Stats */}
        <div className="stat-grid" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
           {[
             { label: 'Total Accounts', value: users.length, icon: '👥', color: 'var(--primary)' },
             { label: 'Academic Staff', value: users.filter(u => u.role === 'teacher').length, icon: '👨‍🏫', color: 'var(--accent)' },
             { label: 'Active Students', value: users.filter(u => u.role === 'student').length, icon: '🎓', color: 'var(--success)' },
             { label: 'System Admins', value: users.filter(u => u.role === 'admin').length, icon: '⚙️', color: 'var(--warning)' },
           ].map((s, i) => (
             <div key={i} className="stat-card" style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: 24 }}>{s.icon}</div>
                <div>
                   <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>{s.value}</div>
                   <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
             </div>
           ))}
        </div>

        {/* Filters & Manage */}
        <div className="card" style={{ marginBottom: 24 }}>
           <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div className="search-bar" style={{ flex: 1, minWidth: 260 }}>
                 <Search size={15} />
                 <input placeholder="Filter by name, email, roll no..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                 {['all', ...ROLES].map(r => (
                    <button key={r} className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRoleFilter(r)} style={{ borderRadius: 20 }}>
                       {r.charAt(0).toUpperCase() + r.slice(1)}s
                    </button>
                 ))}
              </div>
           </div>

           {loading ? <div className="loading-spinner" /> : filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: 60 }}>
                 <div className="empty-icon"><UserX size={42} /></div>
                 <h4>No matching users</h4>
                 <p>Try refining your search or changing the role filter.</p>
              </div>
           ) : (
              <div className="table-wrapper">
                 <table>
                    <thead>
                       <tr>
                          <th>User Profile</th>
                          <th>System Role</th>
                          <th>Academic Info</th>
                          <th>Acc. Status</th>
                          <th>Joined</th>
                          <th style={{ textAlign: 'right' }}>Management</th>
                       </tr>
                    </thead>
                    <tbody>
                       {filtered.map(u => (
                          <tr key={u._id}>
                             <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                   <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary-glow)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, border: '1.5px solid var(--primary-light)' }}>
                                      {u.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                                   </div>
                                   <div>
                                      <div style={{ fontWeight: 800, color: 'var(--text)' }}>{u.name}</div>
                                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                                   </div>
                                </div>
                             </td>
                             <td><span className={`badge-role ${u.role}`} style={{ fontWeight: 800, fontSize: 10, letterSpacing: 0.5 }}>{u.role.toUpperCase()}</span></td>
                             <td>
                                {u.role === 'student' && <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-dim)', fontSize: 12 }}>{u.rollNumber || 'NO ROLL'}</span>}
                                {u.role === 'teacher' && (
                                   <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 160 }}>
                                      {(u.subjects || []).slice(0,2).map(s => <span key={s} className="badge bg-warm-2" style={{ color: 'var(--text-dim)', fontSize: 9 }}>{s}</span>)}
                                      {(u.subjects || []).length > 2 && <span className="badge bg-warm-2" style={{ fontSize: 9 }}>+{u.subjects.length - 2}</span>}
                                   </div>
                                )}
                                {u.role === 'admin' && <Shield size={14} style={{ color: 'var(--primary-dark)' }} />}
                             </td>
                             <td>
                                <span className={`badge ${u.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                                   {u.isActive ? 'Active Mode' : 'Suspended'}
                                </span>
                             </td>
                             <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                             <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                                   <button className="btn btn-ghost btn-xs" onClick={() => openEdit(u)} title="Edit configuration">
                                      <Edit2 size={13} />
                                   </button>
                                   <button className="btn btn-ghost btn-xs" onClick={() => toggleActive(u)} title={u.isActive ? 'Suspend access' : 'Restore access'} style={{ color: u.isActive ? 'var(--warning)' : 'var(--success)' }}>
                                      {u.isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                                   </button>
                                   <button className="btn btn-ghost btn-xs text-danger" onClick={() => deleteUser(u._id, u.name)} title="Purge user">
                                      <Trash2 size={13} />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
      </div>

      {/* Provisioning Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 640 }}>
             <div className="modal-title">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginRight: 12 }}>{editUser ? '⚙️' : '👤'}</div>
                {editUser ? `Provisioning Configuration — ${editUser.name}` : 'Provision New System User'}
             </div>

             <form onSubmit={handleSubmit} style={{ overflowY: 'auto', maxHeight: '70vh', padding: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                   <div className="form-group">
                      <label>Legal Full Name *</label>
                      <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="" />
                   </div>
                   <div className="form-group">
                      <label>Official Email Address *</label>
                      <input className="form-control" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="" />
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                   <div className="form-group">
                      <label>Credentials {editUser ? '(Modify Password)' : ' (Initial Password) *'}</label>
                      <input className="form-control" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required={!editUser} />
                   </div>
                   <div className="form-group">
                      <label>Portal Assignment Role *</label>
                      <select className="form-control" value={form.role} onChange={e => setForm({...form, role: e.target.value})} disabled={!!editUser}>
                         {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                      </select>
                   </div>
                </div>

                <div className="divider" />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                   <div className="form-group">
                      <label>Unique Roll / Staff ID</label>
                      <input className="form-control" value={form.rollNumber} onChange={e => setForm({...form, rollNumber: e.target.value})} placeholder="" />
                   </div>
                   <div className="form-group">
                      <label>Department Office</label>
                      <input className="form-control" value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="" />
                   </div>
                </div>

                {form.role === 'teacher' && (
                   <div className="form-group">
                      <label>Assigned Specialized Subjects (JSON Array Style)</label>
                      <input className="form-control" value={form.subjects} onChange={e => setForm({...form, subjects: e.target.value})} placeholder="" />
                   </div>
                )}

                {editUser && (
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: 'var(--warm-1)', borderRadius: 12, border: '1.5px solid var(--card-border)', marginBottom: 20 }}>
                      <div onClick={() => setForm({...form, isActive: !form.isActive})} style={{ width: 44, height: 26, borderRadius: 13, background: form.isActive ? 'var(--success)' : 'var(--warm-4)', transition: 'background 0.2s', position: 'relative', cursor: 'pointer' }}>
                         <div style={{ position: 'absolute', top: 3, left: form.isActive ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)' }}>Grant Account Access Permissions</span>
                   </div>
                )}

                <div className="modal-footer">
                   <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>Discard</button>
                   <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                      {saving ? 'Processing...' : editUser ? 'Save Configuration' : 'Create System Account'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Fees Management — reusing student fees with admin context
import React, { useState } from 'react';
import { Download, Search, CreditCard, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const ALL_FEES = [
  { id: 'F001', student: 'Ravi Sharma',  roll: 'CS2021001', type: 'Tuition',   sem: 'Sem 4', amount: 45000, status: 'paid',   date: 'Apr 1' },
  { id: 'F002', student: 'Priya Singh',  roll: 'CS2021002', type: 'Exam Fee',  sem: 'Sem 4', amount: 2500,  status: 'unpaid', date: '—'    },
  { id: 'F003', student: 'Arjun Kumar',  roll: 'CS2021003', type: 'Tuition',   sem: 'Sem 4', amount: 45000, status: 'unpaid', date: '—'    },
  { id: 'F004', student: 'Meena Patel',  roll: 'IT2021001', type: 'Exam Fee',  sem: 'Sem 4', amount: 2500,  status: 'paid',   date: 'Mar 30' },
  { id: 'F005', student: 'Suresh Nair',  roll: 'EE2021001', type: 'Tuition',   sem: 'Sem 3', amount: 45000, status: 'paid',   date: 'Oct 20' },
];

export default function AdminFees() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ALL_FEES.filter(f =>
    (filter === 'all' ? true : f.status === filter) &&
    (f.student.toLowerCase().includes(search.toLowerCase()) || f.roll.includes(search))
  );

  const totalCollected = ALL_FEES.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalPending = ALL_FEES.filter(f => f.status === 'unpaid').reduce((s, f) => s + f.amount, 0);

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Fee Management</h3>
            <p>View and manage all student fee records</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-primary btn-sm" onClick={() => toast.success('Report exported!')}>
              <Download size={15} /> Export Report
            </button>
          </div>
        </div>

        <div className="stat-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Collected', value: `₹${totalCollected.toLocaleString()}`, icon: '✅', color: 'var(--success)' },
            { label: 'Pending Amount', value: `₹${totalPending.toLocaleString()}`, icon: '⏳', color: 'var(--danger)' },
            { label: 'Paid Records', value: ALL_FEES.filter(f => f.status === 'paid').length, icon: '💳', color: 'var(--info)' },
            { label: 'Unpaid Records', value: ALL_FEES.filter(f => f.status === 'unpaid').length, icon: '🔴', color: 'var(--warning)' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon coral" style={{ fontSize: 22 }}>{s.icon}</div>
              <div>
                <div className="stat-value" style={{ color: s.color, fontSize: 22 }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div className="search-bar" style={{ maxWidth: 280 }}>
              <Search size={15} />
              <input placeholder="Search student or roll no..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'paid', 'unpaid'].map(f => (
                <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Student</th><th>Roll No</th><th>Fee Type</th><th>Sem</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600 }}>{f.student}</td>
                    <td><span className="chip">{f.roll}</span></td>
                    <td>{f.type}</td>
                    <td>{f.sem}</td>
                    <td style={{ fontWeight: 800 }}>₹{f.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${f.status === 'paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                        {f.status === 'paid' ? <><CheckCircle size={10} /> Paid</> : <><Clock size={10} /> Unpaid</>}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{f.date}</td>
                    <td>
                      {f.status === 'paid'
                        ? <button className="btn btn-ghost btn-xs" onClick={() => toast.success('Receipt downloaded!')}>Receipt</button>
                        : <button className="btn btn-success btn-xs" onClick={() => toast.success('Marked as paid!')}>Mark Paid</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

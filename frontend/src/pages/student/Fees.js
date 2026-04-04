import React, { useState } from 'react';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const FEES = [
  { id: 'F001', type: 'Tuition Fee',      semester: 'Sem 4', amount: 45000, dueDate: 'Apr 30, 2026', status: 'unpaid'  },
  { id: 'F002', type: 'Examination Fee',  semester: 'Sem 4', amount: 2500,  dueDate: 'Apr 15, 2026', status: 'unpaid'  },
  { id: 'F003', type: 'Library Fee',      semester: 'Sem 4', amount: 1200,  dueDate: 'Apr 30, 2026', status: 'unpaid'  },
  { id: 'F004', type: 'Tuition Fee',      semester: 'Sem 3', amount: 45000, dueDate: 'Oct 30, 2025', status: 'paid',   paidOn: 'Oct 22, 2025', txn: 'TXN202510' },
  { id: 'F005', type: 'Examination Fee',  semester: 'Sem 3', amount: 2500,  dueDate: 'Oct 15, 2025', status: 'paid',   paidOn: 'Oct 10, 2025', txn: 'TXN202511' },
];

export default function Fees() {
  const [paying, setPaying] = useState(null);
  const [modal, setModal] = useState(false);
  const [method, setMethod] = useState('card');

  const unpaid = FEES.filter(f => f.status === 'unpaid');
  const paid = FEES.filter(f => f.status === 'paid');
  const totalDue = unpaid.reduce((s, f) => s + f.amount, 0);
  const totalPaid = paid.reduce((s, f) => s + f.amount, 0);

  const handlePay = (fee) => {
    setPaying(fee);
    setModal(true);
  };

  const processPayment = () => {
    toast.success(`Payment of ₹${paying.amount.toLocaleString()} processed! 🎉`);
    setModal(false);
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Fee Management</h3>
            <p>View and pay your academic fees online</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Due', value: `₹${totalDue.toLocaleString()}`, icon: '💳', color: 'var(--danger)', bg: 'var(--danger-bg)' },
            { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, icon: '✅', color: 'var(--success)', bg: 'var(--success-bg)' },
            { label: 'Pending Bills', value: unpaid.length, icon: '🧾', color: 'var(--warning)', bg: 'var(--warning-bg)' },
            { label: 'Paid Bills', value: paid.length, icon: '📋', color: 'var(--info)', bg: 'var(--info-bg)' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg, fontSize: 22 }}>{s.icon}</div>
              <div>
                <div className="stat-value" style={{ color: s.color, fontSize: 22 }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Due Banner */}
        {unpaid.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, #fff5f5, #fff)', border: '1.5px solid rgba(240,82,82,0.25)', borderRadius: 'var(--radius-lg)', padding: '18px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, background: 'rgba(240,82,82,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚠️</div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--danger)', fontSize: 15 }}>Outstanding fees due!</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Please clear your dues before the deadline to avoid late penalty.</div>
              </div>
            </div>
            <button className="btn btn-danger btn-sm">Pay All Dues</button>
          </div>
        )}

        {/* Unpaid Fees */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>⏳ Pending Fees</div>
          {unpaid.map(fee => (
            <div key={fee.id} className="fee-item" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(240,82,82,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💳</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{fee.type}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {fee.semester} · Due: <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{fee.dueDate}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--text)' }}>₹{fee.amount.toLocaleString()}</div>
                <span className="badge badge-unpaid"><AlertCircle size={10} /> Unpaid</span>
                <button className="btn btn-primary btn-sm" onClick={() => handlePay(fee)}>
                  Pay Now
                </button>
              </div>
            </div>
          ))}
          {unpaid.length === 0 && (
            <div className="empty-state" style={{ padding: 30 }}>
              <div className="empty-icon">🎉</div>
              <h4>All fees paid!</h4>
              <p>You have no pending dues.</p>
            </div>
          )}
        </div>

        {/* Paid Fees */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>✅ Payment History</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>Semester</th>
                  <th>Amount</th>
                  <th>Paid On</th>
                  <th>Transaction ID</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {paid.map(fee => (
                  <tr key={fee.id}>
                    <td style={{ fontWeight: 600 }}>{fee.type}</td>
                    <td>{fee.semester}</td>
                    <td style={{ fontWeight: 800 }}>₹{fee.amount.toLocaleString()}</td>
                    <td>{fee.paidOn}</td>
                    <td><span className="chip">{fee.txn}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-xs" onClick={() => toast.success('Receipt downloaded!')}>
                        <Download size={12} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {modal && paying && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 440 }}>
              <div className="modal-title">💳 Pay Fee</div>
              <div style={{ background: 'var(--warm-1)', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 24, border: '1.5px solid var(--card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{paying.type}</span>
                  <span style={{ fontWeight: 800, fontSize: 18 }}>₹{paying.amount.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{paying.semester} — Due: {paying.dueDate}</div>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { id: 'card', label: '💳 Card', },
                    { id: 'upi', label: '📱 UPI', },
                    { id: 'netbanking', label: '🏦 Net Banking', },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      className={`btn btn-sm ${method === m.id ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setMethod(m.id)}
                    >{m.label}</button>
                  ))}
                </div>
              </div>

              {method === 'card' && (
                <>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input className="form-control" placeholder="" maxLength={19} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label>Expiry</label>
                      <input className="form-control" placeholder="" maxLength={5} />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input className="form-control" placeholder="•••" maxLength={3} type="password" />
                    </div>
                  </div>
                </>
              )}
              {method === 'upi' && (
                <div className="form-group">
                  <label>UPI ID</label>
                  <input className="form-control" placeholder="" />
                </div>
              )}
              {method === 'netbanking' && (
                <div className="form-group">
                  <label>Select Bank</label>
                  <select className="form-control">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              <div className="modal-footer">
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={processPayment}>
                  <CreditCard size={14} /> Pay ₹{paying.amount.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

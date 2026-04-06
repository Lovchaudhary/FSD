import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Download, Printer, CheckCircle, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const EXAM_SUBJECTS = [
  { code: 'CS401', name: 'Data Structures & Algorithms', date: 'Apr 20, 2026', time: '10:00 AM', room: 'A-101' },
  { code: 'CS402', name: 'Database Management Systems', date: 'Apr 22, 2026', time: '10:00 AM', room: 'A-102' },
  { code: 'CS403', name: 'Computer Networks',            date: 'Apr 24, 2026', time: '02:00 PM', room: 'B-201' },
  { code: 'CS404', name: 'Operating Systems',            date: 'Apr 26, 2026', time: '10:00 AM', room: 'A-103' },
  { code: 'CS405', name: 'Software Engineering',         date: 'Apr 28, 2026', time: '02:00 PM', room: 'C-301' },
];

export default function AdmitCard() {
  const { user } = useAuth();
  const [printed, setPrinted] = useState(false);

  const handleDownload = () => {
    toast.success('Admit card downloaded successfully!');
    window.print();
    setPrinted(true);
  };

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Admit Card</h3>
            <p>Your official exam admission card for Semester 4</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
              <Printer size={15} /> Print
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleDownload}>
              <Download size={15} /> Download PDF
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className="alert alert-success" style={{ marginBottom: 24 }}>
          <CheckCircle size={18} />
          <strong>Admit card approved!</strong>&nbsp; You are eligible to appear in all scheduled examinations.
        </div>

        {/* Admit Card Preview */}
        <div className="admit-card-preview" style={{ maxWidth: 820, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 20, borderBottom: '2px dashed var(--warm-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,var(--primary),var(--secondary))', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎓</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 20, color: 'var(--text)' }}>ExamCell Institute</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Examination Form — Semester 4 (2025-26)</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', background: 'var(--warm-2)', padding: '10px 16px', borderRadius: 12, border: '1.5px solid var(--warm-4)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1 }}>ADMIT CARD NO.</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)' }}>AC-2026-0041</div>
            </div>
          </div>

          {/* Student Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 20, marginBottom: 24 }}>
            <div className="info-grid">
              {[
                { label: 'Student Name', value: user?.name || 'N/A' },
                { label: 'Roll Number', value: user?.rollNumber || 'N/A' },
                { label: 'Department', value: user?.department || 'N/A' },
                { label: 'Semester', value: '4th' },
                { label: 'Academic Year', value: '2025-26' },
                { label: 'Exam Type', value: 'End Semester' },
              ].map(({ label, value }) => (
                <div key={label} className="info-item">
                  <label>{label}</label>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            {/* Photo + QR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 80, height: 90, background: 'var(--warm-2)', borderRadius: 10, border: '1.5px solid var(--warm-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                {user?.avatar ? <img src={user.avatar} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} /> : '🧑‍🎓'}
              </div>
              <div style={{ width: 60, height: 60, background: '#1a1625', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={36} color="white" />
              </div>
            </div>
          </div>

          {/* Exam Schedule Table */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              📅 Examination Schedule
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Room No.</th>
                  </tr>
                </thead>
                <tbody>
                  {EXAM_SUBJECTS.map(s => (
                    <tr key={s.code}>
                      <td><span className="chip">{s.code}</span></td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.date}</td>
                      <td>{s.time}</td>
                      <td><span style={{ background: 'var(--primary-glow)', color: 'var(--primary-dark)', padding: '3px 10px', borderRadius: 20, fontWeight: 700, fontSize: 12 }}>{s.room}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ background: 'var(--warm-1)', border: '1.5px solid var(--warm-4)', borderRadius: 12, padding: 16, fontSize: 12 }}>
            <div style={{ fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>⚠️ Important Instructions</div>
            <ul style={{ paddingLeft: 18, color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
              {[
                'Carry this admit card to every exam',
                'Report 30 minutes before exam time',
                'Bring a valid photo ID proof',
                'Electronic devices are not permitted',
                'Write roll number on every page',
                'Read all instructions on answer sheet',
              ].map((ins, i) => <li key={i}>{ins}</li>)}
            </ul>
          </div>

          {/* Signature Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1.5px dashed var(--warm-4)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 120, height: 40, borderBottom: '1.5px solid var(--text-dim)', marginBottom: 4 }} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Student Signature</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 120, height: 40, borderBottom: '1.5px solid var(--text-dim)', marginBottom: 4 }} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Controller of Exams</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 2 }}>🔏</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Official Seal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

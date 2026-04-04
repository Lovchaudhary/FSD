import React from 'react';
import { Info, ShieldAlert, CheckCircle, Clock, BookOpen, AlertCircle, FileText, Layout, Download } from 'lucide-react';

export default function ExamInfo() {
  const sections = [
    {
      title: 'General Rules & Conduct',
      icon: <ShieldAlert size={20} color="var(--danger)" />,
      items: [
        'Candidates must carry their valid Admit Card and University ID for all sessions.',
        'Entry into the examination hall is permitted only up to 15 minutes after the start time.',
        'Electronic gadgets, including mobile phones and smartwatches, are strictly prohibited.',
        'Use of unfair means (UFM) will lead to immediate disqualification and disciplinary action.',
        'Calculators are allowed only for specific subjects as mentioned on the question paper.',
      ]
    },
    {
      title: 'Grading & Evaluation Policy',
      icon: <Layout size={20} color="var(--primary)" />,
      items: [
        'Minimum passing marks: 40% in each subject (Theory + Practical combined).',
        'Attendance below 75% will disqualify students from appearing in final examinations.',
        'Results will be published within 45 days of the last examination date.',
        'Revaluation requests must be submitted within 7 days of result declaration.',
        'Back-paper applications are available for students with less than 40% marks.',
      ]
    },
    {
      title: 'Reporting Schedule',
      icon: <Clock size={20} color="var(--accent)" />,
      items: [
        'Morning Shift: 09:30 AM – 12:30 PM (Reporting time: 09:00 AM)',
        'Afternoon Shift: 01:30 PM – 04:30 PM (Reporting time: 01:00 PM)',
        'Lab Sessions: Refer to departmental notice board for individual slots.',
      ]
    }
  ];

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
           <div className="page-header-left">
              <h3>Exam Repository & Guidelines</h3>
              <p>Official university protocols, regulatory guidelines, and important examination notices</p>
           </div>
           <div className="page-header-actions">
              <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                 <Download size={15} /> Download PDF Guidelines
              </button>
           </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
           {/* Guidelines List */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {sections.map((section, idx) => (
                 <div key={idx} className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                       <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--warm-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{section.icon}</div>
                       <h4 style={{ fontWeight: 800 }}>{section.title}</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                       {section.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                             <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, marginTop: 2, flexShrink: 0 }}>{i + 1}</div>
                             <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{item}</p>
                          </div>
                       ))}
                    </div>
                 </div>
              ))}
           </div>

           {/* Quick Actions & Notes */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card" style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <AlertCircle size={24} />
                    <h4 style={{ fontWeight: 900 }}>Notice for Backlogs</h4>
                 </div>
                 <p style={{ fontSize: 13, opacity: 0.9, marginBottom: 20, lineHeight: 1.5 }}>Backlogs of Odd Semesters (Sem 1, 3, 5) will be conducted in Nov-Dec Cycle. Registration opens on Oct 1st.</p>
                 <button className="btn btn-xs" style={{ background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: 20, padding: '8px 16px', fontWeight: 800 }}>Apply for Examination</button>
              </div>

              <div className="card">
                 <div className="card-title" style={{ marginBottom: 16 }}>📁 Resource Archive</div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { name: 'Syllabus Copy 2025', icon: <BookOpen size={14} /> },
                      { name: 'Sample Question Papers', icon: <FileText size={14} /> },
                      { name: 'Oversight Committee Report', icon: <Layout size={14} /> },
                      { name: 'Campus Access Map', icon: <Info size={14} /> },
                    ].map((res, i) => (
                       <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--warm-1)', border: '1.5px solid var(--card-border)', borderRadius: 10, cursor: 'pointer', transition: 'var(--transition)' }}>
                          <span style={{ color: 'var(--primary)' }}>{res.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>{res.name}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="card" style={{ background: 'var(--warm-1)', border: '1.5px solid var(--card-border)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <Info size={18} color="var(--primary)" />
                    <h4 style={{ fontWeight: 900, fontSize: 14 }}>Academic Support</h4>
                 </div>
                 <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>If you have any doubts regarding exam centers or sitting arrangements, please contact your department coordinator immediately.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

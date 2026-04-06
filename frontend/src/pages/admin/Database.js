import React, { useState } from 'react';
import { Database, RefreshCw, Download, Upload, Trash2, Search, Plus, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const COLLECTIONS = [
  { name: 'users',   count: 312, size: '1.2 MB',  lastModified: '2 min ago'  },
  { name: 'marks',   count: 1248, size: '3.8 MB', lastModified: '3 hours ago' },
  { name: 'tickets', count: 87,  size: '0.5 MB',  lastModified: '10 min ago' },
  { name: 'forms',   count: 156, size: '0.9 MB',  lastModified: '1 hour ago' },
  { name: 'results', count: 298, size: '2.1 MB',  lastModified: '5 hours ago'},
];

const SAMPLE_DOCS = {
  users: [
    { _id: '...001', name: 'Ravi Sharma', email: 'ravi@edu.com', role: 'student', dept: 'CS' },
    { _id: '...002', name: 'Dr. Meena',   email: 'meena@edu.com', role: 'teacher', dept: 'IT' },
  ],
  marks: [
    { _id: '...a01', student: '...001', subject: 'DSA', marks: 96, maxMarks: 100, sem: 4 },
    { _id: '...a02', student: '...002', subject: 'OS',  marks: 72, maxMarks: 100, sem: 4 },
  ],
};

export default function DatabasePanel() {
  const [activeCol, setActiveCol] = useState(null);
  const [search, setSearch] = useState('');
  const [showQuery, setShowQuery] = useState(false);
  const [query, setQuery] = useState('{ "role": "student" }');

  const docs = (SAMPLE_DOCS[activeCol] || []).filter(d =>
    JSON.stringify(d).toLowerCase().includes(search.toLowerCase())
  );

  const handleBackup = () => toast.success('Database backup initiated! ✅');
  const handleRestore = () => toast.error('Restore requires file upload (feature coming soon)');
  const handleRunQuery = () => toast.success(`Query executed on "${activeCol}"! Returned ${Math.floor(Math.random() * 50)} docs.`);

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>Database Management</h3>
            <p>Manage MongoDB collections and run queries</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-ghost btn-sm" onClick={handleRestore}>
              <Upload size={15} /> Restore
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleBackup}>
              <Download size={15} /> Backup Now
            </button>
          </div>
        </div>

        {/* DB Stats */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Database', value: 'examcell_db', icon: '🗄️' },
            { label: 'Total Size', value: '8.5 MB', icon: '💾' },
            { label: 'Collections', value: COLLECTIONS.length, icon: '📂' },
            { label: 'Total Docs', value: '2,101', icon: '📋' },
            { label: 'Last Backup', value: '6h ago', icon: '⏱️' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', border: '1.5px solid var(--card-border)', borderRadius: 'var(--radius)', padding: '14px 18px', flex: '1 1 130px', minWidth: 130 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>
          {/* Collections List */}
          <div className="card" style={{ height: 'fit-content' }}>
            <div className="card-title" style={{ marginBottom: 12 }}>📂 Collections</div>
            {COLLECTIONS.map(col => (
              <div
                key={col.name}
                onClick={() => setActiveCol(col.name)}
                style={{
                  padding: '12px 14px', borderRadius: 'var(--radius)',
                  background: activeCol === col.name ? 'var(--primary-glow)' : 'transparent',
                  border: activeCol === col.name ? '1.5px solid var(--primary-light)' : '1.5px solid transparent',
                  cursor: 'pointer', marginBottom: 4, transition: 'var(--transition)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: activeCol === col.name ? 'var(--primary-dark)' : 'var(--text)' }}>
                  📋 {col.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {col.count} docs · {col.size}
                </div>
              </div>
            ))}
          </div>

          {/* Documents View */}
          {activeCol ? (
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-header">
                  <div className="card-title">{activeCol}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowQuery(!showQuery)}>
                      {showQuery ? <X size={14} /> : <Search size={14} />} {showQuery ? 'Close' : 'Query'}
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <Plus size={14} /> Add Doc
                    </button>
                  </div>
                </div>

                {showQuery && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>MongoDB Query Filter</label>
                    <textarea
                      className="form-control"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      rows={3}
                      style={{ fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
                    />
                    <button className="btn btn-accent btn-sm" style={{ marginTop: 8 }} onClick={handleRunQuery}>
                      ▶ Run Query
                    </button>
                  </div>
                )}

                <div className="search-bar" style={{ marginBottom: 16 }}>
                  <Search size={15} />
                  <input placeholder={`Search in ${activeCol}...`} value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {docs.map((doc, i) => (
                    <div key={i} style={{
                      fontFamily: 'monospace', fontSize: 12,
                      background: 'var(--sidebar-bg)',
                      color: '#e2e8f0',
                      borderRadius: 10, padding: '14px 16px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      position: 'relative',
                    }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {JSON.stringify(doc, null, 2)}
                      </pre>
                      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                        <button className="btn btn-xs" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
                          onClick={() => toast.success('Edit mode coming soon!')}>
                          <Edit2 size={10} />
                        </button>
                        <button className="btn btn-xs" style={{ background: 'rgba(240,82,82,0.15)', color: '#f87171', border: '1px solid rgba(240,82,82,0.3)' }}
                          onClick={() => toast.success('Document deleted!')}>
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {docs.length === 0 && (
                    <div className="empty-state" style={{ padding: 40 }}>
                      <div className="empty-icon">🔍</div>
                      <h4>No results</h4>
                      <p>No documents match your search.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
              <div className="empty-state">
                <div className="empty-icon"><Database size={48} /></div>
                <h4>Select a collection</h4>
                <p>Click on a collection on the left to browse documents.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Monitor, Server, Cpu, HardDrive, Wifi, AlertCircle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateData = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      t: `T-${20 - i}`,
      cpu: Math.floor(Math.random() * 40 + 20),
      memory: Math.floor(Math.random() * 30 + 45),
      requests: Math.floor(Math.random() * 100 + 50),
    });
  }
  return data;
};

export default function Monitoring() {
  const [data, setData] = useState(generateData());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setData(prev => {
        const d = [...prev.slice(1), {
          t: 'now',
          cpu: Math.floor(Math.random() * 40 + 20),
          memory: Math.floor(Math.random() * 30 + 45),
          requests: Math.floor(Math.random() * 100 + 50),
        }];
        return d;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1];

  const SERVICES = [
    { name: 'Web Server (Node.js)', status: 'running', uptime: '14d 3h', port: 5000 },
    { name: 'MongoDB Database',      status: 'running', uptime: '14d 3h', port: 27017 },
    { name: 'Redis Cache',           status: 'running', uptime: '14d 3h', port: 6379 },
    { name: 'Email Service (SMTP)',  status: 'stopped', uptime: '—',      port: 587 },
  ];

  const LOGS = [
    { level: 'info',  msg: 'User admin@portal.com logged in',        time: '10:32:04' },
    { level: 'info',  msg: 'Marks uploaded by teacher Dr. Verma',    time: '10:25:11' },
    { level: 'warn',  msg: 'Failed login attempt from 192.168.1.12', time: '10:18:45' },
    { level: 'info',  msg: 'New user registered: Ravi Sharma',       time: '10:10:00' },
    { level: 'error', msg: 'SMTP service connection timeout',         time: '09:55:22' },
    { level: 'info',  msg: 'Database backup completed successfully',  time: '09:00:00' },
  ];

  return (
    <div className="page-enter">
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h3>System Monitoring</h3>
            <p>Real-time server and application health</p>
          </div>
          <div className="page-header-actions">
            <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--warm-1)', padding: '6px 12px', borderRadius: 20, border: '1.5px solid var(--card-border)' }}>
              🟢 Live · {time.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="stat-grid" style={{ marginBottom: 24 }}>
          {[
            { icon: <Cpu size={22} color="#6c63ff" />, label: 'CPU Usage', value: `${latest.cpu}%`, cls: 'violet',  bar: latest.cpu },
            { icon: <Server size={22} color="#0d9488" />, label: 'Memory', value: `${latest.memory}%`, cls: 'teal', bar: latest.memory },
            { icon: <Wifi size={22} color="#e07c54" />, label: 'Requests/min', value: latest.requests, cls: 'coral',  bar: null },
            { icon: <HardDrive size={22} color="#34c77b" />, label: 'Disk Usage', value: '42%', cls: 'green', bar: 42 },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                {s.bar !== null && (
                  <div className="marks-bar" style={{ marginTop: 8 }}>
                    <div className={`marks-bar-fill ${s.bar > 80 ? 'danger' : s.bar > 60 ? 'warning' : ''}`} style={{ width: `${s.bar}%` }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {[
            { key: 'cpu', label: 'CPU Usage (%)', color: '#6c63ff' },
            { key: 'requests', label: 'Requests/min', color: '#e07c54' },
          ].map(chart => (
            <div key={chart.key} className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>{chart.label}</div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id={`g-${chart.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chart.color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={chart.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                  <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--text-dim)' }} />
                  <YAxis tick={{ fontSize: 9, fill: 'var(--text-dim)' }} />
                  <Tooltip contentStyle={{ fontSize: 12, background: 'white', border: '1.5px solid var(--card-border)', borderRadius: 8 }} />
                  <Area type="monotone" dataKey={chart.key} stroke={chart.color} fill={`url(#g-${chart.key})`} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>🔧 Service Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SERVICES.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 'var(--radius)', background: 'var(--warm-1)', border: '1.5px solid var(--card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.status === 'running' ? 'var(--success)' : 'var(--danger)', boxShadow: `0 0 8px ${s.status === 'running' ? 'var(--success)' : 'var(--danger)'}` }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Port: {s.port} · Uptime: {s.uptime}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className={`badge ${s.status === 'running' ? 'badge-approved' : 'badge-rejected'}`}>
                    {s.status === 'running' ? <><CheckCircle size={10} /> Running</> : <><AlertCircle size={10} /> Stopped</>}
                  </span>
                  {s.status === 'stopped' && <button className="btn btn-success btn-xs">Start</button>}
                  {s.status === 'running' && <button className="btn btn-danger btn-xs">Stop</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>📋 Recent Logs</div>
          <div style={{ fontFamily: 'monospace', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {LOGS.map((log, i) => (
              <div key={i} style={{
                padding: '8px 14px', borderRadius: 8, display: 'flex', gap: 14, alignItems: 'flex-start',
                background: log.level === 'error' ? 'rgba(240,82,82,0.07)' : log.level === 'warn' ? 'rgba(245,158,11,0.07)' : 'var(--warm-1)',
                border: `1px solid ${log.level === 'error' ? 'rgba(240,82,82,0.2)' : log.level === 'warn' ? 'rgba(245,158,11,0.2)' : 'var(--card-border)'}`,
              }}>
                <span style={{ color: 'var(--text-dim)', flexShrink: 0 }}>{log.time}</span>
                <span style={{ color: log.level === 'error' ? 'var(--danger)' : log.level === 'warn' ? 'var(--warning)' : 'var(--success)', fontWeight: 700, width: 40, flexShrink: 0 }}>[{log.level.toUpperCase()}]</span>
                <span style={{ color: 'var(--text)' }}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

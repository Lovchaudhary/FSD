import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, Ticket, FileText, Settings,
  LogOut, Users, BarChart2, ClipboardList, Upload, MessageSquare,
  Bell, ChevronDown, User, Palette, Calendar, Award,
  Clock, CreditCard, RotateCcw, FileSearch, GraduationCap,
  ShieldCheck, Database, Monitor, Menu, X, Home, TrendingUp,
  CheckSquare, Info
} from 'lucide-react';

const THEMES = [
  { name: 'default', label: 'Warm Coral', color: '#e07c54' },
  { name: 'theme-violet', label: 'Violet', color: '#6c63ff' },
  { name: 'theme-rose', label: 'Rose', color: '#f43f5e' },
  { name: 'theme-teal', label: 'Teal', color: '#0d9488' },
  { name: 'theme-amber', label: 'Amber', color: '#d97706' },
];

const NAV = {
  student: [
    { to: '/student',             icon: LayoutDashboard, label: 'Dashboard',   section: 'Overview' },
    { to: '/student/profile',     icon: User,            label: 'My Profile',  section: 'Overview' },
    { to: '/student/marks',       icon: BarChart2,       label: 'Marks',       section: 'Academics' },
    { to: '/student/results',     icon: Award,           label: 'Results',     section: 'Academics' },
    { to: '/student/admit-card',  icon: FileSearch,      label: 'Admit Card',  section: 'Academics' },
    { to: '/student/timetable',   icon: Clock,           label: 'Timetable',   section: 'Academics' },
    { to: '/student/attendance',  icon: CheckSquare,     label: 'Attendance',  section: 'Academics' },
    { to: '/student/forms',       icon: FileText,        label: 'Exam Forms',  section: 'Exam' },
    { to: '/student/fees',        icon: CreditCard,      label: 'Fees',        section: 'Exam' },
    { to: '/student/revaluation', icon: RotateCcw,       label: 'Revaluation', section: 'Exam' },
    { to: '/student/backpaper',   icon: BookOpen,        label: 'Back Paper',  section: 'Exam' },
    { to: '/student/tickets',     icon: Ticket,          label: 'Tickets',     section: 'Support' },
    { to: '/student/settings',    icon: Settings,        label: 'Settings',    section: 'Support' },
  ],
  teacher: [
    { to: '/teacher',            icon: LayoutDashboard, label: 'Dashboard',     section: 'Overview' },
    { to: '/teacher/profile',    icon: User,            label: 'My Profile',    section: 'Overview' },
    { to: '/teacher/marks',      icon: Upload,          label: 'Upload Marks',  section: 'Teaching' },
    { to: '/teacher/evaluation', icon: ClipboardList,   label: 'Evaluation',    section: 'Teaching' },
    { to: '/teacher/answersheet',icon: FileSearch,      label: 'Answer Sheets', section: 'Teaching' },
    { to: '/teacher/timetable',  icon: Clock,           label: 'Timetable',     section: 'Teaching' },
    { to: '/teacher/tickets',    icon: MessageSquare,   label: 'Tickets',       section: 'Support' },
    { to: '/teacher/settings',   icon: Settings,        label: 'Settings',      section: 'Support' },
  ],
  admin: [
    { to: '/admin',             icon: LayoutDashboard, label: 'Dashboard',      section: 'Overview' },
    { to: '/admin/users',       icon: Users,           label: 'User Mgmt',      section: 'Management' },
    { to: '/admin/marks',       icon: BookOpen,        label: 'Marks Control',  section: 'Management' },
    { to: '/admin/forms',       icon: ClipboardList,   label: 'Exam Forms',     section: 'Management' },

    { to: '/admin/fees',        icon: CreditCard,      label: 'Fees',           section: 'Management' },
    { to: '/admin/tickets',     icon: Ticket,          label: 'Tickets',        section: 'Support' },
    { to: '/admin/monitoring',  icon: Monitor,         label: 'Monitoring',     section: 'System' },
    { to: '/admin/database',    icon: Database,        label: 'Database',       section: 'System' },
    { to: '/admin/settings',    icon: ShieldCheck,     label: 'System Config',  section: 'System' },
  ],
};

const NOTIFICATIONS = [
  { icon: '📋', msg: 'Exam form submission deadline: Apr 15', time: '2h ago', bg: '#fff3ef' },
  { icon: '📊', msg: 'Results for Semester 4 published', time: '1d ago', bg: '#f0fdf4' },
  { icon: '🎫', msg: 'Your ticket #T004 was resolved', time: '2d ago', bg: '#eff6ff' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV[user?.role] || [];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'default');

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const body = document.documentElement;
    THEMES.forEach(t => body.classList.remove(t.name));
    if (theme !== 'default') body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  // Group nav links by section
  const sections = [];
  links.forEach(link => {
    const existing = sections.find(s => s.title === link.section);
    if (existing) existing.items.push(link);
    else sections.push({ title: link.section, items: [link] });
  });

  const avatarSrc = user?.avatar || null;

  const roleLabel = user?.role === 'student' ? '🎒 Student'
    : user?.role === 'teacher' ? '👨‍🏫 Teacher'
    : '⚙️ Admin';

  return (
    <div className="app-layout">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ display: 'block' }}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">🎓</div>
          <div>
            <h2>ExamCell</h2>
            <span>Management System</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'none' }}
            className="sidebar-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sections.map(({ title, items }) => (
            <div key={title}>
              <div className="nav-section-title">{title}</div>
              {items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to.split('/').length <= 2}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={17} />
                  {label}
                  <span className="nav-indicator" />
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info-sidebar" onClick={() => navigate(`/${user?.role}/profile`)}>
            <div className="user-avatar">
              {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : initials}
            </div>
            <div className="user-info-text">
              <div className="name">{user?.name || 'User'}</div>
              <span className="role-badge">{roleLabel}</span>
            </div>
          </div>
          <button className="nav-link" onClick={handleLogout} style={{ color: '#f87171' }}>
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              className="topbar-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }}
              id="sidebar-toggle"
            >
              <Menu size={18} />
            </button>
            <div className="topbar-left">
              <h2>{getPageTitle(user?.role)}</h2>
              <p>Welcome back, {getFirstName(user?.name)}! 👋</p>
            </div>
          </div>

          <div className="topbar-right">
            {/* Theme Picker */}
            <div style={{ position: 'relative' }}>
              <div className="theme-picker" style={{ display: 'flex', gap: 6 }}>
                {THEMES.map(t => (
                  <div
                    key={t.name}
                    className={`theme-swatch ${theme === t.name ? 'active' : ''}`}
                    style={{ background: t.color, width: 22, height: 22 }}
                    title={t.label}
                    onClick={() => setTheme(t.name)}
                  />
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button className="topbar-btn" onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}>
                <Bell size={17} />
                <span className="notif-dot" />
              </button>
              {showNotif && (
                <div className="notif-panel">
                  <div className="notif-panel-header">
                    <span>Notifications</span>
                    <span style={{ fontSize: 11, color: '#e07c54', fontWeight: 700, cursor: 'pointer' }}>Mark all read</span>
                  </div>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className="notif-item">
                      <div className="notif-icon" style={{ background: n.bg }}>{n.icon}</div>
                      <div>
                        <div className="notif-text">{n.msg}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button className="profile-btn" onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}>
                <div className="avatar-sm">
                  {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : initials}
                </div>
                <span>{getFirstName(user?.name)}</span>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </button>
              {showProfile && (
                <div className="dropdown-menu">
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--card-border)' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{user?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
                  </div>
                  <Link to={`/${user?.role}/profile`} onClick={() => setShowProfile(false)}>
                    <User size={15} /> My Profile
                  </Link>
                  <Link to={`/${user?.role}/settings`} onClick={() => setShowProfile(false)}>
                    <Settings size={15} /> Settings
                  </Link>
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-toggle { display: flex !important; }
          .sidebar-close-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}

function getPageTitle(role) {
  if (role === 'student') return 'Student Portal';
  if (role === 'teacher') return 'Teacher Portal';
  if (role === 'admin')   return 'Admin Panel';
  return 'ExamCell';
}

const HONORIFICS = new Set(['prof.', 'dr.', 'mr.', 'mrs.', 'ms.', 'sir', 'prof', 'dr']);
function getFirstName(fullName) {
  if (!fullName) return 'there';
  const parts = fullName.trim().split(' ');
  // Skip any leading honorifics
  const first = parts.find(p => !HONORIFICS.has(p.toLowerCase()));
  return first || parts[parts.length - 1] || 'there';
}

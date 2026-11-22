import { useMemo, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Home from '../pages/Home';
import { notifications, teacherProfile } from './mockData';
import './teacher.css';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'classes', label: 'Classes' },
  { key: 'gradebook', label: 'Gradebook' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'quizzes', label: 'Quiz Manager' },
  { key: 'concerns', label: 'Grade Concerns' },
  { key: 'reports', label: 'Reports' },
  { key: 'manage-records', label: 'Manage Records' },
];

function Icon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };
  switch (name) {
    case 'dashboard':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      );
    case 'classes':
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'gradebook':
      return (
        <svg {...common}>
          <path d="M3 4h18v16H3z" />
          <path d="M7 8h10M7 12h6M7 16h8" />
        </svg>
      );
    case 'attendance':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M8 2v4M16 2v4M3 10h18" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      );
    case 'quizzes':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    case 'concerns':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v5" />
          <path d="M12 16h.01" />
        </svg>
      );
    case 'reports':
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case 'manage-records':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    default:
      return null;
  }
}

function getInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'T';
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

function ComingSoon({ title }) {
  return (
    <div className="tp-empty" role="region" aria-label={`${title} coming soon`}>
      <h2 className="tp-empty-title">{title}</h2>
      <p className="tp-empty-text">Coming soon. This section will be available in a future update.</p>
    </div>
  );
}

function TeacherApp({ user, onLogout }) {
  const [activeKey, setActiveKey] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = user?.fullname || user?.name || user?.username || teacherProfile.name;
  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, []);
  const activeItem = NAV_ITEMS.find((item) => item.key === activeKey) || NAV_ITEMS[0];

  const handleNav = (key) => {
    setActiveKey(key);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    if (typeof onLogout === 'function') onLogout();
  };

  return (
    <div className="teacher-portal">
      <aside className={`tp-sidebar ${sidebarOpen ? 'tp-open' : ''}`} aria-label="Teacher sidebar">
        <div className="tp-brand">
          <span className="tp-brand-mark">G</span>
          <span>Teacher</span>
        </div>
        <nav className="tp-nav" aria-label="Teacher navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`tp-nav-btn ${activeKey === item.key ? 'tp-active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              <span className="tp-nav-icon">
                <Icon name={item.key} />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
          <button type="button" className="tp-nav-btn tp-logout" onClick={handleLogout}>
            <span className="tp-nav-icon">
              <Icon name="logout" />
            </span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <div
        className={`tp-overlay ${sidebarOpen ? 'tp-show' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="tp-main">
        <header className="tp-topbar">
          <div className="tp-topbar-left">
            <button
              type="button"
              className="tp-menu-btn"
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <Icon name="menu" />
            </button>
            <div className="tp-search">
              <span className="tp-search-icon">
                <Icon name="search" />
              </span>
              <input
                className="tp-search-input"
                type="search"
                placeholder="Search students, classes, concerns..."
                aria-label="Search"
              />
            </div>
          </div>
          <div className="tp-topbar-right">
            <button
              type="button"
              className="tp-icon-btn"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Icon name="bell" />
              {unreadCount > 0 && <span className="tp-badge">{unreadCount}</span>}
            </button>
            <div className="tp-user">
              <div className="tp-avatar" aria-hidden="true">
                {getInitials(displayName)}
              </div>
              <div className="tp-user-meta">
                <span className="tp-user-name">{displayName}</span>
                <span className="tp-user-role">Teacher</span>
              </div>
            </div>
          </div>
        </header>

        <main className="tp-content">
          {activeKey === 'dashboard' ? (
            <Dashboard user={user} />
          ) : activeKey === 'manage-records' ? (
            <div className="tp-manage-records">
              <Home user={user} onLogout={onLogout} />
            </div>
          ) : (
            <ComingSoon title={activeItem.label} />
          )}
        </main>
      </div>
    </div>
  );
}

export default TeacherApp;

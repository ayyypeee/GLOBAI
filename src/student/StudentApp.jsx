import { useMemo, useState } from 'react';
import Dashboard from './pages/Dashboard';
import { notifications, studentProfile } from './mockData';
import './student.css';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'grades', label: 'My Grades' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'quizzes', label: 'Quizzes' },
  { key: 'concerns', label: 'Grade Concerns' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'reports', label: 'Reports' },
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
    case 'grades':
      return (
        <svg {...common}>
          <path d="M4 19.5V5a2 2 0 0 1 2-2h11" />
          <path d="M20 7v14l-4-2-4 2V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z" />
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
    case 'notifications':
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case 'reports':
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
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
  if (parts.length === 0) return 'S';
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

function ComingSoon({ title }) {
  return (
    <div className="sp-empty" role="region" aria-label={`${title} coming soon`}>
      <h2 className="sp-empty-title">{title}</h2>
      <p className="sp-empty-text">Coming soon. This section will be available in a future update.</p>
    </div>
  );
}

function StudentApp({ user, onLogout }) {
  const [activeKey, setActiveKey] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = user?.fullname || user?.name || user?.username || studentProfile.name;
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
    <div className="student-portal">
      <aside className={`sp-sidebar ${sidebarOpen ? 'sp-open' : ''}`} aria-label="Student sidebar">
        <div className="sp-brand">
          <span className="sp-brand-mark">G</span>
          <span>GLOBAI Student</span>
        </div>
        <nav className="sp-nav" aria-label="Student navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`sp-nav-btn ${activeKey === item.key ? 'sp-active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              <span className="sp-nav-icon">
                <Icon name={item.key} />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
          <button type="button" className="sp-nav-btn sp-logout" onClick={handleLogout}>
            <span className="sp-nav-icon">
              <Icon name="logout" />
            </span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <div
        className={`sp-overlay ${sidebarOpen ? 'sp-show' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="sp-main">
        <header className="sp-topbar">
          <div className="sp-topbar-left">
            <button
              type="button"
              className="sp-menu-btn"
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <Icon name="menu" />
            </button>
            <div className="sp-search">
              <span className="sp-search-icon">
                <Icon name="search" />
              </span>
              <input
                className="sp-search-input"
                type="search"
                placeholder="Search subjects, quizzes, notifications..."
                aria-label="Search"
              />
            </div>
          </div>
          <div className="sp-topbar-right">
            <button
              type="button"
              className="sp-icon-btn"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Icon name="bell" />
              {unreadCount > 0 && <span className="sp-badge">{unreadCount}</span>}
            </button>
            <div className="sp-user">
              <div className="sp-avatar" aria-hidden="true">
                {getInitials(displayName)}
              </div>
              <div className="sp-user-meta">
                <span className="sp-user-name">{displayName}</span>
                <span className="sp-user-role">Student</span>
              </div>
            </div>
          </div>
        </header>

        <main className="sp-content">
          {activeKey === 'dashboard' ? <Dashboard user={user} /> : <ComingSoon title={activeItem.label} />}
        </main>
      </div>
    </div>
  );
}

export default StudentApp;

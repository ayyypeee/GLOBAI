import { useState } from 'react'
import './student.css'
import Dashboard from './pages/Dashboard'

const ICONS = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h4" />
    </>
  ),
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 3 3 5-6" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
}

function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  )
}

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'grades', label: 'My Grades', icon: 'book' },
  { key: 'attendance', label: 'Attendance', icon: 'calendar' },
  { key: 'quizzes', label: 'Quizzes', icon: 'file' },
  { key: 'concerns', label: 'Grade Concerns', icon: 'message' },
  { key: 'notifications', label: 'Notifications', icon: 'bell' },
  { key: 'reports', label: 'Reports', icon: 'chart' },
]

function ComingSoon({ title }) {
  return (
    <div className="sp-page">
      <div className="sp-card sp-soon">
        <div className="sp-soon-icon">
          <Icon name="grid" size={26} />
        </div>
        <h2 className="sp-soon-title">{title}</h2>
        <p className="sp-soon-text">This page is coming soon.</p>
      </div>
    </div>
  )
}

function StudentApp({ user, onLogout }) {
  const [active, setActive] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const fullName = user?.fullname || user?.username || 'Student'
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  const unread = 0
  const current = NAV.find((n) => n.key === active)

  const go = (key) => {
    setActive(key)
    setMenuOpen(false)
  }

  return (
    <div className="student-portal">
      <div className={menuOpen ? 'sp-overlay show' : 'sp-overlay'} onClick={() => setMenuOpen(false)} />

      <aside className={menuOpen ? 'sp-sidebar open' : 'sp-sidebar'}>
        <div className="sp-brand">
          <span className="sp-brand-mark">G</span>
          <div>
            Teacher
            <small>Student Portal</small>
          </div>
        </div>

        <nav className="sp-nav">
          {NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              className={active === item.key ? 'sp-nav-btn active' : 'sp-nav-btn'}
              onClick={() => go(item.key)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.key === 'notifications' && unread > 0 && <em className="sp-nav-badge">{unread}</em>}
            </button>
          ))}
        </nav>

        <button type="button" className="sp-nav-btn sp-logout" onClick={onLogout}>
          <Icon name="logout" />
          <span>Logout</span>
        </button>
      </aside>

      <div className="sp-main">
        <header className="sp-topbar">
          <button type="button" className="sp-menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Icon name="menu" size={20} />
          </button>

          <div className="sp-search">
            <Icon name="search" size={16} />
            <input
              type="text"
              value={search}
              placeholder="Search subjects, quizzes, notifications..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sp-top-right">
            <button
              type="button"
              className="sp-icon-btn"
              aria-label="Notifications"
              onClick={() => go('notifications')}
            >
              <Icon name="bell" size={19} />
              {unread > 0 && <span className="sp-bell-badge">{unread}</span>}
            </button>

            <div className="sp-profile">
              <span className="sp-avatar">{initials || 'S'}</span>
              <div className="sp-profile-text">
                <strong>{fullName}</strong>
                <span>Student</span>
              </div>
            </div>
          </div>
        </header>

        <main className="sp-content">
          {active === 'dashboard' ? (
            <Dashboard user={user} onNavigate={go} />
          ) : (
            <ComingSoon title={current ? current.label : 'Page'} />
          )}
        </main>
      </div>
    </div>
  )
}

export default StudentApp
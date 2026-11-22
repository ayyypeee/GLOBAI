import { useState } from 'react'
import './teacher.css'
import Dashboard from './pages/Dashboard'
import Home from '../pages/Home'
import { notificationCount } from './mockData'

const ICONS = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  table: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18m-12 6 2 2 4-4" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h4" />
    </>
  ),
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 3 3 5-6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
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
  { key: 'classes', label: 'Classes', icon: 'users' },
  { key: 'gradebook', label: 'Gradebook', icon: 'table' },
  { key: 'attendance', label: 'Attendance', icon: 'calendar' },
  { key: 'quizzes', label: 'Quiz Manager', icon: 'file' },
  { key: 'concerns', label: 'Grade Concerns', icon: 'message' },
  { key: 'reports', label: 'Reports', icon: 'chart' },
  { key: 'records', label: 'Manage Records', icon: 'database' },
]

function ComingSoon({ title }) {
  return (
    <div className="tp-page">
      <div className="tp-card tp-soon">
        <div className="tp-soon-icon">
          <Icon name="grid" size={26} />
        </div>
        <h2 className="tp-soon-title">{title}</h2>
        <p className="tp-soon-text">This page is coming soon.</p>
      </div>
    </div>
  )
}

function TeacherApp({ user, onLogout }) {
  const [active, setActive] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const fullName = user?.fullname || user?.username || 'Teacher'
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  const current = NAV.find((n) => n.key === active)

  const go = (key) => {
    setActive(key)
    setMenuOpen(false)
  }

  let page
  if (active === 'dashboard') {
    page = <Dashboard user={user} onNavigate={go} />
  } else if (active === 'records') {
    // the original teacher CRUD page, unchanged
    page = (
      <div className="tp-page tp-records">
        <Home user={user} onLogout={onLogout} />
      </div>
    )
  } else {
    page = <ComingSoon title={current ? current.label : 'Page'} />
  }

  return (
    <div className="teacher-portal">
      <div className={menuOpen ? 'tp-overlay show' : 'tp-overlay'} onClick={() => setMenuOpen(false)} />

      <aside className={menuOpen ? 'tp-sidebar open' : 'tp-sidebar'}>
        <div className="tp-brand">
          <span className="tp-brand-mark">G</span>
          <div>
            GLOBAI
            <small>Teacher Portal</small>
          </div>
        </div>

        <nav className="tp-nav">
          {NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              className={active === item.key ? 'tp-nav-btn active' : 'tp-nav-btn'}
              onClick={() => go(item.key)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button type="button" className="tp-nav-btn tp-logout" onClick={onLogout}>
          <Icon name="logout" />
          <span>Logout</span>
        </button>
      </aside>

      <div className="tp-main">
        <header className="tp-topbar">
          <button type="button" className="tp-menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Icon name="menu" size={20} />
          </button>

          <div className="tp-search">
            <Icon name="search" size={16} />
            <input
              type="text"
              value={search}
              placeholder="Search students, classes, concerns..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="tp-top-right">
            <button
              type="button"
              className="tp-icon-btn"
              aria-label="Grade concerns"
              onClick={() => go('concerns')}
            >
              <Icon name="bell" size={19} />
              {notificationCount > 0 && <span className="tp-bell-badge">{notificationCount}</span>}
            </button>

            <div className="tp-profile">
              <span className="tp-avatar">{initials || 'T'}</span>
              <div className="tp-profile-text">
                <strong>{fullName}</strong>
                <span>Teacher</span>
              </div>
            </div>
          </div>
        </header>

        <main className="tp-content">{page}</main>
      </div>
    </div>
  )
}

export default TeacherApp
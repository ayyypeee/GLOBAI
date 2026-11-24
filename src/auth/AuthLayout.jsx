const svgProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function UserIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  )
}

export function MailIcon() {
  return (
    <svg {...svgProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export function LockIcon() {
  return (
    <svg {...svgProps}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

export function EyeIcon({ open }) {
  return (
    <svg {...svgProps}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M3 3l18 18" />}
    </svg>
  )
}

export function AlertIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.01" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.8 2.8L16 9.5" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19V5M9 8h6" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg {...svgProps}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18M9 15l2 2 4-4" />
    </svg>
  )
}

function QuizIcon() {
  return (
    <svg {...svgProps}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  )
}

export function BrandMark({ size = 44 }) {
  return (
    <span className="au-logo" style={{ width: size, height: size }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 32 32" fill="none">
        <path d="M16 3 3 10l13 7 13-7z" fill="#60A5FA" />
        <circle cx="16" cy="21" r="6" fill="#38BDF8" />
      </svg>
    </span>
  )
}

const DEFAULT_ROLES = ['Student', 'Teacher']

export function RoleToggle({ role, onChange, roles = DEFAULT_ROLES }) {
  const index = roles.indexOf(role)
  return (
    <div className="au-seg" role="tablist" style={{ gridTemplateColumns: `repeat(${roles.length}, 1fr)` }}>
      <span
        className="au-seg-pill"
        style={{
          width: `calc((100% - 8px) / ${roles.length})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {roles.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={role === item}
          className={role === item ? 'au-seg-btn active' : 'au-seg-btn'}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export function AuthField({ label, icon, type, value, placeholder, onChange, trailing, autoComplete }) {
  return (
    <div className="au-field">
      <label className="au-label">{label}</label>
      <div className="au-input-wrap">
        <span className="au-input-icon">{icon}</span>
        <input
          className="au-input"
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
        {trailing && <span className="au-input-trailing">{trailing}</span>}
      </div>
    </div>
  )
}

function AuthLayout({ children }) {
  return (
    <div className="auth-portal au-shell">
      <aside className="au-left">
        <div className="au-blob au-blob-1" />
        <div className="au-blob au-blob-2" />
        <div className="au-blob au-blob-3" />
        <div className="au-grid-overlay" />

        <div className="au-left-inner">
          <div className="au-brand">
            <BrandMark />
            <span>Academiko</span>
          </div>

          <div className="au-hero">
            <h2 className="au-tagline">
              Grades, attendance, and quizzes <span className="au-grad-text">in one place</span>
            </h2>

            <ul className="au-features">
              <li>
                <span className="au-chip"><BookIcon /></span>
                <div>
                  <strong>Track grades with clarity</strong>
                  <p>Partial grades and trends, updated in real time.</p>
                </div>
              </li>
              <li>
                <span className="au-chip"><CalendarIcon /></span>
                <div>
                  <strong>Stay on top of attendance</strong>
                  <p>Presence, late records, and rates at a glance.</p>
                </div>
              </li>
              <li>
                <span className="au-chip"><QuizIcon /></span>
                <div>
                  <strong>Never miss a quiz</strong>
                  <p>Upcoming quizzes and reminders, organized.</p>
                </div>
              </li>
            </ul>

            <div className="au-glass" aria-hidden="true">
              <span className="au-glass-head">Get started in 3 steps</span>
              <ol className="au-steps">
                <li>
                  <span className="au-step-num">1</span>
                  <div>
                    <strong>Create your account</strong>
                    <p>Register with your name, username, and email.</p>
                  </div>
                </li>
                <li>
                  <span className="au-step-num">2</span>
                  <div>
                    <strong>Choose your role</strong>
                    <p>Pick your role to open your portal.</p>
                  </div>
                </li>
                <li>
                  <span className="au-step-num">3</span>
                  <div>
                    <strong>Sign in and go</strong>
                    <p>See your dashboard as soon as you log in.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <p className="au-copy">© Academiko · GLOBAI</p>
        </div>
      </aside>

      <main className="au-right">
        <div className="au-mobile-brand">
          <BrandMark size={36} />
          <span>Academiko</span>
        </div>
        {children}
      </main>
    </div>
  )
}

export default AuthLayout
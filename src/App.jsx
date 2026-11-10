import { useState } from 'react'
import './App.css'
import { login, requestAccount, forgotPassword, resetPassword } from './api'
import StudentDashboard from './pages/StudentDashboard'
import StaffDashboard from './pages/StaffDashboard'
import AdminDashboard from './pages/AdminDashboard'

const ROLES = ['Student', 'Staff']

function StudentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
    </svg>
  )
}

function StaffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z" />
      <path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function EyeIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M3 3l18 18" />}
    </svg>
  )
}

function RoleTabs({ role, onChange, roles = ROLES }) {
  const icons = {
    Student: <StudentIcon />,
    Staff: <StaffIcon />,
  }

  return (
    <div
      className="role-tabs"
      style={{ gridTemplateColumns: `repeat(${roles.length}, 1fr)` }}
    >
      {roles.map((item) => (
        <button
          key={item}
          type="button"
          className={role === item ? 'role-tab active' : 'role-tab'}
          onClick={() => onChange(item)}
        >
          {icons[item]}
          <span>{item}</span>
        </button>
      ))}
    </div>
  )
}

function InputField({ label, icon, type, value, placeholder, onChange, trailing }) {
  return (
    <div className="field">
      <div className="field-label-row">
        <label>{label}</label>
      </div>
      <div className="input-wrap">
        <span className="input-icon">{icon}</span>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {trailing}
      </div>
    </div>
  )
}

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="login-card">
        <h1>FORGOT PASSWORD</h1>

        {sent ? (
          <>
            <p className="success-msg">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
            </p>
            <button type="button" className="submit-btn" onClick={onBack}>
              Back to login
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <InputField
              label="Email address"
              icon={<MailIcon />}
              type="email"
              value={email}
              placeholder="Enter your school email"
              onChange={setEmail}
            />

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

            <p className="footer-text">
              <a
                href="#"
                className="link"
                onClick={(e) => {
                  e.preventDefault()
                  onBack()
                }}
              >
                Back to login
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function ResetPassword({ onBack }) {
  // The token comes from the link: http://localhost:5173/?reset=<token>
  const token = new URLSearchParams(window.location.search).get('reset') || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await resetPassword(token, newPassword)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="login-card">
        <h1>NEW PASSWORD</h1>

        {done ? (
          <>
            <p className="success-msg">
              Your password has been updated. You can now log in.
            </p>
            <button type="button" className="submit-btn" onClick={onBack}>
              Back to login
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <InputField
              label="New password"
              icon={<LockIcon />}
              type="password"
              value={newPassword}
              placeholder="At least 6 characters"
              onChange={setNewPassword}
            />
            <InputField
              label="Confirm new password"
              icon={<LockIcon />}
              type="password"
              value={confirm}
              placeholder="Re-enter your new password"
              onChange={setConfirm}
            />

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function RequestAccount({ onBack }) {
  const [role, setRole] = useState('Student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await requestAccount({ password, name, email, role, studentId })
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="login-card">
        <h1>CONTACT ADMIN</h1>

        {done ? (
          <>
            <p className="success-msg">
              Request sent! Once the admin approves <strong>{email}</strong>,
              you can log in as {role}.
            </p>
            <button type="button" className="submit-btn" onClick={onBack}>
              Back to login
            </button>
          </>
        ) : (
          <>
            <p className="contact-note">
              Accounts are created by the admin. Send your school email and the
              password you want to use. You can log in after the admin approves your request.
            </p>
            <RoleTabs role={role} onChange={setRole} />
            <form onSubmit={handleSubmit}>
              <InputField label="Full name" icon={<UserIcon />} type="text"
                value={name} placeholder="Enter your full name" onChange={setName} />
              <InputField label="School email" icon={<MailIcon />} type="email"
                value={email} placeholder="Enter your school email" onChange={setEmail} />
              {role === 'Student' && (
                <InputField label="Student ID" icon={<UserIcon />} type="text"
                  value={studentId} placeholder="e.g. 240730586" onChange={setStudentId} />
              )}
              <InputField label="Password" icon={<LockIcon />} type="password"
                value={password} placeholder="At least 6 characters" onChange={setPassword} />
              <InputField label="Confirm password" icon={<LockIcon />} type="password"
                value={confirm} placeholder="Re-enter your password" onChange={setConfirm} />

              {error && <p className="error-msg">{error}</p>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Sending request...' : `Send request as ${role}`}
              </button>

              <p className="footer-text">
                Already have an approved account?{' '}
                <a href="#" className="link" onClick={(e) => { e.preventDefault(); onBack() }}>
                  Back to login
                </a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function App() {
  const [role, setRole] = useState('Student')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  // Open on the reset screen when the page was opened from an emailed link (?reset=<token>)
  const [view, setView] = useState(() =>
    new URLSearchParams(window.location.search).get('reset') ? 'reset' : 'login'
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(username, password)
      // The Staff tab is for teachers (STAFF) and for the admin (ADMIN)
      const allowed = role === 'Student' ? ['STUDENT'] : ['STAFF', 'ADMIN']
      if (!allowed.includes(result.role)) {
        throw new Error(`This is not a ${role.toLowerCase()} account`)
      }
      setUser(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setPassword('')
  }

  if (user) {
    if (user.role === 'ADMIN') {
      return <AdminDashboard user={user} onLogout={handleLogout} />
    }
    return user.role === 'STAFF' ? (
      <StaffDashboard user={user} onLogout={handleLogout} />
    ) : (
      <StudentDashboard user={user} onLogout={handleLogout} />
    )
  }

  if (view === 'forgot') {
    return <ForgotPassword onBack={() => setView('login')} />
  }

  if (view === 'register') {
    return <RequestAccount onBack={() => setView('login')} />
  }

  if (view === 'reset') {
    return (
      <ResetPassword
        onBack={() => {
          // remove ?reset=... from the address bar so a refresh doesn't reopen this screen
          window.history.replaceState({}, '', '/')
          setView('login')
        }}
      />
    )
  }

  return (
    <div className="page">
      <div className="login-card">
        <h1>Hello, WELCOME!</h1>
        <RoleTabs role={role} onChange={setRole} />

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            icon={<MailIcon />}
            type="text"
            value={username}
            placeholder="Enter your email"
            onChange={setUsername}
          />

          <div className="password-group">
            <InputField
              label="Password"
              icon={<LockIcon />}
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Enter your password"
              onChange={setPassword}
              trailing={
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <EyeIcon open={showPassword} />
                </button>
              }
            />
            <a
              href="#"
              className="link small forgot-link"
              onClick={(e) => {
                e.preventDefault()
                setView('forgot')
              }}
            >
              Forgot password?
            </a>
          </div>

          <label className="remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : `Login as ${role}`}
          </button>
        </form>

        <p className="footer-text">
          Don't have an account?{' '}
          <a href="#" className="link" onClick={(e) => { e.preventDefault(); setView('register') }}>
            Contact admin to make an account
          </a>
        </p>
      </div>
    </div>
  )
}

export default App
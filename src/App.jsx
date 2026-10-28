import { useState } from 'react'
import './App.css'

const ROLES = ['Student', 'Teacher']

const DEMO_CREDENTIALS = {
  Student: { email: 'student@school.edu', password: 'student123' },
  Teacher: { email: 'teacher@school.edu', password: 'teacher123' },
}

function StudentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
    </svg>
  )
}

function TeacherIcon() {
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

function RoleTabs({ role, onChange }) {
  const icons = { Student: <StudentIcon />, Teacher: <TeacherIcon /> }

  return (
    <div className="role-tabs">
      {ROLES.map((item) => (
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

function InputField({ label, icon, type, value, placeholder, onChange, trailing, labelRight }) {
  return (
    <div className="field">
      <div className="field-label-row">
        <label>{label}</label>
        {labelRight}
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

function App() {
  const [role, setRole] = useState('Student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS[role].email)
    setPassword(DEMO_CREDENTIALS[role].password)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="page">
      <div className="login-card">
        <h1>WELCOME</h1>
        <RoleTabs role={role} onChange={setRole} />

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email address"
            icon={<MailIcon />}
            type="email"
            value={email}
            placeholder="you@school.edu"
            onChange={setEmail}
          />

          <InputField
            label="Password"
            icon={<LockIcon />}
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="Enter your password"
            onChange={setPassword}
            labelRight={
              <a href="#" className="link small">
                Forgot password?
              </a>
            }
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

          <label className="remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <button type="submit" className="submit-btn">
            Login in as {role}
          </button>

        </form>

        <p className="footer-text">
          Don't have an account?{' '}
          <a href="#" className="link">
            Contact school administrator
          </a>
        </p>
      </div>
    </div>
  )
}

export default App
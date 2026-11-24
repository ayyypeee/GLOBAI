import { useState } from 'react'
import { postNewUser } from '../api'
import AuthLayout, {
  AuthField,
  RoleToggle,
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  AlertIcon,
} from './AuthLayout'

function AuthRegister({ onBack, onRegistered }) {
  const [role, setRole] = useState('Student')
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!fullname.trim() || !username.trim() || !email.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await postNewUser({ username, password, role: role.toUpperCase(), fullname, email })
      onRegistered('Registration successful! You can now log in.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const eye = (
    <button
      type="button"
      className="au-eye"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      onClick={() => setShowPassword(!showPassword)}
    >
      <EyeIcon open={showPassword} />
    </button>
  )

  return (
    <AuthLayout>
      <div className="au-card">
        <h1 className="au-title">Create account</h1>
        <p className="au-subtitle">Register to get started with Academiko</p>

        <RoleToggle role={role} onChange={setRole} />

        <form onSubmit={handleSubmit}>
          <AuthField
            label="Full name"
            icon={<UserIcon />}
            type="text"
            value={fullname}
            placeholder="Enter your full name"
            autoComplete="name"
            onChange={setFullname}
          />
          <AuthField
            label="Username"
            icon={<UserIcon />}
            type="text"
            value={username}
            placeholder="Choose a username"
            autoComplete="username"
            onChange={setUsername}
          />
          <AuthField
            label="Email"
            icon={<MailIcon />}
            type="email"
            value={email}
            placeholder="Enter your email"
            autoComplete="email"
            onChange={setEmail}
          />
          <AuthField
            label="Password"
            icon={<LockIcon />}
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            onChange={setPassword}
            trailing={eye}
          />
          <AuthField
            label="Confirm password"
            icon={<LockIcon />}
            type={showPassword ? 'text' : 'password'}
            value={confirm}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            onChange={setConfirm}
          />

          {error && (
            <div className="au-alert au-alert-error">
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="au-btn" disabled={loading}>
            {loading ? 'Registering...' : `Register as ${role}`}
          </button>
        </form>

        <p className="au-footer-text">
          Already have an account?{' '}
          <a
            href="#"
            className="au-link"
            onClick={(e) => {
              e.preventDefault()
              onBack()
            }}
          >
            Back to login
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}

export default AuthRegister
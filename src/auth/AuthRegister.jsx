import { useState } from 'react'
import { postNewUser } from '../api'
import AuthLayout, {
  AuthField,
  RoleToggle,
  UserIcon,
  MailIcon,
  LockIcon,
  AlertIcon,
} from './AuthLayout'

function AuthRegister({ onBack, onRegistered }) {
  const [role, setRole] = useState('Student')
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      // field names match UserEntity: username, password, role, fullname, email
      await postNewUser({ username, password, role: role.toUpperCase(), fullname, email })
      onRegistered('Registration successful! You can now log in.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="au-card">
        <h1 className="au-title">Create your account</h1>
        <p className="au-subtitle">Join Academiko in less than a minute</p>

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
            type="password"
            value={password}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            onChange={setPassword}
          />
          <AuthField
            label="Confirm password"
            icon={<LockIcon />}
            type="password"
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
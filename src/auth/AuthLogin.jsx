import { useState } from 'react'
import { login } from '../api'
import AuthLayout, {
  AuthField,
  RoleToggle,
  UserIcon,
  LockIcon,
  EyeIcon,
  AlertIcon,
  CheckIcon,
} from './AuthLayout'


function AuthLogin({ notice, onLoginSuccess, onGoRegister }) {
  const [role, setRole] = useState('Student')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(username, password)
      if (user.role !== role.toUpperCase()) {
        throw new Error(`This is not a ${role.toLowerCase()} account.`)
      }
      onLoginSuccess(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="au-card">
        <h1 className="au-title">Welcome back</h1>
        <p className="au-subtitle">Sign in to continue to your portal</p>

        <RoleToggle role={role} onChange={setRole}/>

        {notice && (
          <div className="au-alert au-alert-success">
            <CheckIcon />
            <span>{notice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AuthField
            label="Username"
            icon={<UserIcon />}
            type="text"
            value={username}
            placeholder="Enter your username"
            autoComplete="username"
            onChange={setUsername}
          />
          <AuthField
            label="Password"
            icon={<LockIcon />}
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="Enter your password"
            autoComplete="current-password"
            onChange={setPassword}
            trailing={
              <button
                type="button"
                className="au-eye"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeIcon open={showPassword} />
              </button>
            }
          />

          <div className="au-forgot-row">
            <button type="button" className="au-link" onClick={() => setShowForgot(!showForgot)}>
              Forgot password?
            </button>
          </div>

          {showForgot && (
            <div className="au-alert au-alert-info">
              <span>Please contact your administrator to reset your password.</span>
            </div>
          )}

          {error && (
            <div className="au-alert au-alert-error">
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="au-btn" disabled={loading}>
            {loading ? 'Logging in...' : `Login as ${role}`}
          </button>
        </form>

        <p className="au-footer-text">
          Don't have an account?{' '}
          <a
            href="#"
            className="au-link"
            onClick={(e) => {
              e.preventDefault()
              onGoRegister()
            }}
          >
            Register here
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}

export default AuthLogin
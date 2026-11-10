import { useState } from 'react'
import { login } from '../api'
import { RoleTabs, InputField, UserIcon, LockIcon, EyeIcon } from '../components/Fields'

function Login({ notice, onLoginSuccess, onGoRegister }) {
  const [role, setRole] = useState('Student')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(username, password)
      // the selected tab must match the role saved in the database
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
    <div className="page">
      <div className="login-card">
        <h1>Hello, WELCOME!</h1>
        <RoleTabs role={role} onChange={setRole} />

        {notice && <p className="success-msg">{notice}</p>}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            icon={<UserIcon />}
            type="text"
            value={username}
            placeholder="Enter your username"
            onChange={setUsername}
          />
          <InputField
            label="Password"
            icon={<LockIcon />}
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="Enter your password"
            onChange={setPassword}
            trailing={
              <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                <EyeIcon open={showPassword} />
              </button>
            }
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : `Login as ${role}`}
          </button>
        </form>

        <p className="footer-text">
          Don't have an account?{' '}
          <a href="#" className="link" onClick={(e) => { e.preventDefault(); onGoRegister() }}>
            Register here
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
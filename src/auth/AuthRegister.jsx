import { useState } from 'react'
import { register } from '../api'
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
  const [program, setProgram] = useState('')
  const [yearlevel, setYearlevel] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isStudent = role === 'Student'

  const validate = () => {
    if (!fullname.trim() || !username.trim() || !email.trim()) return 'Please fill in all fields.'
    if (isStudent && !program.trim()) return 'Enter your program.'
    if (isStudent && !(Number(yearlevel) >= 1 && Number(yearlevel) <= 6)) return 'Year level must be from 1 to 6.'
    if (!isStudent && !department.trim()) return 'Enter your department.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    if (password !== confirm) return 'Passwords do not match.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const problem = validate()
    setError(problem)
    if (problem) return
    setLoading(true)
    try {
      await register({
        username: username.trim(),
        password,
        role: role.toUpperCase(),
        fullname: fullname.trim(),
        email: email.trim(),
        program: isStudent ? program.trim() : null,
        yearlevel: isStudent ? Number(yearlevel) : null,
        department: isStudent ? null : department.trim(),
      })
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
          {isStudent ? (
            <>
              <AuthField
                label="Program"
                icon={<UserIcon />}
                type="text"
                value={program}
                placeholder="e.g. BSIT"
                onChange={setProgram}
              />
              <AuthField
                label="Year level"
                icon={<UserIcon />}
                type="number"
                value={yearlevel}
                placeholder="1 to 6"
                onChange={setYearlevel}
              />
            </>
          ) : (
            <AuthField
              label="Department"
              icon={<UserIcon />}
              type="text"
              value={department}
              placeholder="e.g. College of Computer Studies"
              onChange={setDepartment}
            />
          )}
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
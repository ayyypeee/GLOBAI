import { useState } from 'react'
import { postNewUser } from '../api'
import { RoleTabs, InputField, UserIcon, MailIcon, LockIcon } from '../components/Fields'

function Register({ onBack, onRegistered }) {
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
    <div className="page">
      <div className="login-card">
        <h1>REGISTER</h1>
        <RoleTabs role={role} onChange={setRole} />

        <form onSubmit={handleSubmit}>
          <InputField label="Full name" icon={<UserIcon />} type="text"
            value={fullname} placeholder="Enter your full name" onChange={setFullname} />
          <InputField label="Username" icon={<UserIcon />} type="text"
            value={username} placeholder="Choose a username" onChange={setUsername} />
          <InputField label="Email" icon={<MailIcon />} type="email"
            value={email} placeholder="Enter your email" onChange={setEmail} />
          <InputField label="Password" icon={<LockIcon />} type="password"
            value={password} placeholder="At least 6 characters" onChange={setPassword} />
          <InputField label="Confirm password" icon={<LockIcon />} type="password"
            value={confirm} placeholder="Re-enter your password" onChange={setConfirm} />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Registering...' : `Register as ${role}`}
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{' '}
          <a href="#" className="link" onClick={(e) => { e.preventDefault(); onBack() }}>
            Back to login
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register
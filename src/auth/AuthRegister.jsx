import { useState } from 'react';
import { postNewUser } from '../api';
import AuthLayout from './AuthLayout';

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function AuthRegister({ onBack, onRegistered }) {
  const [role, setRole] = useState('Student');
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // field names match UserEntity: username, password, role, fullname, email
      await postNewUser({ username, password, role: role.toUpperCase(), fullname, email });
      onRegistered('Registration successful! You can now log in.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="REGISTER" subtitle="Create your account to get started">
      <form className="au-form" onSubmit={handleSubmit}>
        <div className="au-role-tabs" role="tablist" aria-label="Select role">
          <button
            type="button"
            className={`au-role-tab ${role === 'Student' ? 'au-active' : ''}`}
            onClick={() => setRole('Student')}
            aria-pressed={role === 'Student'}
          >
            Student
          </button>
          <button
            type="button"
            className={`au-role-tab ${role === 'Teacher' ? 'au-active' : ''}`}
            onClick={() => setRole('Teacher')}
            aria-pressed={role === 'Teacher'}
          >
            Teacher
          </button>
        </div>

        <label className="au-field">
          <span className="au-label">Full name</span>
          <span className="au-input-wrap">
            <span className="au-input-icon"><UserIcon /></span>
            <input
              className="au-input"
              type="text"
              value={fullname}
              placeholder="Enter your full name"
              onChange={(e) => setFullname(e.target.value)}
              autoComplete="name"
              required
            />
          </span>
        </label>

        <label className="au-field">
          <span className="au-label">Username</span>
          <span className="au-input-wrap">
            <span className="au-input-icon"><UserIcon /></span>
            <input
              className="au-input"
              type="text"
              value={username}
              placeholder="Choose a username"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </span>
        </label>

        <label className="au-field">
          <span className="au-label">Email</span>
          <span className="au-input-wrap">
            <span className="au-input-icon"><MailIcon /></span>
            <input
              className="au-input"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </span>
        </label>

        <label className="au-field">
          <span className="au-label">Password</span>
          <span className="au-input-wrap">
            <span className="au-input-icon"><LockIcon /></span>
            <input
              className="au-input"
              type="password"
              value={password}
              placeholder="At least 6 characters"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </span>
          <p className="au-hint">At least 6 characters</p>
        </label>

        <label className="au-field">
          <span className="au-label">Confirm password</span>
          <span className="au-input-wrap">
            <span className="au-input-icon"><LockIcon /></span>
            <input
              className="au-input"
              type="password"
              value={confirm}
              placeholder="Re-enter your password"
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </span>
        </label>

        {error ? <p className="au-error">{error}</p> : null}

        <button type="submit" className="au-submit-btn" disabled={loading}>
          {loading ? 'Registering...' : `Register as ${role}`}
        </button>
      </form>

      <p className="au-footer">
        Already have an account?{' '}
        <button type="button" className="au-link-btn" onClick={onBack}>
          Back to login
        </button>
      </p>
    </AuthLayout>
  );
}

export default AuthRegister;

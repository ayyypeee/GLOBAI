import { useEffect, useState } from 'react'
import { getAllUsers, putUserEmail, deleteUser } from '../api'
import '../home.css'

// Shown after login. Demonstrates R (list), U (edit email) and D (delete) of the user entity.
function Home({ user, onLogout }) {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [editId, setEditId] = useState(null)
  const [editEmail, setEditEmail] = useState('')

  const reload = () =>
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
  }, [])

  const startEdit = (u) => {
    setEditId(u.userid)
    setEditEmail(u.email)
    setError('')
    setMessage('')
  }

  const saveEmail = async (id) => {
    setError('')
    try {
      await putUserEmail(id, editEmail)
      setEditId(null)
      setMessage('Email updated.')
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.fullname}?`)) return
    setError('')
    try {
      const msg = await deleteUser(u.userid)
      if (u.userid === user.userid) {
        onLogout() // you deleted your own account
        return
      }
      setMessage(msg)
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="home">
      <header className="home-header">
        <div>
          <h2>Welcome, {user.fullname}</h2>
          <span className="role-badge">{user.role}</span>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </header>

      <div className="home-card">
        <h3>Registered Users</h3>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userid}>
                <td>{u.userid}</td>
                <td>{u.fullname}</td>
                <td>{u.username}</td>
                <td>
                  {editId === u.userid ? (
                    <input
                      className="edit-input"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td>{u.role}</td>
                <td className="actions">
                  {editId === u.userid ? (
                    <>
                      <button className="btn-small" onClick={() => saveEmail(u.userid)}>Save</button>
                      <button className="btn-small gray" onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-small" onClick={() => startEdit(u)}>Edit email</button>
                      <button className="btn-small red" onClick={() => handleDelete(u)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="empty">No users yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home
import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Stats, Table } from '../components/Parts'
import { listUsers, approveUser, rejectUser, deleteUser } from '../api'

const NAV = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'requests', label: 'Account Requests', icon: 'pending' },
  { key: 'students', label: 'Student Accounts', icon: 'grades' },
  { key: 'staff', label: 'Staff Accounts', icon: 'users' },
]

const label = (value) => value.charAt(0) + value.slice(1).toLowerCase()

export default function AdminDashboard({ user, onLogout }) {
  const [view, setView] = useState('home')
  const [accounts, setAccounts] = useState(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = () =>
    listUsers().then(setAccounts).catch((e) => setError(e.message))

  useEffect(() => {
    listUsers().then(setAccounts).catch((e) => setError(e.message))
  }, [])

  // Runs one admin action, then refreshes the list
  const act = async (id, action, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return
    setError('')
    setBusyId(id)
    try {
      await action(id)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusyId(null)
    }
  }

  const buttons = (r) => (
    <div className="row-actions">
      {r.status !== 'APPROVED' && (
        <button className="btn-approve" disabled={busyId === r.id}
          onClick={() => act(r.id, approveUser)}>Approve</button>
      )}
      {r.status === 'PENDING' && (
        <button className="btn-reject" disabled={busyId === r.id}
          onClick={() => act(r.id, rejectUser)}>Reject</button>
      )}
      {r.status !== 'PENDING' && (
        <button className="btn-delete" disabled={busyId === r.id}
          onClick={() => act(r.id, deleteUser, `Remove the account of ${r.name}?`)}>Remove</button>
      )}
    </div>
  )

  const statusCell = (r) => (
    <span className={'pill ' + r.status.toLowerCase()}>{label(r.status)}</span>
  )

  const requestCols = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'School email' },
    { key: 'role', label: 'Role', render: (r) => label(r.role) },
    { key: 'studentId', label: 'Student ID', render: (r) => r.studentId || '-' },
    { key: 'createdAt', label: 'Requested' },
    { key: 'actions', label: 'Action', render: buttons },
  ]
  const studentCols = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'School email' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'status', label: 'Status', render: statusCell },
    { key: 'actions', label: 'Action', render: buttons },
  ]
  const staffCols = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'School email' },
    { key: 'status', label: 'Status', render: statusCell },
    { key: 'actions', label: 'Action', render: buttons },
  ]

  let body = <p className="empty">Loading...</p>
  if (accounts) {
    const students = accounts.filter((a) => a.role === 'STUDENT')
    const staff = accounts.filter((a) => a.role === 'STAFF')
    const waiting = accounts.filter((a) => a.status === 'PENDING')
    const count = (list) => list.filter((a) => a.status === 'APPROVED').length

    body = {
      home: (
        <>
          <h1>Welcome, {user.name}!</h1>
          <Stats items={[
            { label: 'Students', value: count(students) },
            { label: 'Staff', value: count(staff) },
            { label: 'Pending requests', value: waiting.length },
            { label: 'Total accounts', value: accounts.length },
          ]} />
          <h2>Accounts waiting for approval</h2>
          <Table cols={requestCols} rows={waiting} empty="No pending requests." />
        </>
      ),
      requests: (
        <>
          <h1>Account requests</h1>
          <Table cols={requestCols} rows={waiting} empty="No pending requests." />
        </>
      ),
      students: (
        <>
          <h1>Student accounts</h1>
          <Table cols={studentCols} rows={students} empty="No student accounts yet." />
        </>
      ),
      staff: (
        <>
          <h1>Staff accounts</h1>
          <Table cols={staffCols} rows={staff} empty="No staff accounts yet." />
        </>
      ),
    }[view]
  }

  return (
    <DashboardLayout
      user={user} nav={NAV} active={view} onNav={setView}
      onLogout={onLogout} title="Admin Home"
    >
      {error && <p className="error-msg">{error}</p>}
      {!accounts && error ? <p className="empty">Is the backend running on port 8080?</p> : body}
    </DashboardLayout>
  )
}
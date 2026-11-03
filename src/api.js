const BASE = 'http://localhost:8080'

export async function login(username, password) {
  let res
  try {
    res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  if (!res.ok) throw new Error('Invalid username or password')
  return res.json()
}

export async function getDashboard(role) {
  const res = await fetch(`${BASE}/api/${role}/dashboard`)
  if (!res.ok) throw new Error('Could not load dashboard data')
  return res.json()
}

export async function saveAttendance(courseCode, date, entries) {
  const res = await fetch(`${BASE}/api/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseCode, date, entries }),
  })
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || 'Could not save attendance')
  }
  return res.json()
}

export async function getStudentAttendance(studentId) {
  const res = await fetch(`${BASE}/api/attendance/student/${encodeURIComponent(studentId)}`)
  if (!res.ok) throw new Error('Could not load attendance records')
  return res.json()
}
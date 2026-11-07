const BASE = 'http://localhost:8080'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

// Sends a request and turns failures into readable error messages
async function send(path, options, fallbackMessage) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, options)
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || fallbackMessage)
  }
  return res
}

export async function login(username, password) {
  const res = await send(
    '/api/auth/login',
    { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ username, password }) },
    'Invalid username or password'
  )
  return res.json()
}

export async function register(data) {
  const res = await send(
    '/api/auth/register',
    { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(data) },
    'Could not create account'
  )
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

// ---------- Admin: user CRUD ----------

export async function listUsers() {
  const res = await send('/api/users', {}, 'Could not load users')
  return res.json()
}

export async function createUser(data) {
  const res = await send(
    '/api/users',
    { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(data) },
    'Could not create user'
  )
  return res.json()
}

export async function updateUser(id, data) {
  const res = await send(
    `/api/users/${id}`,
    { method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify(data) },
    'Could not update user'
  )
  return res.json()
}

export async function deleteUser(id) {
  await send(`/api/users/${id}`, { method: 'DELETE' }, 'Could not delete user')
}

// ---------- Password reset ----------

export async function forgotPassword(email) {
  await send(
    '/api/auth/forgot-password',
    { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ email }) },
    'Could not send reset link'
  )
}

export async function resetPassword(token, newPassword) {
  await send(
    '/api/auth/reset-password',
    { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ token, newPassword }) },
    'Could not reset password'
  )
}
const BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8080`

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, options)
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0)
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new ApiError(data.message || 'Something went wrong.', res.status)
  }
  return res
}

function read(path) {
  return request(path).then((res) => res.json())
}

function send(method, path, body) {
  return request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then((res) => res.json())
}

function remove(path) {
  return request(path, { method: 'DELETE' }).then((res) => res.text())
}

export const login = (username, password) => send('POST', '/user/api/login', { username, password })

export const register = (user) => send('POST', '/user/api/postNewUser', user)

export const getUser = (userid) => read(`/user/api/getUser/${userid}`)

export const courses = {
  byTeacher: (userid) => read(`/course/api/getCoursesByTeacher/${userid}`),
  create: (userid, course) => send('POST', `/course/api/postCourse?userid=${userid}`, course),
  update: (code, course) => send('PUT', `/course/api/putCourse/${encodeURIComponent(code)}`, course),
  remove: (code) => remove(`/course/api/deleteCourse/${encodeURIComponent(code)}`),
}

export const enrollments = {
  byStudent: (userid) => read(`/enrollment/api/getEnrollmentsByStudent/${userid}`),
  byTeacher: (userid) => read(`/enrollment/api/getEnrollmentsByTeacher/${userid}`),
  countByCourse: (code) => read(`/enrollment/api/countByCourse/${encodeURIComponent(code)}`),
  join: (userid, code) =>
    send('POST', `/enrollment/api/joinCourse?userid=${userid}&code=${encodeURIComponent(code)}`),
  remove: (id) => remove(`/enrollment/api/deleteEnrollment/${id}`),
}
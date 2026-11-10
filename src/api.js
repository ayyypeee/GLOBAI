const BASE = 'http://localhost:8080'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, options)
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Something went wrong.')
  }
  return res
}

function read(path) {
  return request(path).then((res) => res.json())
}

function send(method, path, body) {
  return request(path, {
    method,
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  }).then((res) => res.json())
}

function remove(path) {
  return request(path, { method: 'DELETE' }).then((res) => res.text())
}

function resource(group, name) {
  return {
    getAll: () => read(`/${group}/api/getAll${name}s`),
    post: (item) => send('POST', `/${group}/api/post${name}`, item),
    put: (id, item) => send('PUT', `/${group}/api/put${name}/${encodeURIComponent(id)}`, item),
    remove: (id) => remove(`/${group}/api/delete${name}/${encodeURIComponent(id)}`),
  }
}

export const users = {
  getAll: () => read('/user/api/getAllUsers'),
  post: (user) => send('POST', '/user/api/postNewUser', user),
  put: (id, user) => send('PUT', `/user/api/putUserEmail?id=${id}`, user),
  remove: (id) => remove(`/user/api/deleteUser/${id}`),
}

export const students = resource('student', 'Student')
export const teachers = resource('teacher', 'Teacher')
export const courses = resource('course', 'Course')
export const enrollments = resource('enrollment', 'Enrollment')

export const postNewUser = users.post

export function login(username, password) {
  return send('POST', '/user/api/login', { username, password })
}
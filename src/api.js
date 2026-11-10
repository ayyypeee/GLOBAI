// All calls go to the Spring Boot UserController
const BASE = 'http://localhost:8080/user/api'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

// Sends the request and turns errors into readable messages
async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, options)
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  if (!res.ok) {
    let message = 'Something went wrong.'
    try {
      const data = await res.json()
      message = data.message || message
    } catch {
      // the response had no JSON body, keep the default message
    }
    throw new Error(message)
  }
  return res
}

// C - Create (Register)   POST /user/api/postNewUser
export async function postNewUser(user) {
  const res = await request('/postNewUser', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(user),
  })
  return res.json()
}

// Login   POST /user/api/login
export async function login(username, password) {
  const res = await request('/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ username, password }),
  })
  return res.json()
}

// R - Read   GET /user/api/getAllUsers
export async function getAllUsers() {
  const res = await request('/getAllUsers')
  return res.json()
}

// U - Update   PUT /user/api/putUserEmail?id=1
export async function putUserEmail(id, email) {
  const res = await request(`/putUserEmail?id=${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email }),
  })
  return res.json()
}

// D - Delete   DELETE /user/api/deleteUser/1
export async function deleteUser(id) {
  const res = await request(`/deleteUser/${id}`, { method: 'DELETE' })
  return res.text()
}
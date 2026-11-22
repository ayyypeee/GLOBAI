import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import StudentApp from './student/StudentApp'
import TeacherApp from './teacher/TeacherApp'

function App() {
  const [view, setView] = useState('login') // 'login' or 'register'
  const [user, setUser] = useState(null) // the logged-in user
  const [notice, setNotice] = useState('') // message shown on the login page

  // after login
  if (user) {
    if (user.role === 'STUDENT') return <StudentApp user={user} onLogout={() => setUser(null)} />
    if (user.role === 'TEACHER') return <TeacherApp user={user} onLogout={() => setUser(null)} />
    return <Home user={user} onLogout={() => setUser(null)} />
  }

  if (view === 'register') {
    return (
      <Register
        onBack={() => setView('login')}
        onRegistered={(msg) => {
          setNotice(msg)
          setView('login')
        }}
      />
    )
  }

  return (
    <Login
      notice={notice}
      onLoginSuccess={(u) => {
        setNotice('')
        setUser(u)
      }}
      onGoRegister={() => {
        setNotice('')
        setView('register')
      }}
    />
  )
}

export default App
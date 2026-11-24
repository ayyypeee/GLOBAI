import { useState } from 'react'
import './App.css'
import './auth/auth.css'
import Login from './auth/AuthLogin'
import Register from './auth/AuthRegister'
import StudentApp from './student/StudentApp'
import TeacherApp from './teacher/TeacherApp'

const PORTALS = {
  STUDENT: StudentApp,
  TEACHER: TeacherApp,
}

function App() {
  const [view, setView] = useState('login')
  const [user, setUser] = useState(null)
  const [notice, setNotice] = useState('')

  if (user) {
    const Portal = PORTALS[user.role]
    if (Portal) return <Portal user={user} onLogout={() => setUser(null)} />
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
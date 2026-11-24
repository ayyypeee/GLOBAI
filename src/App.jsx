import { useState } from 'react'
import { usePersisted } from './shared/usePersisted'
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
  const [user, setUser] = usePersisted('globai-user', null)
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
        const saved = { ...u }
        delete saved.password
        setNotice('')
        setUser(saved)
      }}
      onGoRegister={() => {
        setNotice('')
        setView('register')
      }}
    />
  )
}

export default App
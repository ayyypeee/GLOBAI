import { useEffect, useState } from 'react'
import { getUser } from './api'
import { usePersisted } from './shared/usePersisted'
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
  const userid = user?.userid

  useEffect(() => {
    if (!userid) return
    let cancelled = false
    getUser(userid)
      .then((fresh) => {
        if (!cancelled) setUser(fresh)
      })
      .catch((err) => {
        if (!cancelled && err.status === 404) setUser(null)
      })
    return () => {
      cancelled = true
    }
  }, [userid, setUser])

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
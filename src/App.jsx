import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

function App() {
  const [view, setView] = useState('login') // 'login' or 'register'
  const [user, setUser] = useState(null) // the logged-in user
  const [notice, setNotice] = useState('') // message shown on the login page

  // after login
  if (user) {
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
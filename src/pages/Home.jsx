import { useState } from 'react'
import CrudPage from '../components/CrudPage'
import { PAGES } from '../resources'
import '../home.css'

function Home({ user, onLogout }) {
  const pages = PAGES.filter((page) => page.roles.includes(user.role))
  const [activeKey, setActiveKey] = useState(pages[0].key)
  const active = pages.find((page) => page.key === activeKey)

  return (
    <div className="home">
      <header className="home-header">
        <div>
          <h2>Welcome, {user.fullname}</h2>
          <span className="role-badge">{user.role}</span>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </header>

      <nav className="tabs">
        {pages.map((page) => (
          <button
            key={page.key}
            className={page.key === activeKey ? 'tab active' : 'tab'}
            onClick={() => setActiveKey(page.key)}
          >
            {page.title}
          </button>
        ))}
      </nav>

      <CrudPage key={active.key} config={active} user={user} readOnly={user.role !== 'TEACHER'} />
    </div>
  )
}

export default Home
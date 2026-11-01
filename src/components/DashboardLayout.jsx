import { useState } from 'react'
import { Icon } from './Parts'
import '../dashboard.css'

export default function DashboardLayout({ user, nav, active, onNav, onLogout, title, children }) {
  const [open, setOpen] = useState({})
  const [menu, setMenu] = useState(false)

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <img src="/LOGO.png" alt="" />
          <div>
            <b>Academiko</b>
            
          </div>
        </div>

        <div className="topbar-right">
          <button className="bell" aria-label="Notifications"><Icon name="bell" /></button>
          <button className="user" onClick={() => setMenu(!menu)}>
            <span className="avatar">{user.name[0]}</span>
            <span className="who">
              <b>{user.name}</b>
              <small>{user.email}</small>
            </span>
            <Icon name="down" size={16} />
          </button>
          {menu && (
            <div className="menu">
              <button onClick={onLogout}><Icon name="logout" size={16} /> Log out</button>
            </div>
          )}
        </div>
      </header>

      <aside className="sidebar">
        <nav>
          {nav.map((item) => {
            const isOpen = open[item.key]
            const hasKids = !!item.children
            const current = active === item.key || item.children?.some((c) => c.key === active)
            return (
              <div key={item.key}>
                <button
                  className={'nav-item' + (current ? ' current' : '')}
                  onClick={() => (hasKids ? setOpen({ ...open, [item.key]: !isOpen }) : onNav(item.key))}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {hasKids && <Icon name={isOpen ? 'down' : 'right'} size={14} />}
                </button>
                {hasKids && isOpen && item.children.map((c) => (
                  <button
                    key={c.key}
                    className={'nav-sub' + (active === c.key ? ' current' : '')}
                    onClick={() => onNav(c.key)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )
          })}
        </nav>
      </aside>

      <main className="main">
        <div className="crumb">{title}</div>
        <section className="panel">{children}</section>
      </main>
    </div>
  )
}
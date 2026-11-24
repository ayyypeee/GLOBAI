import { useState } from 'react'
import { BrandMark } from '../../auth/AuthLayout'
import { Modal, Field, Empty, PlusIcon } from '../../shared/ui'

function MyClasses({ user, onOpen, onLogout }) {
  const [classes, setClasses] = useState([])
  const [joining, setJoining] = useState(false)
  const [code, setCode] = useState('')

  const fullName = user?.fullname || user?.username || 'Student'
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  const close = () => {
    setCode('')
    setJoining(false)
  }

  const join = (e) => {
    e.preventDefault()
    const value = code.trim().toUpperCase()
    if (value && !classes.some((c) => c.code === value)) {
      setClasses([...classes, { code: value }])
    }
    close()
  }

  return (
    <div className="ui-portal">
      <header className="ui-top">
        <div className="ui-top-brand">
          <BrandMark size={36} />
          <span>Academiko</span>
        </div>
        <button type="button" className="ui-btn ui-btn-ghost" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="ui-wrap">
        <section className="ui-banner">
          <span className="ui-banner-avatar">{initials || 'S'}</span>
          <div>
            <h1>{fullName}</h1>
            <span>Student</span>
          </div>
        </section>

        <div className="ui-head">
          <div>
            <h1>My classes</h1>
            <p>Enter the code from your teacher to join a subject.</p>
          </div>
          <button type="button" className="ui-btn" onClick={() => setJoining(true)}>
            <PlusIcon />
            Join class
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="ui-card">
            <Empty title="No classes yet" text="Click Join class and enter the code from your teacher." />
          </div>
        ) : (
          <div className="ui-classes">
            {classes.map((c) => (
              <button key={c.code} type="button" className="ui-class" onClick={() => onOpen(c)}>
                <span className="ui-code">{c.code}</span>
                <h3>Class {c.code}</h3>
                <span className="ui-badge ui-badge-accepted">Joined</span>
              </button>
            ))}
          </div>
        )}
      </main>

      {joining && (
        <Modal title="Join class" text="Enter the subject code given by your teacher." onClose={close}>
          <form onSubmit={join}>
            <Field label="Subject code" value={code} placeholder="e.g. 4K9XQ2" onChange={setCode} />
            <div className="ui-actions">
              <button type="button" className="ui-btn ui-btn-ghost" onClick={close}>
                Cancel
              </button>
              <button type="submit" className="ui-btn">
                Join
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default MyClasses
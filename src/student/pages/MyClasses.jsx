import { useEffect, useState } from 'react'
import { enrollments } from '../../api'
import { BrandMark } from '../../auth/AuthLayout'
import { Modal, Confirm, Field, Alert, Empty, PlusIcon } from '../../shared/ui'

function MyClasses({ user, onOpen, onLogout }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  const [joining, setJoining] = useState(false)
  const [code, setCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [leaving, setLeaving] = useState(null)
  const [busy, setBusy] = useState(false)

  const fullName = user?.fullname || user?.username || 'Student'
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  useEffect(() => {
    let cancelled = false
    enrollments
      .byStudent(user.userid)
      .then((list) => {
        if (cancelled) return
        setItems(list)
        setError('')
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user.userid, version])

  const closeJoin = () => {
    setCode('')
    setJoinError('')
    setJoining(false)
  }

  const join = async (e) => {
    e.preventDefault()
    setJoinError('')
    setBusy(true)
    try {
      const created = await enrollments.join(user.userid, code.trim())
      onOpen(created.course)
    } catch (err) {
      setJoinError(err.message)
      setBusy(false)
    }
  }

  const leave = async () => {
    setBusy(true)
    try {
      await enrollments.remove(leaving.enrollmentid)
      setLeaving(null)
      setVersion((v) => v + 1)
    } catch (err) {
      setLeaving(null)
      setError(err.message)
    } finally {
      setBusy(false)
    }
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

        {error && <Alert>{error}</Alert>}

        {loading ? (
          <div className="ui-card">
            <div className="ui-loading">Loading your classes...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="ui-card">
            <Empty title="No classes yet" text="Click Join class and enter the code from your teacher." />
          </div>
        ) : (
          <div className="ui-classes">
            {items.map((item) => (
              <div key={item.enrollmentid} className="ui-class">
                <span className="ui-code">{item.course.coursecode}</span>
                <h3>{item.course.title}</h3>
                <p>
                  {item.course.teacher?.user?.fullname || 'No teacher'} · {item.course.units}{' '}
                  {item.course.units === 1 ? 'unit' : 'units'}
                </p>
                <div className="ui-class-actions">
                  <button type="button" className="ui-btn ui-btn-sm" onClick={() => onOpen(item.course)}>
                    Open
                  </button>
                  <button type="button" className="ui-btn ui-btn-sm ui-btn-ghost" onClick={() => setLeaving(item)}>
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {joining && (
        <Modal title="Join class" text="Enter the subject code given by your teacher." onClose={closeJoin}>
          <form onSubmit={join}>
            {joinError && <Alert>{joinError}</Alert>}
            <Field label="Subject code" value={code} placeholder="e.g. 4K9XQ2" onChange={setCode} />
            <div className="ui-actions">
              <button type="button" className="ui-btn ui-btn-ghost" onClick={closeJoin}>
                Cancel
              </button>
              <button type="submit" className="ui-btn" disabled={busy}>
                {busy ? 'Joining...' : 'Join'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {leaving && (
        <Confirm
          title="Leave this class?"
          text={`You will be removed from ${leaving.course.title}. You can join again with the code.`}
          label="Leave"
          busy={busy}
          onConfirm={leave}
          onCancel={() => setLeaving(null)}
        />
      )}
    </div>
  )
}

export default MyClasses
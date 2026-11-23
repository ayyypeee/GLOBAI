import { useEffect, useState } from 'react'
import { enrollments } from '../../api'

function EmptyState({ title, text }) {
  return (
    <div className="sp-empty">
      <span className="sp-empty-icon">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      </span>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  )
}

function Dashboard({ user, onNavigate }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    enrollments
      .getAll()
      .then((data) => {
        if (!cancelled) {
          setRows(data.filter((r) => r.student?.user?.userid === user?.userid))
        }
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
  }, [user?.userid])

  const subjects = rows.map((r) => ({
    id: r.enrollmentid,
    code: r.course?.coursecode,
    title: r.course?.title,
    units: r.course?.units ?? 0,
    instructor: r.course?.teacher?.user?.fullname,
  }))
  const totalUnits = subjects.reduce((sum, s) => sum + s.units, 0)
  const instructorCount = new Set(subjects.map((s) => s.instructor).filter(Boolean)).size

  const fullName = user?.fullname || user?.username || 'Student'
  const firstName = fullName.split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="sp-page">
      <section className="sp-hero">
        <div>
          <h1 className="sp-hero-title">
            {greeting}, {firstName}!
          </h1>
          <p className="sp-hero-sub">Here’s your academic overview for this semester.</p>
        </div>
        <span className="sp-hero-chip">{today}</span>
      </section>

      {error && <div className="sp-alert">{error}</div>}

      <section className="sp-stats">
        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">Enrolled Subjects</h2>
          </div>
          <div className="sp-big">{loading ? '…' : subjects.length}</div>
          <p className="sp-muted">Subjects you are enrolled in</p>
          <div className="sp-mini-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="sp-mini">
              <strong>{totalUnits}</strong>
              <span>Total units</span>
            </div>
            <div className="sp-mini">
              <strong>{instructorCount}</strong>
              <span>Instructors</span>
            </div>
          </div>
        </article>

        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">Attendance Rate</h2>
          </div>
          <EmptyState title="No attendance yet" text="Your attendance will appear here once it is recorded." />
        </article>

        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">Upcoming Quizzes</h2>
            <button type="button" className="sp-link" onClick={() => onNavigate('quizzes')}>
              View all
            </button>
          </div>
          <EmptyState title="No quizzes yet" text="Quizzes from your teachers will show up here." />
        </article>
      </section>

      <section className="sp-card sp-section">
        <div className="sp-card-head">
          <h2 className="sp-card-title">My Subjects</h2>
          <button type="button" className="sp-link" onClick={() => onNavigate('grades')}>
            View grades
          </button>
        </div>

        {loading ? (
          <div className="sp-loading">Loading your subjects...</div>
        ) : subjects.length === 0 ? (
          <EmptyState
            title="No subjects yet"
            text="You are not enrolled in any subject. Ask your teacher to enroll you."
          />
        ) : (
          <div className="sp-subjects">
            {subjects.map((s) => (
              <div key={s.id} className="sp-subject">
                <div className="sp-subject-top">
                  <div>
                    <strong className="sp-subject-name">{s.title}</strong>
                    <span className="sp-row-sub">
                      {s.code}
                      {s.instructor ? ` · ${s.instructor}` : ''}
                    </span>
                  </div>
                  <span className="sp-badge sp-badge-blue">{s.units} units</span>
                </div>
                <p className="sp-muted sp-mt">No grades recorded yet.</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="sp-bottom">
        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">Grade Trend</h2>
            <span className="sp-muted">Term averages</span>
          </div>
          <EmptyState title="No grades yet" text="Your grade trend will appear once grades are posted." />
        </article>

        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">Recent Notifications</h2>
            <button type="button" className="sp-link" onClick={() => onNavigate('notifications')}>
              View all
            </button>
          </div>
          <EmptyState title="You are all caught up" text="New notifications will show up here." />
        </article>
      </section>
    </div>
  )
}

export default Dashboard
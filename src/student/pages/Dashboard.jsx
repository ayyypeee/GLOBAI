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

function Dashboard({ user, course, onNavigate }) {
  const [classmates, setClassmates] = useState(null)
  const [error, setError] = useState('')
  const code = course.coursecode

  useEffect(() => {
    let cancelled = false
    enrollments
      .countByCourse(code)
      .then((count) => {
        if (!cancelled) setClassmates(count)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [code])

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
          <p className="sp-hero-sub">Here’s your overview for {course.title}.</p>
        </div>
        <span className="sp-hero-chip">{today}</span>
      </section>

      {error && <div className="sp-alert">{error}</div>}

      <section className="sp-stats">
        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">My Class</h2>
            <span className="sp-badge sp-badge-blue">{code}</span>
          </div>
          <strong className="sp-subject-name">{course.title}</strong>
          <p className="sp-muted">{course.teacher?.user?.fullname || 'No instructor assigned'}</p>
          <div className="sp-mini-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="sp-mini">
              <strong>{course.units}</strong>
              <span>{course.units === 1 ? 'Unit' : 'Units'}</span>
            </div>
            <div className="sp-mini">
              <strong>{classmates ?? '…'}</strong>
              <span>{classmates === 1 ? 'Student' : 'Students'}</span>
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
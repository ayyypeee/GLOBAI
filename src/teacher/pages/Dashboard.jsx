import { useEffect, useState } from 'react'
import { courses, enrollments } from '../../api'

const STAT_ICONS = {
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  check: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18m-12 6 2 2 4-4" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </>
  ),
}

function StatIcon({ name }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {STAT_ICONS[name]}
    </svg>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className="tp-empty">
      <span className="tp-empty-icon">
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

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const top = Math.max(4, Math.ceil(max / 4) * 4)
  const ticks = [top, (top * 3) / 4, top / 2, top / 4, 0]
  const cols = { gridTemplateColumns: `repeat(${data.length}, 1fr)` }

  return (
    <div className="tp-chart tp-chart-bars">
      <div className="tp-chart-y">
        {ticks.map((t, i) => (
          <span key={t} style={{ top: `${i * 25}%` }}>
            {t}
          </span>
        ))}
      </div>

      <div className="tp-chart-plot">
        {ticks.map((t, i) => (
          <div key={t} className="tp-chart-grid" style={{ top: `${i * 25}%` }} />
        ))}
        <div className="tp-bar-cols" style={cols}>
          {data.map((d) => (
            <div key={d.code} className="tp-bar-col">
              <div className="tp-bar" style={{ height: `${(d.value / top) * 100}%` }}>
                <span className="tp-bar-value">{d.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-chart-x tp-chart-x-bars" style={cols}>
        {data.map((d) => (
          <div key={d.code}>
            <strong>{d.name}</strong>
            <span>
              {d.value} {d.value === 1 ? 'student' : 'students'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Dashboard({ user, onNavigate }) {
  const [myCourses, setMyCourses] = useState([])
  const [myEnrollments, setMyEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([courses.byTeacher(user.userid), enrollments.byTeacher(user.userid)])
      .then(([c, e]) => {
        if (cancelled) return
        setMyCourses(c)
        setMyEnrollments(e)
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
  }, [user.userid])

  const myStudentIds = new Set(myEnrollments.map((e) => e.student?.studentid))
  const totalUnits = myCourses.reduce((sum, c) => sum + c.units, 0)
  const average = myCourses.length === 0 ? 0 : Math.round((myEnrollments.length / myCourses.length) * 10) / 10

  const classSizes = myCourses.map((c) => ({
    code: c.coursecode,
    name: c.title,
    value: myEnrollments.filter((e) => e.course?.coursecode === c.coursecode).length,
  }))

  const recent = [...myEnrollments].sort((a, b) => b.enrollmentid - a.enrollmentid).slice(0, 5)

  const show = (n) => (loading ? '…' : n)
  const stats = [
    { key: 'courses', icon: 'book', tone: 'green', label: 'My Classes', value: show(myCourses.length), note: 'Subjects you teach' },
    { key: 'students', icon: 'users', tone: 'blue', label: 'My Students', value: show(myStudentIds.size), note: 'Across your classes' },
    { key: 'average', icon: 'check', tone: 'amber', label: 'Average Class Size', value: show(average), note: 'Students per class' },
    { key: 'units', icon: 'badge', tone: 'blue', label: 'Total Units', value: show(totalUnits), note: 'Units you handle' },
  ]

  const fullName = user?.fullname || user?.username || 'Teacher'
  const firstName = fullName.split(' ')[0]
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="tp-page">
      <section className="tp-hero">
        <div>
          <span className="tp-hero-date">{today}</span>
          <h1 className="tp-hero-title">Welcome back, {firstName}!</h1>
          <p className="tp-hero-sub">Monitor your classes, attendance, and student concerns at a glance.</p>
        </div>
        <div className="tp-hero-actions">
          <button type="button" className="tp-btn tp-btn-light" onClick={() => onNavigate('classes')}>
            Manage classes
          </button>
          <button type="button" className="tp-btn tp-btn-ghost" onClick={() => onNavigate('gradebook')}>
            Open gradebook
          </button>
        </div>
      </section>

      {error && <div className="tp-alert">{error}</div>}

      <section className="tp-stats">
        {stats.map((s) => (
          <article key={s.key} className="tp-card tp-stat">
            <span className={`tp-stat-icon tp-tone-${s.tone}`}>
              <StatIcon name={s.icon} />
            </span>
            <div className="tp-stat-body">
              <span className="tp-stat-label">{s.label}</span>
              <strong className="tp-stat-value">{s.value}</strong>
              <span className="tp-muted">{s.note}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="tp-two">
        <article className="tp-card">
          <div className="tp-card-head">
            <h2 className="tp-card-title">Class Size by Subject</h2>
            <span className="tp-muted">Students per class</span>
          </div>
          {loading ? (
            <div className="tp-loading">Loading...</div>
          ) : classSizes.length === 0 ? (
            <EmptyState
              title="No classes yet"
              text="Create a subject under Classes and your students will show up here."
            />
          ) : (
            <BarChart data={classSizes} />
          )}
        </article>

        <article className="tp-card">
          <div className="tp-card-head">
            <h2 className="tp-card-title">Attendance Trend</h2>
            <span className="tp-muted">Weekly attendance rate</span>
          </div>
          <EmptyState title="No attendance yet" text="Attendance trends will appear once you record attendance." />
        </article>
      </section>

      <section className="tp-two">
        <article className="tp-card">
          <div className="tp-card-head">
            <h2 className="tp-card-title">Students at Risk</h2>
          </div>
          <EmptyState title="No flagged students" text="Students with low grades or absences will be listed here." />
        </article>

        <article className="tp-card">
          <div className="tp-card-head">
            <h2 className="tp-card-title">Recent Joins</h2>
            <button type="button" className="tp-link" onClick={() => onNavigate('classes')}>
              View classes
            </button>
          </div>
          {loading ? (
            <div className="tp-loading">Loading...</div>
          ) : recent.length === 0 ? (
            <EmptyState title="No students yet" text="Students who join your classes will appear here." />
          ) : (
            <div className="tp-timeline">
              {recent.map((e) => (
                <div key={e.enrollmentid} className="tp-event">
                  <span className="tp-event-dot tp-dot-done" />
                  <div className="tp-event-body">
                    <strong className="tp-row-title">{e.student?.user?.fullname}</strong>
                    <span className="tp-row-sub">
                      {e.course?.coursecode} - {e.course?.title}
                    </span>
                  </div>
                  <span className="tp-badge tp-badge-gray">{e.dateenrolled || 'No date'}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}

export default Dashboard
import { subjects, attendance, quizzes, notifications, gradeTrend } from '../mockData'

const RADIUS = 42
const CIRC = 2 * Math.PI * RADIUS

function badgeClass(status) {
  switch (status) {
    case 'Good':
    case 'Good Standing':
    case 'Excellent':
      return 'sp-badge sp-badge-green'
    case 'Upcoming':
    case 'New':
      return 'sp-badge sp-badge-blue'
    case 'Pending':
    case 'Passing':
      return 'sp-badge sp-badge-amber'
    case 'Missed':
    case 'At Risk':
      return 'sp-badge sp-badge-red'
    default:
      return 'sp-badge sp-badge-gray'
  }
}

function Ring({ value }) {
  return (
    <div className="sp-ring">
      <svg viewBox="0 0 100 100">
        <defs>
          <linearGradient id="spRingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={RADIUS} className="sp-ring-track" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          className="sp-ring-bar"
          stroke="url(#spRingGrad)"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - value / 100)}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="sp-ring-label">
        <strong>{value}%</strong>
        <span>Average</span>
      </div>
    </div>
  )
}

function TrendChart({ data }) {
  const min = 70
  const max = 100
  const ticks = [100, 90, 80, 70]

  const pts = data.map((d, i) => ({
    ...d,
    x: ((i + 0.5) / data.length) * 100,
    y: 100 - ((d.value - min) / (max - min)) * 100,
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${pts[pts.length - 1].x},100 L${pts[0].x},100 Z`

  return (
    <div className="sp-chart">
      <div className="sp-chart-y">
        {ticks.map((t, i) => (
          <span key={t} style={{ top: `${(i * 100) / 3}%` }}>
            {t}
          </span>
        ))}
      </div>

      <div className="sp-chart-plot">
        {ticks.map((t, i) => (
          <div key={t} className="sp-chart-grid" style={{ top: `${(i * 100) / 3}%` }} />
        ))}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="spAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#spAreaGrad)" />
          <path d={line} className="sp-chart-line" vectorEffect="non-scaling-stroke" />
        </svg>
        {pts.map((p) => (
          <div key={p.label} className="sp-chart-dot" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <span>{p.value}</span>
          </div>
        ))}
      </div>

      <div className="sp-chart-x" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

function Dashboard({ user, onNavigate }) {
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

  const overall = Math.round(subjects.reduce((sum, s) => sum + s.grade, 0) / subjects.length)
  const best = [...subjects].sort((a, b) => b.grade - a.grade)[0]
  const lowest = [...subjects].sort((a, b) => a.grade - b.grade)[0]
  const standing =
    overall >= 90 ? 'Excellent' : overall >= 80 ? 'Good Standing' : overall >= 75 ? 'Passing' : 'At Risk'

  return (
    <div className="sp-page">
      {/* Hero */}
      <section className="sp-hero">
        <div>
          <h1 className="sp-hero-title">
            {greeting}, {firstName}!
          </h1>
          <p className="sp-hero-sub">Here’s your academic overview for this semester.</p>
        </div>
        <span className="sp-hero-chip">{today}</span>
      </section>

      {/* Top stat cards */}
      <section className="sp-stats">
        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">Overall Grade</h2>
            <span className={badgeClass(standing)}>{standing}</span>
          </div>
          <div className="sp-overall">
            <Ring value={overall} />
            <ul className="sp-facts">
              <li>
                <span>Best subject</span>
                <strong>
                  {best.name} · {best.grade}%
                </strong>
              </li>
              <li>
                <span>Needs attention</span>
                <strong>
                  {lowest.name} · {lowest.grade}%
                </strong>
              </li>
              <li>
                <span>Subjects enrolled</span>
                <strong>{subjects.length}</strong>
              </li>
            </ul>
          </div>
        </article>

        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">Attendance Rate</h2>
            <span className="sp-badge sp-badge-green">{attendance.rate}% rate</span>
          </div>
          <div className="sp-big">{attendance.rate}%</div>
          <p className="sp-muted">Attendance across all subjects</p>
          <div className="sp-progress">
            <span style={{ width: `${attendance.rate}%` }} />
          </div>
          <div className="sp-mini-grid">
            <div className="sp-mini">
              <strong>{attendance.present}</strong>
              <span>Present</span>
            </div>
            <div className="sp-mini">
              <strong>{attendance.late}</strong>
              <span>Late</span>
            </div>
            <div className="sp-mini">
              <strong>{attendance.absent}</strong>
              <span>Absent</span>
            </div>
          </div>
          <p className="sp-muted sp-mt">
            {attendance.present} of {attendance.total} sessions attended
          </p>
        </article>

        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">Upcoming Quizzes</h2>
            <button type="button" className="sp-link" onClick={() => onNavigate('quizzes')}>
              View all
            </button>
          </div>
          <div className="sp-list">
            {quizzes.map((q) => (
              <div key={q.id} className="sp-row">
                <div>
                  <strong className="sp-row-title">{q.title}</strong>
                  <span className="sp-row-sub">{q.subject}</span>
                  <span className="sp-row-sub">{q.when}</span>
                </div>
                <span className={badgeClass(q.status)}>{q.status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Subjects */}
      <section className="sp-card sp-section">
        <div className="sp-card-head">
          <h2 className="sp-card-title">Subjects &amp; Partial Grades</h2>
          <button type="button" className="sp-link" onClick={() => onNavigate('grades')}>
            View grades
          </button>
        </div>
        <div className="sp-subjects">
          {subjects.map((s) => (
            <div key={s.id} className="sp-subject">
              <div className="sp-subject-top">
                <div>
                  <strong className="sp-subject-name">{s.name}</strong>
                  <span className="sp-row-sub">Instructor: {s.instructor}</span>
                </div>
                <span className={badgeClass(s.status)}>{s.status}</span>
              </div>
              <div className="sp-subject-grade">{s.grade}%</div>
              {s.partials.map((p) => (
                <div key={p.label} className="sp-partial">
                  <span>{p.label}</span>
                  <div className="sp-progress sp-progress-sm">
                    <span style={{ width: `${p.score}%` }} />
                  </div>
                  <em>{p.score}</em>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Trend + notifications */}
      <section className="sp-bottom">
        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">Grade Trend</h2>
            <span className="sp-muted">Term averages</span>
          </div>
          <TrendChart data={gradeTrend} />
        </article>

        <article className="sp-card">
          <div className="sp-card-head">
            <h2 className="sp-card-title">Recent Notifications</h2>
            <button type="button" className="sp-link" onClick={() => onNavigate('notifications')}>
              View all
            </button>
          </div>
          <div className="sp-list">
            {notifications.map((n) => (
              <div key={n.id} className={n.unread ? 'sp-note unread' : 'sp-note'}>
                <span className="sp-note-dot" />
                <div className="sp-note-body">
                  <strong className="sp-row-title">{n.title}</strong>
                  <span className="sp-row-sub">{n.text}</span>
                  <span className="sp-row-time">{n.time}</span>
                </div>
                <span className={n.unread ? badgeClass('New') : badgeClass('Read')}>
                  {n.unread ? 'New' : 'Read'}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export default Dashboard
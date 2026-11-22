import { stats, classPerformance, attendanceTrend, atRisk, activity } from '../mockData'

const STAT_ICONS = {
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  trend: (
    <>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </>
  ),
  check: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18m-12 6 2 2 4-4" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
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

function badgeClass(label) {
  switch (label) {
    case 'Good standing':
    case 'On target':
    case 'Done':
      return 'tp-badge tp-badge-green'
    case 'Low grade':
    case 'Frequent absences':
      return 'tp-badge tp-badge-red'
    case 'Needs support':
    case 'Near failing':
    case 'Pending':
    case 'Late':
    case 'Awaiting review':
      return 'tp-badge tp-badge-amber'
    default:
      return 'tp-badge tp-badge-gray'
  }
}

function initialsOf(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

function BarChart({ data }) {
  const ticks = [100, 75, 50, 25, 0]
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
            <div key={d.name} className="tp-bar-col">
              <div className="tp-bar" style={{ height: `${d.average}%` }}>
                <span className="tp-bar-value">{d.average}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-chart-x tp-chart-x-bars" style={cols}>
        {data.map((d) => (
          <div key={d.name}>
            <strong>{d.name}</strong>
            <span>{d.students} students</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LineChart({ data, min, max, ticks, suffix = '' }) {
  const pts = data.map((d, i) => ({
    ...d,
    x: ((i + 0.5) / data.length) * 100,
    y: 100 - ((d.value - min) / (max - min)) * 100,
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${pts[pts.length - 1].x},100 L${pts[0].x},100 Z`
  const step = 100 / (ticks.length - 1)

  return (
    <div className="tp-chart">
      <div className="tp-chart-y">
        {ticks.map((t, i) => (
          <span key={t} style={{ top: `${i * step}%` }}>
            {t}
          </span>
        ))}
      </div>

      <div className="tp-chart-plot">
        {ticks.map((t, i) => (
          <div key={t} className="tp-chart-grid" style={{ top: `${i * step}%` }} />
        ))}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="tpAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#tpAreaGrad)" />
          <path d={line} className="tp-chart-line" vectorEffect="non-scaling-stroke" />
        </svg>
        {pts.map((p) => (
          <div key={p.label} className="tp-chart-dot" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <span>
              {p.value}
              {suffix}
            </span>
          </div>
        ))}
      </div>

      <div className="tp-chart-x" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

function Dashboard({ user, onNavigate }) {
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
      {/* Hero */}
      <section className="tp-hero">
        <div>
          <span className="tp-hero-date">{today}</span>
          <h1 className="tp-hero-title">Welcome back, {firstName}!</h1>
          <p className="tp-hero-sub">Monitor your classes, attendance, and student concerns at a glance.</p>
        </div>
        <div className="tp-hero-actions">
          <button type="button" className="tp-btn tp-btn-light" onClick={() => onNavigate('attendance')}>
            Take attendance
          </button>
          <button type="button" className="tp-btn tp-btn-ghost" onClick={() => onNavigate('gradebook')}>
            Open gradebook
          </button>
        </div>
      </section>

      {/* Stat cards */}
      <section className="tp-stats">
        {stats.map((s) => (
          <article key={s.key} className="tp-card tp-stat">
            <span className={`tp-stat-icon tp-tone-${s.tone}`}>
              <StatIcon name={s.icon} />
            </span>
            <div className="tp-stat-body">
              <span className="tp-stat-label">{s.label}</span>
              <strong className="tp-stat-value">{s.value}</strong>
              <span className={badgeClass(s.note)}>{s.note}</span>
            </div>
          </article>
        ))}
      </section>

      {/* Charts */}
      <section className="tp-two">
        <article className="tp-card">
          <div className="tp-card-head">
            <h2 className="tp-card-title">Class Performance</h2>
            <span className="tp-muted">Average by subject</span>
          </div>
          <BarChart data={classPerformance} />
        </article>

        <article className="tp-card">
          <div className="tp-card-head">
            <h2 className="tp-card-title">Attendance Trend</h2>
            <span className="tp-muted">Weekly attendance rate</span>
          </div>
          <LineChart data={attendanceTrend} min={80} max={100} ticks={[100, 95, 90, 85, 80]} suffix="%" />
        </article>
      </section>

      {/* Risk + activity */}
      <section className="tp-two">
        <article className="tp-card">
          <div className="tp-card-head">
            <h2 className="tp-card-title">Students at Risk</h2>
            <span className="tp-badge tp-badge-red">{atRisk.length} flagged</span>
          </div>
          <div className="tp-list">
            {atRisk.map((s) => (
              <div key={s.id} className="tp-risk">
                <span className="tp-risk-avatar">{initialsOf(s.name)}</span>
                <div className="tp-risk-body">
                  <strong className="tp-row-title">{s.name}</strong>
                  <span className="tp-row-sub">{s.subject}</span>
                  <div className="tp-chips">
                    <span className={s.grade < 75 ? 'tp-chip tp-chip-red' : 'tp-chip'}>Grade {s.grade}%</span>
                    <span className={s.attendance < 85 ? 'tp-chip tp-chip-red' : 'tp-chip'}>
                      Attendance {s.attendance}%
                    </span>
                  </div>
                </div>
                <span className={badgeClass(s.flag)}>{s.flag}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="tp-card">
          <div className="tp-card-head">
            <h2 className="tp-card-title">Recent Activity</h2>
            <button type="button" className="tp-link" onClick={() => onNavigate('concerns')}>
              View concerns
            </button>
          </div>
          <div className="tp-timeline">
            {activity.map((a) => (
              <div key={a.id} className="tp-event">
                <span className={`tp-event-dot tp-dot-${a.status.toLowerCase()}`} />
                <div className="tp-event-body">
                  <strong className="tp-row-title">{a.title}</strong>
                  <span className="tp-row-sub">{a.text}</span>
                  <span className="tp-row-time">{a.time}</span>
                </div>
                <span className={badgeClass(a.status)}>{a.status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export default Dashboard
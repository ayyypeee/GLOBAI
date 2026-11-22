import {
  studentProfile,
  subjects,
  overallGrade,
  attendance,
  upcomingQuizzes,
  notifications,
  gradeTrend,
} from '../mockData';

function ProgressRing({ value, size = 120, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="sp-ring-wrap" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`Overall grade ${clamped}%`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3B82F6"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="sp-ring-value">
        <span className="sp-ring-number">{clamped}%</span>
        <span className="sp-ring-label">Grade</span>
      </div>
    </div>
  );
}

function GradeTrendChart({ data }) {
  const width = 520;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 36, left: 36 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const minY = 70;
  const maxY = 100;
  const stepX = data.length > 1 ? chartW / (data.length - 1) : chartW;

  const points = data.map((d, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + chartH - ((d.average - minY) / (maxY - minY)) * chartH;
    return { x, y, ...d };
  });
  const line = points.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `${points[0]?.x ?? padding.left},${padding.top + chartH} ${line} ${
    points[points.length - 1]?.x ?? padding.left + chartW
  },${padding.top + chartH}`;

  return (
    <div className="sp-chart-wrap">
      <svg
        className="sp-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Grade trend line chart"
      >
        {[70, 80, 90, 100].map((tick) => {
          const y = padding.top + chartH - ((tick - minY) / (maxY - minY)) * chartH;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#64748b">
                {tick}
              </text>
            </g>
          );
        })}
        <polygon points={area} fill="rgba(59,130,246,0.12)" />
        <polyline
          points={line}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p) => (
          <g key={p.term}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#1E3A8A" stroke="#ffffff" strokeWidth="2" />
            <text x={p.x} y={height - 12} textAnchor="middle" fontSize="12" fill="#64748b">
              {p.term}
            </text>
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#1E3A8A"
              fontWeight="600"
            >
              {p.average}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function statusPillClass(status) {
  if (status === 'good' || status === 'upcoming') return 'good';
  if (status === 'pending' || status === 'late') return 'pending';
  return 'failed';
}

function Dashboard({ user }) {
  const displayName = user?.fullname || user?.name || studentProfile.name;
  const firstName = displayName.split(' ')[0] || 'Student';
  const recent = notifications.slice(0, 3);

  return (
    <>
      <div>
        <h1 className="sp-page-title">Good day, {firstName}!</h1>
        <p className="sp-page-subtitle">Here&apos;s your academic overview for this semester.</p>
      </div>

      <div className="sp-grid sp-grid-top">
        <section className="sp-card" aria-label="Overall grade">
          <div className="sp-card-header">
            <h2 className="sp-card-title">Overall Grade</h2>
            <span className={`sp-pill ${overallGrade.value >= 75 ? 'good' : 'failed'}`}>
              {overallGrade.value >= 75 ? 'Good Standing' : 'At Risk'}
            </span>
          </div>
          <div className="sp-overall">
            <ProgressRing value={overallGrade.value} />
            <div className="sp-overall-meta">
              <div className="sp-item-title">{overallGrade.label}</div>
              <div className="sp-muted">{overallGrade.note}</div>
              <div className="sp-muted">Student: {displayName}</div>
            </div>
          </div>
        </section>

        <section className="sp-card" aria-label="Attendance rate">
          <div className="sp-card-header">
            <h2 className="sp-card-title">Attendance Rate</h2>
            <span
              className={`sp-pill ${
                attendance.rate >= 90 ? 'good' : attendance.rate >= 80 ? 'pending' : 'failed'
              }`}
            >
              {attendance.rate}% rate
            </span>
          </div>
          <div className="sp-grade-big">{attendance.rate}%</div>
          <div className="sp-muted">Attendance across all subjects</div>
          <div className="sp-stat-grid">
            <div className="sp-stat">
              <span className="sp-stat-value">{attendance.present}</span>
              <span className="sp-stat-label">Present</span>
            </div>
            <div className="sp-stat">
              <span className="sp-stat-value">{attendance.late}</span>
              <span className="sp-stat-label">Late</span>
            </div>
            <div className="sp-stat">
              <span className="sp-stat-value">{attendance.absent}</span>
              <span className="sp-stat-label">Absent</span>
            </div>
          </div>
          <div className="sp-muted" style={{ marginTop: '10px' }}>
            {attendance.present} of {attendance.total} sessions attended
          </div>
        </section>

        <section className="sp-card" aria-label="Upcoming quizzes">
          <div className="sp-card-header">
            <h2 className="sp-card-title">Upcoming Quizzes</h2>
          </div>
          <ul className="sp-list">
            {upcomingQuizzes.map((quiz) => (
              <li key={quiz.id} className="sp-list-item">
                <div className="sp-item-main">
                  <span className="sp-item-title">{quiz.title}</span>
                  <span className="sp-item-meta">{quiz.subject}</span>
                  <span className="sp-item-meta">
                    {quiz.date} · {quiz.time}
                  </span>
                </div>
                <span className={`sp-pill ${statusPillClass(quiz.status)}`}>
                  {quiz.status === 'late' ? 'Late' : 'Upcoming'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="sp-card" aria-label="Subject cards">
        <div className="sp-card-header">
          <h2 className="sp-card-title">Subject Cards &amp; Partial Grades</h2>
        </div>
        <div className="sp-subjects">
          {subjects.map((subject) => (
            <article key={subject.id} className="sp-subject-card">
              <h3 className="sp-subject-name">{subject.name}</h3>
              <p className="sp-subject-instructor">Instructor: {subject.instructor}</p>
              <div className="sp-grade-row">
                <span className="sp-grade-big">{subject.overall}%</span>
                <span className={`sp-pill ${statusPillClass(subject.status)}`}>
                  {subject.status === 'good' ? 'Good' : 'Pending'}
                </span>
              </div>
              <div className="sp-partials">
                {subject.partials.map((part) => (
                  <div key={part.label} className="sp-partial">
                    <span>{part.label}</span>
                    <div className="sp-bar">
                      <div className="sp-bar-fill" style={{ width: `${part.grade}%` }} />
                    </div>
                    <span>{part.grade}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="sp-grid sp-grid-bottom">
        <section className="sp-card" aria-label="Grade trend">
          <div className="sp-card-header">
            <h2 className="sp-card-title">Grade Trend</h2>
            <span className="sp-muted">Term averages</span>
          </div>
          <GradeTrendChart data={gradeTrend} />
        </section>

        <section className="sp-card" aria-label="Recent notifications">
          <div className="sp-card-header">
            <h2 className="sp-card-title">Recent Notifications</h2>
          </div>
          <ul className="sp-list">
            {recent.map((note) => (
              <li key={note.id} className="sp-list-item">
                <div className="sp-item-main">
                  <span className="sp-item-title">{note.title}</span>
                  <span className="sp-item-meta">{note.message}</span>
                  <span className="sp-item-meta">{note.time}</span>
                </div>
                <span className={`sp-pill ${statusPillClass(note.type)}`}>
                  {note.unread ? 'New' : 'Read'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default Dashboard;

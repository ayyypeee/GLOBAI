import {
  dashboardStats,
  classPerformance,
  attendanceTrend,
  studentsAtRisk,
  recentActivity,
} from '../mockData';

function ClassPerformanceChart({ data }) {
  const width = 520;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 56, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxY = 100;
  const barGap = 18;
  const barWidth = data.length > 0 ? (chartW - barGap * (data.length - 1)) / data.length : chartW;

  return (
    <div className="tp-chart-wrap">
      <svg
        className="tp-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Class performance bar chart"
      >
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = padding.top + chartH - (tick / maxY) * chartH;
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
        {data.map((item, index) => {
          const x = padding.left + index * (barWidth + barGap);
          const barH = (item.average / maxY) * chartH;
          const y = padding.top + chartH - barH;
          return (
            <g key={item.subject}>
              <rect x={x} y={y} width={barWidth} height={barH} rx="8" fill="#3B82F6" />
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="#1E3A8A"
              >
                {item.average}%
              </text>
              <text
                x={x + barWidth / 2}
                y={height - 28}
                textAnchor="middle"
                fontSize="11"
                fill="#334155"
              >
                {item.subject}
              </text>
              <text
                x={x + barWidth / 2}
                y={height - 12}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
              >
                {item.students} students
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function AttendanceTrendChart({ data }) {
  const width = 520;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const minY = 80;
  const maxY = 100;
  const stepX = data.length > 1 ? chartW / (data.length - 1) : chartW;

  const points = data.map((d, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + chartH - ((d.rate - minY) / (maxY - minY)) * chartH;
    return { x, y, ...d };
  });
  const line = points.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `${points[0]?.x ?? padding.left},${padding.top + chartH} ${line} ${
    points[points.length - 1]?.x ?? padding.left + chartW
  },${padding.top + chartH}`;

  return (
    <div className="tp-chart-wrap">
      <svg
        className="tp-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Attendance trend line chart"
      >
        {[80, 85, 90, 95, 100].map((tick) => {
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
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#1E3A8A" stroke="#ffffff" strokeWidth="2" />
            <text x={p.x} y={height - 14} textAnchor="middle" fontSize="11" fill="#64748b">
              {p.label}
            </text>
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#1E3A8A"
              fontWeight="600"
            >
              {p.rate}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function statusPillClass(status) {
  if (status === 'good') return 'good';
  if (status === 'pending' || status === 'late') return 'pending';
  return 'failed';
}

function Dashboard({ user }) {
  const displayName = user?.fullname || user?.name || user?.username || 'Teacher';
  const firstName = displayName.split(' ')[0] || 'Teacher';

  return (
    <>
      <div>
        <h1 className="tp-page-title">Welcome back, {firstName}!</h1>
        <p className="tp-page-subtitle">Monitor your classes, attendance, and student concerns at a glance.</p>
      </div>

      <div className="tp-grid tp-stats-grid">
        <section className="tp-card tp-stat-card" aria-label="Total students">
          <span className="tp-stat-label">Total Students</span>
          <span className="tp-stat-value">{dashboardStats.totalStudents}</span>
          <span className="tp-stat-note">Across all active classes</span>
        </section>
        <section className="tp-card tp-stat-card" aria-label="Class average">
          <span className="tp-stat-label">Class Average</span>
          <span className="tp-stat-value">{dashboardStats.classAverage}%</span>
          <span className="tp-stat-note">
            <span className="tp-pill good">Good standing</span>
          </span>
        </section>
        <section className="tp-card tp-stat-card" aria-label="Attendance rate">
          <span className="tp-stat-label">Attendance Rate</span>
          <span className="tp-stat-value">{dashboardStats.attendanceRate}%</span>
          <span className="tp-stat-note">
            <span className={`tp-pill ${dashboardStats.attendanceRate >= 90 ? 'good' : 'pending'}`}>
              {dashboardStats.attendanceRate >= 90 ? 'On target' : 'Needs attention'}
            </span>
          </span>
        </section>
        <section className="tp-card tp-stat-card" aria-label="Pending concerns">
          <span className="tp-stat-label">Pending Concerns</span>
          <span className="tp-stat-value">{dashboardStats.pendingConcerns}</span>
          <span className="tp-stat-note">
            <span className="tp-pill pending">Awaiting review</span>
          </span>
        </section>
      </div>

      <div className="tp-grid tp-grid-two">
        <section className="tp-card" aria-label="Class performance">
          <div className="tp-card-header">
            <h2 className="tp-card-title">Class Performance</h2>
            <span className="tp-muted">Average by subject</span>
          </div>
          <ClassPerformanceChart data={classPerformance} />
        </section>

        <section className="tp-card" aria-label="Attendance trend">
          <div className="tp-card-header">
            <h2 className="tp-card-title">Attendance Trend</h2>
            <span className="tp-muted">Weekly attendance rate</span>
          </div>
          <AttendanceTrendChart data={attendanceTrend} />
        </section>
      </div>

      <div className="tp-grid tp-grid-two">
        <section className="tp-card" aria-label="Students at risk">
          <div className="tp-card-header">
            <h2 className="tp-card-title">Students at Risk</h2>
            <span className="tp-pill failed">{studentsAtRisk.length} flagged</span>
          </div>
          <ul className="tp-list">
            {studentsAtRisk.map((student) => (
              <li key={student.id} className="tp-list-item">
                <div className="tp-item-main">
                  <span className="tp-item-title">{student.name}</span>
                  <span className="tp-item-meta">{student.subject}</span>
                  <span className="tp-item-meta">
                    Grade: {student.grade}% · Attendance: {student.attendance}%
                  </span>
                </div>
                <span className={`tp-pill ${statusPillClass(student.status)}`}>{student.issue}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="tp-card" aria-label="Recent activity">
          <div className="tp-card-header">
            <h2 className="tp-card-title">Recent Activity</h2>
          </div>
          <ul className="tp-list">
            {recentActivity.map((item) => (
              <li key={item.id} className="tp-list-item">
                <div className="tp-item-main">
                  <span className="tp-item-title">{item.title}</span>
                  <span className="tp-item-meta">{item.detail}</span>
                  <span className="tp-item-meta">{item.time}</span>
                </div>
                <span className={`tp-pill ${statusPillClass(item.status)}`}>
                  {item.status === 'good' ? 'Done' : item.status === 'late' ? 'Late' : 'Pending'}
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

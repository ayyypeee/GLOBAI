import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Stats, Table, Announcements } from '../components/Parts'
import { getDashboard, saveAttendance } from '../api'

const NAV = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'classes', label: 'My Classes', icon: 'users' },
  { key: 'grades', label: 'Grades', icon: 'grades' },
  { key: 'attendance', label: 'Attendance', icon: 'attendance' },
  { key: 'quizzes', label: 'Quizzes', icon: 'quiz' },
  { key: 'concerns', label: 'Grade Concerns', icon: 'concern' },
  { key: 'announcements', label: 'Announcements', icon: 'announce' },
]

const classCols = [
  { key: 'code', label: 'Course' },
  { key: 'title', label: 'Title' },
  { key: 'section', label: 'Section' },
  { key: 'students', label: 'Students' },
]
const gradeCols = [
  { key: 'code', label: 'Course' },
  { key: 'title', label: 'Title' },
  { key: 'average', label: 'Class average' },
  { key: 'missing', label: 'Missing grades' },
]
const quizCols = [
  { key: 'title', label: 'Quiz' },
  { key: 'course', label: 'Course' },
  { key: 'due', label: 'Closes' },
  { key: 'status', label: 'Status' },
]
const concernCols = [
  { key: 'student', label: 'Student' },
  { key: 'course', label: 'Course' },
  { key: 'subject', label: 'Concern' },
  { key: 'status', label: 'Status' },
]
const SAMPLE_ROSTERS = {
  CSIT321: [
    { id: '2026001', name: 'Cyberg Jay Monterroyo' },
    { id: '2026002', name: 'Ai-p Villanueva' },
    { id: '2000000',  name: 'Student'},
  ],
  CSIT327: [
    { id: '2026003', name: 'Kyle Aranas' },
    { id: '2026004', name: 'Ai-p Villanueva' },
    { id: '2000000',  name: 'Student'},
  ],
  CSIT340: [
    { id: '2026005', name: 'Kyle Aranas' },
    { id: '2026006', name: 'Cyberg Jay Monterroyo' },
    { id: '2000000',  name: 'Student'},
  ],
}

function AttendanceChecker({ course, onBack }) {
  const [attendance, setAttendance] = useState({})
  const [date, setDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')
  const students = SAMPLE_ROSTERS[course.code] || []

  const handleSave = async () => {
    setError('')
    setSavedMessage('')
    if (!date) {
      setError('Choose an attendance date before saving.')
      return
    }
    if (students.some((student) => !attendance[student.id])) {
      setError('Select an attendance status for every student before saving.')
      return
    }

    setSaving(true)
    try {
      await saveAttendance(
        course.code,
        date,
        students.map((student) => ({
          studentId: student.id,
          studentName: student.name,
          status: attendance[student.id],
        })),
      )
      setSavedMessage('Attendance saved. Students can now view their status.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button type="button" className="back-btn" onClick={onBack}>
        Back to courses
      </button>

      <h1>Attendance checker</h1>
      <p><strong>{course.code}</strong> — {course.title}</p>

      <div className="attendance-date">
        <label htmlFor="attendance-date">Date</label>
        <input
          id="attendance-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      <p className="attendance-note">
        Saved attendance is kept in memory and will be cleared when the backend restarts.
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student name</th>
              <th>ID number</th>
              <th>Attendance status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.id}</td>
                <td>
                  <div className="attendance-options">
                    {['Present', 'Absent', 'Excused', 'Late'].map((status) => (
                      <label key={status}>
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          checked={attendance[student.id] === status}
                          onChange={() =>
                            setAttendance((current) => ({
                              ...current,
                              [student.id]: status,
                            }))
                          }
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {savedMessage && <p className="success-msg">{savedMessage}</p>}
      <button type="button" className="save-attendance-btn" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save attendance'}
      </button>
    </>
  )
}
export default function StaffDashboard({ user, onLogout }) {
  const [view, setView] = useState('home')
  const [selectedAttendanceCourse, setSelectedAttendanceCourse] = useState(null)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard('staff').then(setData).catch((e) => setError(e.message))
  }, [])

  let body = <p className="empty">Loading...</p>
  if (error) {
    body = <p className="empty">{error}. Is the backend running on port 8080?</p>
  } else if (data) {
    const s = data.summary
    body = {
      home: (
        <>
          <h1>Welcome, {user.name}!</h1>
          <Stats items={[
            { label: 'Classes', value: s.classes },
            { label: 'Students', value: s.students },
            { label: 'Published quizzes', value: s.activeQuizzes },
            { label: 'Concerns to review', value: s.openConcerns },
          ]} />
          <h2>Concerns waiting for a response</h2>
          <Table
            cols={concernCols}
            rows={data.concerns.filter((c) => c.status !== 'Resolved')}
            empty="No concerns to review."
          />
          <h2>My classes</h2>
          <Table cols={classCols} rows={data.classes} />
        </>
      ),
      classes: <><h1>My classes</h1><Table cols={classCols} rows={data.classes} /></>,
      grades: <><h1>Grades</h1><Table cols={gradeCols} rows={data.classes} /></>,
      attendance: selectedAttendanceCourse ? (
        <AttendanceChecker
          key={selectedAttendanceCourse.code}
          course={selectedAttendanceCourse}
          onBack={() => setSelectedAttendanceCourse(null)}
        />
      ) : (
        <>
          <h1>Attendance</h1>
          <div className="attendance-course-grid">
            {data.classes.map((course) => (
              <button
                key={course.code}
                type="button"
                className="attendance-course-card"
                onClick={() => setSelectedAttendanceCourse(course)}
              >
                <strong>{course.code}</strong>
                <span>{course.title}</span>
                <small>Attendance rate: {course.attendance}</small>
              </button>
            ))}
          </div>
        </>
      ),
      quizzes: <><h1>Quizzes</h1><Table cols={quizCols} rows={data.quizzes} /></>,
      concerns: <><h1>Grade concerns</h1><Table cols={concernCols} rows={data.concerns} /></>,
      announcements: <><h1>Announcements</h1><Announcements items={data.announcements} /></>,
    }[view]
  }

  return (
    <DashboardLayout
      user={user} nav={NAV} active={view} onNav={setView}
      onLogout={onLogout} title="Staff Home"
    >
      {body}
    </DashboardLayout>
  )
}
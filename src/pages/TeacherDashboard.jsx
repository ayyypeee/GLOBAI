import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Stats, Table, Announcements } from '../components/Parts'
import { getDashboard } from '../api'

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
const attCols = [
  { key: 'code', label: 'Course' },
  { key: 'title', label: 'Title' },
  { key: 'attendance', label: 'Attendance rate' },
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

export default function TeacherDashboard({ user, onLogout }) {
  const [view, setView] = useState('home')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard('teacher').then(setData).catch((e) => setError(e.message))
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
      attendance: <><h1>Attendance</h1><Table cols={attCols} rows={data.classes} /></>,
      quizzes: <><h1>Quizzes</h1><Table cols={quizCols} rows={data.quizzes} /></>,
      concerns: <><h1>Grade concerns</h1><Table cols={concernCols} rows={data.concerns} /></>,
      announcements: <><h1>Announcements</h1><Announcements items={data.announcements} /></>,
    }[view]
  }

  return (
    <DashboardLayout
      user={user} nav={NAV} active={view} onNav={setView}
      onLogout={onLogout} title="Teacher Home"
    >
      {body}
    </DashboardLayout>
  )
}
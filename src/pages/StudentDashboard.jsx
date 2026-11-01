import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Stats, Table, Announcements } from '../components/Parts'
import { getDashboard } from '../api'

const NAV = [
  { key: 'home', label: 'Home', icon: 'home' },
  {
    key: 'academics', label: 'My Academics', icon: 'book',
    children: [
      { key: 'grades', label: 'Grades' },
      { key: 'attendance', label: 'Attendance' },
    ],
  },
  { key: 'quizzes', label: 'Quizzes', icon: 'quiz' },
  { key: 'concerns', label: 'Grade Concerns', icon: 'concern' },
  { key: 'announcements', label: 'Announcements', icon: 'announce' },
]

const gradeCols = [
  { key: 'code', label: 'Course' },
  { key: 'title', label: 'Title' },
  { key: 'grade', label: 'Current grade' },
]
const attCols = [
  { key: 'code', label: 'Course' },
  { key: 'title', label: 'Title' },
  { key: 'attendance', label: 'Attendance' },
]
const quizCols = [
  { key: 'title', label: 'Quiz' },
  { key: 'course', label: 'Course' },
  { key: 'due', label: 'Due' },
  { key: 'status', label: 'Status' },
  { key: 'score', label: 'Score' },
]
const concernCols = [
  { key: 'course', label: 'Course' },
  { key: 'subject', label: 'Concern' },
  { key: 'status', label: 'Status' },
]

export default function StudentDashboard({ user, onLogout }) {
  const [view, setView] = useState('home')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard('student').then(setData).catch((e) => setError(e.message))
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
            { label: 'Overall average', value: s.average },
            { label: 'Attendance rate', value: s.attendanceRate },
            { label: 'Quizzes to take', value: s.pendingQuizzes },
            { label: 'Open grade concerns', value: s.openConcerns },
          ]} />
          <h2>My courses</h2>
          <Table cols={[...gradeCols, { key: 'attendance', label: 'Attendance' }]} rows={data.courses} />
          <h2>Latest announcements</h2>
          <Announcements items={data.announcements} />
        </>
      ),
      grades: <><h1>Grades</h1><Table cols={gradeCols} rows={data.courses} /></>,
      attendance: <><h1>Attendance</h1><Table cols={attCols} rows={data.courses} /></>,
      quizzes: <><h1>Quizzes</h1><Table cols={quizCols} rows={data.quizzes} /></>,
      concerns: <><h1>Grade concerns</h1><Table cols={concernCols} rows={data.concerns} empty="You have not submitted any concerns." /></>,
      announcements: <><h1>Announcements</h1><Announcements items={data.announcements} /></>,
    }[view]
  }

  return (
    <DashboardLayout
      user={user} nav={NAV} active={view} onNav={setView}
      onLogout={onLogout} title="Student Home"
    >
      {body}
    </DashboardLayout>
  )
}
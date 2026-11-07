import { useState } from 'react'
import StudentDashboard from './StudentDashboard'
import TeacherDashboard from './TeacherDashboard'

// Demo users, so the admin can see what each role sees
const DEMO_STUDENT = {
  name: 'Student (preview)',
  email: 'student@school.edu',
  role: 'STUDENT',
  studentId: '2026001',
}

const DEMO_TEACHER = {
  name: 'Teacher (preview)',
  email: 'teacher@school.edu',
  role: 'TEACHER',
}

export default function AdminDashboard({ onLogout }) {
  const [view, setView] = useState('student')

  return (
    <>
      {view === 'student' ? (
        <StudentDashboard user={DEMO_STUDENT} onLogout={onLogout} />
      ) : (
        <TeacherDashboard user={DEMO_TEACHER} onLogout={onLogout} />
      )}

      <div className="admin-switch">
        <span>Admin preview</span>
        <button
          type="button"
          className={view === 'student' ? 'active' : ''}
          onClick={() => setView('student')}
        >
          Student view
        </button>
        <button
          type="button"
          className={view === 'teacher' ? 'active' : ''}
          onClick={() => setView('teacher')}
        >
          Teacher view
        </button>
      </div>
    </>
  )
}
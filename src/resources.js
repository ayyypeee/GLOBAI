import { users, students, teachers, courses, enrollments } from './api'

const ROLES = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'TEACHER', label: 'Teacher' },
]

const userOptions = (list = [], role) =>
  list
    .filter((u) => u.role === role)
    .map((u) => ({ value: u.userid, label: `${u.fullname} (${u.username})` }))

const studentOptions = (list = []) =>
  list.map((s) => ({ value: s.studentid, label: `${s.user.fullname} - ${s.program}` }))

const teacherOptions = (list = []) =>
  list.map((t) => ({ value: t.teacherid, label: `${t.user.fullname} - ${t.department}` }))

const courseOptions = (list = []) =>
  list.map((c) => ({ value: c.coursecode, label: `${c.coursecode} - ${c.title}` }))

const usersPage = {
  key: 'users',
  title: 'Users',
  noun: 'User',
  roles: ['TEACHER'],
  api: users,
  idOf: (row) => row.userid,
  canDelete: (row, user) => row.userid !== user.userid,
  columns: [
    { label: 'ID', value: (r) => r.userid },
    { label: 'Full name', value: (r) => r.fullname },
    { label: 'Username', value: (r) => r.username },
    { label: 'Email', value: (r) => r.email },
    { label: 'Role', value: (r) => r.role },
  ],
  fields: [
    { key: 'fullname', label: 'Full name', type: 'text', lockOnEdit: true },
    { key: 'username', label: 'Username', type: 'text', lockOnEdit: true },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'password', label: 'Password (at least 6 characters)', type: 'password', createOnly: true },
    { key: 'role', label: 'Role', type: 'select', lockOnEdit: true, options: () => ROLES },
  ],
  blank: { fullname: '', username: '', email: '', password: '', role: '' },
  toForm: (r) => ({ fullname: r.fullname, username: r.username, email: r.email, password: '', role: r.role }),
  toPayload: (f) => f,
}

const studentsPage = {
  key: 'students',
  title: 'Students',
  noun: 'Student',
  roles: ['TEACHER'],
  api: students,
  lookups: { users: users.getAll },
  idOf: (row) => row.studentid,
  columns: [
    { label: 'ID', value: (r) => r.studentid },
    { label: 'Student', value: (r) => r.user.fullname },
    { label: 'Username', value: (r) => r.user.username },
    { label: 'Program', value: (r) => r.program },
    { label: 'Year level', value: (r) => r.yearlevel },
  ],
  fields: [
    { key: 'userid', label: 'User', type: 'select', lockOnEdit: true, options: (l) => userOptions(l.users, 'STUDENT') },
    { key: 'program', label: 'Program', type: 'text' },
    { key: 'yearlevel', label: 'Year level', type: 'number', min: 1, max: 6 },
  ],
  blank: { userid: '', program: '', yearlevel: '' },
  toForm: (r) => ({ userid: r.user.userid, program: r.program, yearlevel: r.yearlevel }),
  toPayload: (f) => ({ user: { userid: Number(f.userid) }, program: f.program, yearlevel: Number(f.yearlevel) }),
}

const teachersPage = {
  key: 'teachers',
  title: 'Teachers',
  noun: 'Teacher',
  roles: ['TEACHER'],
  api: teachers,
  lookups: { users: users.getAll },
  idOf: (row) => row.teacherid,
  columns: [
    { label: 'ID', value: (r) => r.teacherid },
    { label: 'Teacher', value: (r) => r.user.fullname },
    { label: 'Username', value: (r) => r.user.username },
    { label: 'Department', value: (r) => r.department },
  ],
  fields: [
    { key: 'userid', label: 'User', type: 'select', lockOnEdit: true, options: (l) => userOptions(l.users, 'TEACHER') },
    { key: 'department', label: 'Department', type: 'text' },
  ],
  blank: { userid: '', department: '' },
  toForm: (r) => ({ userid: r.user.userid, department: r.department }),
  toPayload: (f) => ({ user: { userid: Number(f.userid) }, department: f.department }),
}

const coursesPage = {
  key: 'courses',
  title: 'Courses',
  noun: 'Course',
  roles: ['TEACHER', 'STUDENT'],
  api: courses,
  lookups: { teachers: teachers.getAll },
  idOf: (row) => row.coursecode,
  columns: [
    { label: 'Code', value: (r) => r.coursecode },
    { label: 'Title', value: (r) => r.title },
    { label: 'Units', value: (r) => r.units },
    { label: 'Teacher', value: (r) => r.teacher.user.fullname },
  ],
  fields: [
    { key: 'coursecode', label: 'Course code', type: 'text', lockOnEdit: true },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'units', label: 'Units', type: 'number', min: 1, max: 6 },
    { key: 'teacherid', label: 'Teacher', type: 'select', options: (l) => teacherOptions(l.teachers) },
  ],
  blank: { coursecode: '', title: '', units: '', teacherid: '' },
  toForm: (r) => ({ coursecode: r.coursecode, title: r.title, units: r.units, teacherid: r.teacher.teacherid }),
  toPayload: (f) => ({
    coursecode: f.coursecode,
    title: f.title,
    units: Number(f.units),
    teacher: { teacherid: Number(f.teacherid) },
  }),
}

const enrollmentsPage = {
  key: 'enrollments',
  title: 'Enrollments',
  noun: 'Enrollment',
  roles: ['TEACHER', 'STUDENT'],
  api: enrollments,
  lookups: { students: students.getAll, courses: courses.getAll },
  idOf: (row) => row.enrollmentid,
  rowFilter: (row, user) => user.role === 'TEACHER' || row.student.user.userid === user.userid,
  columns: [
    { label: 'ID', value: (r) => r.enrollmentid },
    { label: 'Student', value: (r) => r.student.user.fullname },
    { label: 'Course', value: (r) => `${r.course.coursecode} - ${r.course.title}` },
    { label: 'Date enrolled', value: (r) => r.dateenrolled },
  ],
  fields: [
    { key: 'studentid', label: 'Student', type: 'select', options: (l) => studentOptions(l.students) },
    { key: 'coursecode', label: 'Course', type: 'select', options: (l) => courseOptions(l.courses) },
    { key: 'dateenrolled', label: 'Date enrolled', type: 'date', optional: true },
  ],
  blank: { studentid: '', coursecode: '', dateenrolled: '' },
  toForm: (r) => ({ studentid: r.student.studentid, coursecode: r.course.coursecode, dateenrolled: r.dateenrolled }),
  toPayload: (f) => ({
    student: { studentid: Number(f.studentid) },
    course: { coursecode: f.coursecode },
    dateenrolled: f.dateenrolled || null,
  }),
}

export const PAGES = [usersPage, studentsPage, teachersPage, coursesPage, enrollmentsPage]
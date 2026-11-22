export const notificationCount = 2

export const stats = [
  { key: 'students', icon: 'users', label: 'Total Students', value: '38', note: 'Across all active classes', tone: 'blue' },
  { key: 'average', icon: 'trend', label: 'Class Average', value: '85%', note: 'Good standing', tone: 'green' },
  { key: 'attendance', icon: 'check', label: 'Attendance Rate', value: '93%', note: 'On target', tone: 'green' },
  { key: 'concerns', icon: 'alert', label: 'Pending Concerns', value: '4', note: 'Awaiting review', tone: 'amber' },
]

export const classPerformance = [
  { name: 'Programming 1', average: 88, students: 14 },
  { name: 'Database Systems', average: 84, students: 12 },
  { name: 'Networking 2', average: 79, students: 12 },
]

export const attendanceTrend = [
  { label: 'Week 1', value: 96 },
  { label: 'Week 2', value: 94 },
  { label: 'Week 3', value: 91 },
  { label: 'Week 4', value: 93 },
  { label: 'Week 5', value: 92 },
  { label: 'Week 6', value: 94 },
]

export const atRisk = [
  { id: 1, name: 'Paolo Mendoza', subject: 'Networking 2', grade: 72, attendance: 84, flag: 'Low grade' },
  { id: 2, name: 'Angela Reyes', subject: 'Database Systems', grade: 74, attendance: 88, flag: 'Needs support' },
  { id: 3, name: 'Mark Villanueva', subject: 'Networking 2', grade: 76, attendance: 79, flag: 'Frequent absences' },
  { id: 4, name: 'Jessa Dizon', subject: 'Programming 1', grade: 75, attendance: 86, flag: 'Near failing' },
]

export const activity = [
  {
    id: 1,
    title: 'Grade concern submitted',
    text: 'Paolo Mendoza raised a concern for Networking 2 quiz results.',
    time: '30 minutes ago',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Attendance recorded',
    text: 'Database Systems attendance for Week 6 was saved.',
    time: '2 hours ago',
    status: 'Done',
  },
  {
    id: 3,
    title: 'Quiz results uploaded',
    text: 'Programming 1 · Arrays and Pointers Quiz scores published.',
    time: 'Yesterday',
    status: 'Done',
  },
  {
    id: 4,
    title: 'Late submission flagged',
    text: 'Mark Villanueva missed the Networking 2 subnetting activity.',
    time: '2 days ago',
    status: 'Late',
  },
]
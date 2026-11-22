export const teacherProfile = {
  name: 'Maria Santos',
  department: 'College of Information Technology',
};

export const dashboardStats = {
  totalStudents: 38,
  classAverage: 85,
  attendanceRate: 93,
  pendingConcerns: 4,
};

export const classPerformance = [
  { subject: 'Programming 1', average: 88, students: 14 },
  { subject: 'Database Systems', average: 84, students: 12 },
  { subject: 'Networking 2', average: 79, students: 12 },
];

export const attendanceTrend = [
  { label: 'Week 1', rate: 96 },
  { label: 'Week 2', rate: 94 },
  { label: 'Week 3', rate: 91 },
  { label: 'Week 4', rate: 93 },
  { label: 'Week 5', rate: 92 },
  { label: 'Week 6', rate: 94 },
];

export const studentsAtRisk = [
  {
    id: 's1',
    name: 'Paolo Mendoza',
    subject: 'Networking 2',
    grade: 72,
    attendance: 84,
    issue: 'Low grade',
    status: 'failed',
  },
  {
    id: 's2',
    name: 'Angela Reyes',
    subject: 'Database Systems',
    grade: 74,
    attendance: 88,
    issue: 'Needs support',
    status: 'pending',
  },
  {
    id: 's3',
    name: 'Mark Villanueva',
    subject: 'Networking 2',
    grade: 76,
    attendance: 79,
    issue: 'Frequent absences',
    status: 'absent',
  },
  {
    id: 's4',
    name: 'Jessa Dizon',
    subject: 'Programming 1',
    grade: 75,
    attendance: 86,
    issue: 'Near failing',
    status: 'pending',
  },
];

export const recentActivity = [
  {
    id: 'a1',
    title: 'Grade concern submitted',
    detail: 'Paolo Mendoza raised a concern for Networking 2 quiz results.',
    time: '30 minutes ago',
    status: 'pending',
  },
  {
    id: 'a2',
    title: 'Attendance recorded',
    detail: 'Database Systems attendance for Week 6 was saved.',
    time: '2 hours ago',
    status: 'good',
  },
  {
    id: 'a3',
    title: 'Quiz results uploaded',
    detail: 'Programming 1 - Arrays and Pointers Quiz scores published.',
    time: 'Yesterday',
    status: 'good',
  },
  {
    id: 'a4',
    title: 'Late submission flagged',
    detail: 'Mark Villanueva missed the Networking 2 subnetting activity.',
    time: '2 days ago',
    status: 'late',
  },
];

export const notifications = [
  {
    id: 'n1',
    title: 'Pending grade concerns',
    message: '4 concerns need your review.',
    time: 'Today',
    unread: true,
    type: 'pending',
  },
  {
    id: 'n2',
    title: 'Class performance update',
    message: 'Programming 1 class average improved to 88%.',
    time: 'Yesterday',
    unread: true,
    type: 'good',
  },
  {
    id: 'n3',
    title: 'Attendance reminder',
    message: 'Networking 2 attendance dipped below 90% in Week 3.',
    time: '3 days ago',
    unread: false,
    type: 'pending',
  },
];

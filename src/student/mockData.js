export const subjects = [
  {
    id: 'prog1',
    name: 'Programming 1',
    instructor: 'Mr. Santos',
    grade: 91,
    status: 'Good',
    partials: [
      { label: 'Prelim', score: 89 },
      { label: 'Midterm', score: 92 },
      { label: 'Finals', score: 92 },
    ],
  },
  {
    id: 'db',
    name: 'Database Systems',
    instructor: 'Ms. Reyes',
    grade: 87,
    status: 'Good',
    partials: [
      { label: 'Prelim', score: 85 },
      { label: 'Midterm', score: 88 },
      { label: 'Finals', score: 88 },
    ],
  },
  {
    id: 'net2',
    name: 'Networking 2',
    instructor: 'Engr. Garcia',
    grade: 78,
    status: 'Pending',
    partials: [
      { label: 'Prelim', score: 76 },
      { label: 'Midterm', score: 79 },
      { label: 'Finals', score: 79 },
    ],
  },
]

export const attendance = { present: 47, late: 2, absent: 1, total: 50, rate: 94 }

export const quizzes = [
  {
    id: 1,
    title: 'Arrays and Pointers Quiz',
    subject: 'Programming 1',
    when: 'Nov 25, 2026 · 9:00 AM',
    status: 'Upcoming',
  },
  {
    id: 2,
    title: 'Normalization Drill',
    subject: 'Database Systems',
    when: 'Nov 27, 2026 · 1:30 PM',
    status: 'Upcoming',
  },
  {
    id: 3,
    title: 'Subnetting Practical',
    subject: 'Networking 2',
    when: 'Nov 20, 2026 · 10:00 AM',
    status: 'Missed',
  },
]

export const notifications = [
  {
    id: 1,
    title: 'Midterm grades posted',
    text: 'Your Programming 1 midterm grade is now available.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Quiz reminder',
    text: 'Arrays and Pointers Quiz is scheduled on Nov 25, 9:00 AM.',
    time: 'Today',
    unread: true,
  },
  {
    id: 3,
    title: 'Attendance notice',
    text: 'You were marked late in Networking 2 last Tuesday.',
    time: 'Yesterday',
    unread: false,
  },
]

export const gradeTrend = [
  { label: 'Prelim', value: 83 },
  { label: 'Midterm', value: 86 },
  { label: 'Prefinal', value: 84 },
  { label: 'Finals', value: 85 },
]
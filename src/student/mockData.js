export const studentProfile = {
  name: 'Juan Dela Cruz',
  studentId: '2024-00123',
  course: 'BS Information Technology',
  year: '2nd Year',
};

export const subjects = [
  {
    id: 'prog1',
    name: 'Programming 1',
    instructor: 'Mr. Santos',
    overall: 91,
    status: 'good',
    partials: [
      { label: 'Prelim', grade: 89 },
      { label: 'Midterm', grade: 92 },
      { label: 'Finals', grade: 92 },
    ],
  },
  {
    id: 'dbsys',
    name: 'Database Systems',
    instructor: 'Ms. Reyes',
    overall: 87,
    status: 'good',
    partials: [
      { label: 'Prelim', grade: 85 },
      { label: 'Midterm', grade: 88 },
      { label: 'Finals', grade: 88 },
    ],
  },
  {
    id: 'net2',
    name: 'Networking 2',
    instructor: 'Engr. Garcia',
    overall: 78,
    status: 'pending',
    partials: [
      { label: 'Prelim', grade: 76 },
      { label: 'Midterm', grade: 79 },
      { label: 'Finals', grade: 79 },
    ],
  },
];

export const overallGrade = {
  value: 85,
  label: 'Overall Average',
  note: 'On track for the semester',
};

export const attendance = {
  rate: 94,
  present: 47,
  total: 50,
  late: 2,
  absent: 1,
};

export const upcomingQuizzes = [
  {
    id: 'q1',
    title: 'Arrays and Pointers Quiz',
    subject: 'Programming 1',
    date: 'Nov 25, 2026',
    time: '9:00 AM',
    status: 'upcoming',
  },
  {
    id: 'q2',
    title: 'Normalization Drill',
    subject: 'Database Systems',
    date: 'Nov 27, 2026',
    time: '1:30 PM',
    status: 'upcoming',
  },
  {
    id: 'q3',
    title: 'Subnetting Practical',
    subject: 'Networking 2',
    date: 'Nov 20, 2026',
    time: '10:00 AM',
    status: 'late',
  },
];

export const notifications = [
  {
    id: 'n1',
    title: 'Midterm grades posted',
    message: 'Your Programming 1 midterm grade is now available.',
    time: '2 hours ago',
    unread: true,
    type: 'good',
  },
  {
    id: 'n2',
    title: 'Quiz reminder',
    message: 'Arrays and Pointers Quiz is scheduled on Nov 25, 9:00 AM.',
    time: 'Today',
    unread: true,
    type: 'pending',
  },
  {
    id: 'n3',
    title: 'Attendance notice',
    message: 'You were marked late in Networking 2 last Tuesday.',
    time: 'Yesterday',
    unread: false,
    type: 'pending',
  },
  {
    id: 'n4',
    title: 'Grade concern update',
    message: 'Your concern for Database Systems is under review.',
    time: '3 days ago',
    unread: false,
    type: 'good',
  },
];

export const gradeTrend = [
  { term: 'Prelim', average: 83 },
  { term: 'Midterm', average: 86 },
  { term: 'Prefinal', average: 84 },
  { term: 'Finals', average: 85 },
];

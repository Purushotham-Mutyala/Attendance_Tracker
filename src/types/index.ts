// Type definitions for the application

export interface User {
  id: string;
  username: string;
  rollNumber: string;
  year: number;
  course: string;
  section: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  totalClasses: number;
  attendedClasses: number;
  schedule: ClassSchedule[];
}

export interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent' | 'excused';
}

export interface MassBunkPoll {
  id: string;
  courseId: string;
  date: string;
  creatorId: string;
  description: string;
  votes: Vote[];
}

export interface Vote {
  userId: string;
  status: 'yes' | 'no' | 'maybe';
}

export interface Friend {
  id: string;
  username: string;
  rollNumber: string;
  year: number;
  course: string;
  section: string;
  status: 'pending' | 'accepted';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}
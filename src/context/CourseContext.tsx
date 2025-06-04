import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, AttendanceRecord } from '../types';
import { useAuth } from './AuthContext';

interface CourseContextType {
  courses: Course[];
  attendanceRecords: AttendanceRecord[];
  isLoading: boolean;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  markAttendance: (courseId: string, date: string, status: 'present' | 'absent' | 'excused') => Promise<void>;
  getAttendancePercentage: (courseId: string) => number;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider = ({ children }: CourseProviderProps) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load courses from localStorage
    if (user) {
      const storedCourses = localStorage.getItem(`courses-${user.id}`);
      const storedAttendance = localStorage.getItem(`attendance-${user.id}`);
      
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      } else {
        // Mock data for demonstration
        const mockCourses: Course[] = [
          {
            id: '1',
            code: 'CS101',
            name: 'Introduction to Programming',
            instructor: 'Dr. Smith',
            totalClasses: 30,
            attendedClasses: 25,
            schedule: [
              { day: 'Monday', startTime: '10:00', endTime: '11:30', room: 'CS-301' },
              { day: 'Wednesday', startTime: '10:00', endTime: '11:30', room: 'CS-301' }
            ]
          },
          {
            id: '2',
            code: 'CS201',
            name: 'Data Structures',
            instructor: 'Dr. Johnson',
            totalClasses: 30,
            attendedClasses: 22,
            schedule: [
              { day: 'Tuesday', startTime: '13:00', endTime: '14:30', room: 'CS-302' },
              { day: 'Thursday', startTime: '13:00', endTime: '14:30', room: 'CS-302' }
            ]
          }
        ];
        setCourses(mockCourses);
        localStorage.setItem(`courses-${user.id}`, JSON.stringify(mockCourses));
      }
      
      if (storedAttendance) {
        setAttendanceRecords(JSON.parse(storedAttendance));
      }
    }
    setIsLoading(false);
  }, [user]);

  const addCourse = async (courseData: Omit<Course, 'id'>) => {
    if (!user) return;
    
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
    };
    
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    localStorage.setItem(`courses-${user.id}`, JSON.stringify(updatedCourses));
  };

  const updateCourse = async (updatedCourse: Course) => {
    if (!user) return;
    
    const updatedCourses = courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    );
    
    setCourses(updatedCourses);
    localStorage.setItem(`courses-${user.id}`, JSON.stringify(updatedCourses));
  };

  const deleteCourse = async (id: string) => {
    if (!user) return;
    
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem(`courses-${user.id}`, JSON.stringify(updatedCourses));
    
    // Also delete related attendance records
    const updatedRecords = attendanceRecords.filter(record => record.courseId !== id);
    setAttendanceRecords(updatedRecords);
    localStorage.setItem(`attendance-${user.id}`, JSON.stringify(updatedRecords));
  };

  const markAttendance = async (courseId: string, date: string, status: 'present' | 'absent' | 'excused') => {
    if (!user) return;
    
    // Check if record already exists
    const existingRecordIndex = attendanceRecords.findIndex(
      record => record.courseId === courseId && record.date === date
    );
    
    let updatedRecords: AttendanceRecord[];
    
    if (existingRecordIndex !== -1) {
      // Update existing record
      updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        status
      };
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        courseId,
        date,
        status
      };
      updatedRecords = [...attendanceRecords, newRecord];
    }
    
    setAttendanceRecords(updatedRecords);
    localStorage.setItem(`attendance-${user.id}`, JSON.stringify(updatedRecords));
    
    // Update course attendance count
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const presentRecords = updatedRecords.filter(
        record => record.courseId === courseId && record.status === 'present'
      ).length;
      
      const updatedCourse = {
        ...course,
        attendedClasses: presentRecords
      };
      
      updateCourse(updatedCourse);
    }
  };

  const getAttendancePercentage = (courseId: string): number => {
    const course = courses.find(c => c.id === courseId);
    if (!course || course.totalClasses === 0) return 0;
    
    return Math.round((course.attendedClasses / course.totalClasses) * 100);
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        attendanceRecords,
        isLoading,
        addCourse,
        updateCourse,
        deleteCourse,
        markAttendance,
        getAttendancePercentage,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
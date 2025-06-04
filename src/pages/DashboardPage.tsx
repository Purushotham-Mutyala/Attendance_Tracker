import React, { useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import Calendar from '../components/ui/Calendar';
import CourseCard from '../components/CourseCard';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import NotificationBell from '../components/NotificationBell';
import { BarChart4, BookOpen, UserCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { courses, attendanceRecords, markAttendance, getAttendancePercentage } = useCourses();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { showToast } = useToast();
  
  const handleDateClick = (date: Date) => {
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(date);
      return;
    }
    setSelectedDate(date);
  };
  
  const overallAttendance = courses.length > 0
    ? Math.round(
        (courses.reduce((sum, course) => sum + course.attendedClasses, 0) /
        courses.reduce((sum, course) => sum + course.totalClasses, 0)) * 100
      )
    : 0;
  
  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getCurrentDayClasses = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    return courses.filter(course => 
      course.schedule.some(schedule => schedule.day === today)
    );
  };

  const isAttendanceMarked = (courseId: string, date: string) => {
    return attendanceRecords.some(record => 
      record.courseId === courseId && 
      record.date.split('T')[0] === date.split('T')[0]
    );
  };

  const handleMarkAttendance = async (courseId: string, date: string, status: 'present' | 'absent') => {
    if (isAttendanceMarked(courseId, date)) {
      showToast({
        title: 'Attendance already marked',
        description: 'You have already marked attendance for this class today',
        variant: 'error'
      });
      return;
    }

    try {
      await markAttendance(courseId, date, status);
      showToast({
        title: 'Attendance marked',
        description: `Marked as ${status} successfully`,
        variant: 'success'
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to mark attendance',
        variant: 'error'
      });
    }
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isMobile={isMobile} />
      
      <div className={`${isMobile ? 'pt-16 pl-0' : 'pl-16 lg:pl-64'} transition-all duration-300`}>
        <main className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.username}</p>
            </div>
            
            {!isMobile && <NotificationBell />}
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg mr-4">
                    <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Attendance</p>
                    <p className={`text-2xl font-bold ${getAttendanceColor(overallAttendance)}`}>
                      {overallAttendance}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg mr-4">
                    <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled Courses</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{courses.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-teal-100 dark:bg-teal-900/20 p-3 rounded-lg mr-4">
                    <BarChart4 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Attendance</p>
                    <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      {courses.length > 0
                        ? Math.max(...courses.map(course => getAttendancePercentage(course.id)))
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  month={currentMonth}
                  attendanceRecords={attendanceRecords}
                  onDateClick={handleDateClick}
                />
                
                {selectedDate && (
                  <div className="mt-6 border-t dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {selectedDate.toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h4>
                    
                    {/* Courses for selected date */}
                    <div className="space-y-3">
                      {courses.length > 0 ? (
                        courses.map(course => {
                          const dateStr = selectedDate.toISOString();
                          const isMarked = isAttendanceMarked(course.id, dateStr);
                          
                          return (
                            <div key={course.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium dark:text-white">{course.code}: {course.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {course.schedule[0]?.startTime} - {course.schedule[0]?.endTime}
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                                      isMarked
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40'
                                    }`}
                                    onClick={() => handleMarkAttendance(course.id, dateStr, 'present')}
                                    disabled={isMarked}
                                  >
                                    Present
                                  </button>
                                  <button
                                    className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                                      isMarked
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                        : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'
                                    }`}
                                    onClick={() => handleMarkAttendance(course.id, dateStr, 'absent')}
                                    disabled={isMarked}
                                  >
                                    Absent
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No courses scheduled</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Today's Classes */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getCurrentDayClasses().length > 0 ? (
                      getCurrentDayClasses().map(course => {
                        const today = new Date().toISOString();
                        const isMarked = isAttendanceMarked(course.id, today);
                        
                        return (
                          <div key={course.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md">
                            <div>
                              <p className="font-medium dark:text-white">{course.name}</p>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {course.schedule
                                  .filter(s => s.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }))
                                  .map((s, idx) => (
                                    <p key={idx}>{s.startTime} - {s.endTime} | Room {s.room}</p>
                                  ))
                                }
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                  isMarked
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40'
                                }`}
                                onClick={() => handleMarkAttendance(course.id, today, 'present')}
                                disabled={isMarked}
                              >
                                Present
                              </button>
                              <button
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                  isMarked
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'
                                }`}
                                onClick={() => handleMarkAttendance(course.id, today, 'absent')}
                                disabled={isMarked}
                              >
                                Absent
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">No classes scheduled for today</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Course Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.length > 0 ? (
                      courses.slice(0, 4).map(course => (
                        <CourseCard key={course.id} course={course} showDetails={false} />
                      ))
                    ) : (
                      <p className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-4">No courses added yet</p>
                    )}
                  </div>
                  {courses.length > 0 && (
                    <div className="mt-4 text-center">
                      <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                        View all courses
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
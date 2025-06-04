import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import Sidebar from '../components/ui/Sidebar';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import AttendancePieChart from '../components/AttendancePieChart';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, getAttendancePercentage } = useCourses();
  const course = courses.find(c => c.id === id);
  
  const isMobile = window.innerWidth < 768;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Course not found</h2>
          <Button onClick={() => navigate('/profile')}>Go back to Profile</Button>
        </div>
      </div>
    );
  }

  const attendanceData = {
    present: course.attendedClasses,
    absent: course.totalClasses - course.attendedClasses,
    total: course.totalClasses
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isMobile={isMobile} />
      
      <div className={`${isMobile ? 'pt-16 pl-0' : 'pl-16 lg:pl-64'} transition-all duration-300`}>
        <main className="p-4 md:p-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{course.code}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                      <p className="font-medium text-gray-900 dark:text-white">{course.instructor}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Classes</p>
                      <p className="font-medium text-gray-900 dark:text-white">{course.totalClasses}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Classes Attended</p>
                      <p className="font-medium text-gray-900 dark:text-white">{course.attendedClasses}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Attendance Percentage</p>
                      <p className={`font-medium ${
                        getAttendancePercentage(course.id) >= 75 
                          ? 'text-green-600 dark:text-green-400' 
                          : getAttendancePercentage(course.id) >= 60 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-red-600 dark:text-red-400'
                      }`}>
                        {getAttendancePercentage(course.id)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center mb-6">
                      <AttendancePieChart data={attendanceData} size={250} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Class Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.schedule.map((schedule, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                              <span className="text-gray-900 dark:text-white">{schedule.day}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                              <span className="text-gray-900 dark:text-white">
                                {schedule.startTime} - {schedule.endTime}
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                              <span className="text-gray-900 dark:text-white">Room {schedule.room}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
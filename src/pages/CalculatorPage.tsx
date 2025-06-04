import React, { useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import { useCourses } from '../context/CourseContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import AttendancePieChart from '../components/AttendancePieChart';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CalculatorPage: React.FC = () => {
  const { courses } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [customCalculation, setCustomCalculation] = useState({
    totalClasses: 0,
    attendedClasses: 0,
    targetPercentage: 75,
    futureTotalClasses: 0,
  });

  const calculateAttendance = (attended: number, total: number) => {
    if (total === 0) return 0;
    return (attended / total) * 100;
  };

  const calculateRequiredClasses = () => {
    const { attendedClasses, totalClasses, targetPercentage, futureTotalClasses } = customCalculation;
    
    // Calculate how many classes to attend out of future classes to reach target
    const totalFutureClasses = totalClasses + futureTotalClasses;
    const targetAttended = Math.ceil((targetPercentage / 100) * totalFutureClasses);
    const classesToAttend = targetAttended - attendedClasses;
    
    // Ensure result is not negative
    return Math.max(0, classesToAttend);
  };

  const getAttendanceData = () => {
    if (selectedCourse === 'all') {
      const totalClasses = courses.reduce((sum, course) => sum + course.totalClasses, 0);
      const attendedClasses = courses.reduce((sum, course) => sum + course.attendedClasses, 0);
      
      return {
        present: attendedClasses,
        absent: totalClasses - attendedClasses,
        total: totalClasses
      };
    } else {
      const course = courses.find(c => c.id === selectedCourse);
      if (!course) return { present: 0, absent: 0, total: 0 };
      
      return {
        present: course.attendedClasses,
        absent: course.totalClasses - course.attendedClasses,
        total: course.totalClasses
      };
    }
  };

  const getAttendanceRemark = (percentage: number) => {
    if (percentage >= 90) return 'Excellent! Keep up the good attendance.';
    if (percentage >= 75) return 'Good attendance. You\'re meeting the requirements.';
    if (percentage >= 60) return 'Warning: Your attendance is getting low.';
    return 'Critical: Your attendance is below the minimum requirement.';
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomCalculation({
      ...customCalculation,
      [name]: parseInt(value) || 0
    });
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    
    if (courseId === 'all') {
      const totalClasses = courses.reduce((sum, course) => sum + course.totalClasses, 0);
      const attendedClasses = courses.reduce((sum, course) => sum + course.attendedClasses, 0);
      
      setCustomCalculation({
        ...customCalculation,
        totalClasses,
        attendedClasses
      });
    } else {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setCustomCalculation({
          ...customCalculation,
          totalClasses: course.totalClasses,
          attendedClasses: course.attendedClasses
        });
      }
    }
  };

  const attendanceData = getAttendanceData();
  const currentPercentage = calculateAttendance(
    attendanceData.present, 
    attendanceData.total
  );
  const requiredClasses = calculateRequiredClasses();

  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isMobile={isMobile} />
      
      <div className={`${isMobile ? 'pt-16 pl-0' : 'pl-16 lg:pl-64'} transition-all duration-300`}>
        <main className="p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Attendance Calculator</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Course
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedCourse}
                      onChange={(e) => handleCourseSelect(e.target.value)}
                    >
                      <option value="all">All Courses</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.code}: {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Current Statistics</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="flex justify-between py-1">
                        <span className="text-gray-600">Total Classes:</span>
                        <span className="font-medium">{attendanceData.total}</span>
                      </p>
                      <p className="flex justify-between py-1">
                        <span className="text-gray-600">Attended:</span>
                        <span className="font-medium">{attendanceData.present}</span>
                      </p>
                      <p className="flex justify-between py-1">
                        <span className="text-gray-600">Missed:</span>
                        <span className="font-medium">{attendanceData.absent}</span>
                      </p>
                      <p className="flex justify-between py-1 border-t mt-1 pt-2">
                        <span className="text-gray-600">Current Percentage:</span>
                        <span 
                          className={`font-bold ${
                            currentPercentage >= 75 
                              ? 'text-green-600' 
                              : currentPercentage >= 60 
                                ? 'text-yellow-600' 
                                : 'text-red-600'
                          }`}
                        >
                          {currentPercentage.toFixed(1)}%
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Future Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      label="Target Attendance Percentage"
                      type="number"
                      name="targetPercentage"
                      min="0"
                      max="100"
                      value={customCalculation.targetPercentage}
                      onChange={handleCustomInputChange}
                    />
                    
                    <Input
                      label="Future Classes"
                      type="number"
                      name="futureTotalClasses"
                      min="0"
                      value={customCalculation.futureTotalClasses}
                      onChange={handleCustomInputChange}
                    />
                    
                    <div className="p-4 bg-blue-50 rounded-md mt-4">
                      <p className="text-blue-800 font-medium">Required Classes</p>
                      <p className="text-3xl font-bold text-blue-700 mt-1">
                        {requiredClasses}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        You need to attend <strong>{requiredClasses}</strong> out of the next{' '}
                        <strong>{customCalculation.futureTotalClasses}</strong> classes to reach your target.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-6">
                    <AttendancePieChart data={attendanceData} size={250} />
                  </div>
                  
                  <div className="p-4 rounded-md bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Attendance Status</h3>
                    <p className="text-gray-700">
                      {getAttendanceRemark(currentPercentage)}
                    </p>
                  </div>
                  
                  {currentPercentage < 75 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <h3 className="text-yellow-800 font-medium">Attendance Warning</h3>
                      <p className="text-yellow-700 mt-1">
                        Your attendance is below the 75% requirement. You may face issues with exam eligibility if it drops further.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Custom Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Total Classes"
                      type="number"
                      name="totalClasses"
                      value={customCalculation.totalClasses}
                      onChange={handleCustomInputChange}
                    />
                    
                    <Input
                      label="Classes Attended"
                      type="number"
                      name="attendedClasses"
                      value={customCalculation.attendedClasses}
                      onChange={handleCustomInputChange}
                    />
                  </div>

                  <div className="flex justify-center mb-4">
                    <Button
                      onClick={() => {
                        // Reset to current course values
                        if (selectedCourse === 'all') {
                          const totalClasses = courses.reduce((sum, course) => sum + course.totalClasses, 0);
                          const attendedClasses = courses.reduce((sum, course) => sum + course.attendedClasses, 0);
                          
                          setCustomCalculation({
                            ...customCalculation,
                            totalClasses,
                            attendedClasses
                          });
                        } else {
                          const course = courses.find(c => c.id === selectedCourse);
                          if (course) {
                            setCustomCalculation({
                              ...customCalculation,
                              totalClasses: course.totalClasses,
                              attendedClasses: course.attendedClasses
                            });
                          }
                        }
                      }}
                    >
                      Reset to Current Values
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-700">Current Percentage:</p>
                      <p 
                        className={`text-lg font-bold ${
                          calculateAttendance(customCalculation.attendedClasses, customCalculation.totalClasses) >= 75
                            ? 'text-green-600'
                            : calculateAttendance(customCalculation.attendedClasses, customCalculation.totalClasses) >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {calculateAttendance(customCalculation.attendedClasses, customCalculation.totalClasses).toFixed(1)}%
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2">
                      If you miss the next class, your percentage would be:{' '}
                      <span className="font-medium">
                        {calculateAttendance(
                          customCalculation.attendedClasses, 
                          customCalculation.totalClasses + 1
                        ).toFixed(1)}%
                      </span>
                    </p>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      If you attend the next 5 classes, your percentage would be:{' '}
                      <span className="font-medium">
                        {calculateAttendance(
                          customCalculation.attendedClasses + 5, 
                          customCalculation.totalClasses + 5
                        ).toFixed(1)}%
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalculatorPage;
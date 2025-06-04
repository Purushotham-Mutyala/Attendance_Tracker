import React, { useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import CourseCard from '../components/CourseCard';
import { User, Book, Plus, X } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { courses, addCourse, deleteCourse } = useCourses();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [userFormData, setUserFormData] = useState({
    username: user?.username || '',
    rollNumber: user?.rollNumber || '',
    year: user?.year.toString() || '',
    course: user?.course || '',
    section: user?.section || ''
  });
  
  const [courseFormData, setCourseFormData] = useState({
    code: '',
    name: '',
    instructor: '',
    totalClasses: '30',
    day1: 'Monday',
    startTime1: '09:00',
    endTime1: '10:30',
    room1: '',
    day2: 'Wednesday',
    startTime2: '09:00',
    endTime2: '10:30',
    room2: ''
  });
  
  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData({
      ...userFormData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCourseFormData({
      ...courseFormData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmitUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        username: userFormData.username,
        rollNumber: userFormData.rollNumber,
        year: parseInt(userFormData.year),
        course: userFormData.course,
        section: userFormData.section
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addCourse({
      code: courseFormData.code,
      name: courseFormData.name,
      instructor: courseFormData.instructor,
      totalClasses: parseInt(courseFormData.totalClasses),
      attendedClasses: 0,
      schedule: [
        {
          day: courseFormData.day1,
          startTime: courseFormData.startTime1,
          endTime: courseFormData.endTime1,
          room: courseFormData.room1
        },
        {
          day: courseFormData.day2,
          startTime: courseFormData.startTime2,
          endTime: courseFormData.endTime2,
          room: courseFormData.room2
        }
      ]
    });
    
    // Reset form and close modal
    setCourseFormData({
      code: '',
      name: '',
      instructor: '',
      totalClasses: '30',
      day1: 'Monday',
      startTime1: '09:00',
      endTime1: '10:30',
      room1: '',
      day2: 'Wednesday',
      startTime2: '09:00',
      endTime2: '10:30',
      room2: ''
    });
    
    setIsAddingCourse(false);
  };
  
  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isMobile={isMobile} />
      
      <div className={`${isMobile ? 'pt-16 pl-0' : 'pl-16 lg:pl-64'} transition-all duration-300`}>
        <main className="p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile & Courses</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button 
                    size="sm" 
                    variant={isEditing ? "outline" : "primary"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardHeader>
                <CardContent>
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div className="flex justify-center mb-6">
                        <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-12 w-12 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                          <p className="font-medium dark:text-white">{user?.username}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Roll Number</p>
                          <p className="font-medium dark:text-white">{user?.rollNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
                          <p className="font-medium dark:text-white">{user?.year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Course</p>
                          <p className="font-medium dark:text-white">{user?.course}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Section</p>
                          <p className="font-medium dark:text-white">{user?.section}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitUserEdit}>
                      <Input
                        label="Username"
                        name="username"
                        value={userFormData.username}
                        onChange={handleUserInputChange}
                      />
                      
                      <Input
                        label="Roll Number"
                        name="rollNumber"
                        value={userFormData.rollNumber}
                        onChange={handleUserInputChange}
                      />
                      
                      <Input
                        label="Year"
                        name="year"
                        type="number"
                        min="1"
                        max="4"
                        value={userFormData.year}
                        onChange={handleUserInputChange}
                      />
                      
                      <Input
                        label="Course"
                        name="course"
                        value={userFormData.course}
                        onChange={handleUserInputChange}
                      />
                      
                      <Input
                        label="Section"
                        name="section"
                        value={userFormData.section}
                        onChange={handleUserInputChange}
                      />
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Enrolled Courses</CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setIsAddingCourse(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Course
                  </Button>
                </CardHeader>
                <CardContent>
                  {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map(course => (
                        <div key={course.id} className="relative">
                          <button
                            className="absolute top-2 right-2 p-1 rounded-full bg-white dark:bg-gray-800 border shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 z-10"
                            onClick={() => deleteCourse(course.id)}
                          >
                            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </button>
                          <CourseCard course={course} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <Book className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No courses yet</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Click "Add Course" to add your first course</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Add Course Modal */}
      {isAddingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold dark:text-white">Add New Course</h2>
              <button
                onClick={() => setIsAddingCourse(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 dark:text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <Input
                    label="Course Code"
                    name="code"
                    value={courseFormData.code}
                    onChange={handleCourseInputChange}
                    placeholder="e.g. CS101"
                    required
                  />
                </div>
                
                <div className="col-span-1">
                  <Input
                    label="Total Classes"
                    name="totalClasses"
                    type="number"
                    value={courseFormData.totalClasses}
                    onChange={handleCourseInputChange}
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Input
                    label="Course Name"
                    name="name"
                    value={courseFormData.name}
                    onChange={handleCourseInputChange}
                    placeholder="e.g. Introduction to Programming"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Input
                    label="Instructor"
                    name="instructor"
                    value={courseFormData.instructor}
                    onChange={handleCourseInputChange}
                    placeholder="e.g. Dr. John Smith"
                    required
                  />
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">Class Schedule 1</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Day
                  </label>
                  <select
                    name="day1"
                    value={courseFormData.day1}
                    onChange={handleCourseInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Input
                    label="Room"
                    name="room1"
                    value={courseFormData.room1}
                    onChange={handleCourseInputChange}
                    placeholder="e.g. B-101"
                    required
                  />
                </div>
                
                <div>
                  <Input
                    label="Start Time"
                    name="startTime1"
                    type="time"
                    value={courseFormData.startTime1}
                    onChange={handleCourseInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    label="End Time"
                    name="endTime1"
                    type="time"
                    value={courseFormData.endTime1}
                    onChange={handleCourseInputChange}
                    required
                  />
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">Class Schedule 2 (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Day
                  </label>
                  <select
                    name="day2"
                    value={courseFormData.day2}
                    onChange={handleCourseInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Input
                    label="Room"
                    name="room2"
                    value={courseFormData.room2}
                    onChange={handleCourseInputChange}
                    placeholder="e.g. B-101"
                  />
                </div>
                
                <div>
                  <Input
                    label="Start Time"
                    name="startTime2"
                    type="time"
                    value={courseFormData.startTime2}
                    onChange={handleCourseInputChange}
                  />
                </div>
                
                <div>
                  <Input
                    label="End Time"
                    name="endTime2"
                    type="time"
                    value={courseFormData.endTime2}
                    onChange={handleCourseInputChange}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingCourse(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Course</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
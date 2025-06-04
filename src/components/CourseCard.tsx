import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Button from './ui/Button';

interface CourseCardProps {
  course: Course;
  showDetails?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, showDetails = true }) => {
  const navigate = useNavigate();
  const attendancePercentage = Math.round((course.attendedClasses / course.totalClasses) * 100) || 0;
  
  const getStatusColor = () => {
    if (attendancePercentage >= 75) return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
    if (attendancePercentage >= 60) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
  };

  return (
    <Card className="h-full transition-transform hover:translate-y-[-4px]">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="dark:text-white">{course.name}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">{course.code}</p>
          </div>
          <div className={`px-3 py-1 rounded-full ${getStatusColor()}`}>
            {attendancePercentage}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          <span className="font-medium">Instructor:</span> {course.instructor}
        </p>
        
        {showDetails && (
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule:</p>
            {course.schedule.map((schedule, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">
                <div className="flex items-center mb-1">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="dark:text-gray-300">{schedule.day}</span>
                </div>
                <div className="flex items-center mb-1">
                  <Clock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="dark:text-gray-300">{schedule.startTime} - {schedule.endTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="dark:text-gray-300">Room {schedule.room}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                attendancePercentage >= 75 
                  ? 'bg-green-600' 
                  : attendancePercentage >= 60 
                    ? 'bg-yellow-400' 
                    : 'bg-red-600'
              }`} 
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
            <span>{course.attendedClasses} attended</span>
            <span>{course.totalClasses} total</span>
          </div>
        </div>
      </CardContent>
      {showDetails && (
        <CardFooter>
          <Button 
            onClick={() => navigate(`/course/${course.id}`)}
            variant="outline"
            className="w-full"
          >
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CourseCard;
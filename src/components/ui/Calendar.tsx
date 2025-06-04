import React, { useState } from 'react';
import { AttendanceRecord } from '../../types';

interface CalendarProps {
  month: Date;
  attendanceRecords: AttendanceRecord[];
  onDateClick: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ month, attendanceRecords, onDateClick }) => {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const firstDay = getFirstDayOfMonth(year, monthIndex);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const handlePrevMonth = () => {
    const prevMonth = new Date(year, monthIndex - 1, 1);
    onDateClick(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(year, monthIndex + 1, 1);
    onDateClick(nextMonth);
  };

  const getStatusForDate = (date: number): 'present' | 'absent' | 'excused' | null => {
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    
    const record = attendanceRecords.find(r => {
      const recordDate = new Date(r.date);
      return recordDate.getFullYear() === year && 
             recordDate.getMonth() === monthIndex && 
             recordDate.getDate() === date;
    });
    
    return record ? record.status : null;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button 
          className="p-1 hover:bg-gray-100 rounded"
          onClick={handlePrevMonth}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">{monthNames[monthIndex]} {year}</h2>
        <button 
          className="p-1 hover:bg-gray-100 rounded"
          onClick={handleNextMonth}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center py-1 text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(year, monthIndex, day);
          const isToday = new Date().toDateString() === date.toDateString();
          const status = getStatusForDate(day);
          
          const getStatusClass = () => {
            switch (status) {
              case 'present':
                return 'bg-green-100 text-green-800 border-green-400';
              case 'absent':
                return 'bg-red-100 text-red-800 border-red-400';
              case 'excused':
                return 'bg-yellow-100 text-yellow-800 border-yellow-400';
              default:
                return isToday ? 'bg-blue-100 text-blue-800 border-blue-400' : 'hover:bg-gray-100';
            }
          };
          
          return (
            <div 
              key={day}
              className={`p-2 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${getStatusClass()}`}
              onClick={() => onDateClick(date)}
            >
              <span>{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
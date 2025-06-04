import { Course } from '../models/Course';
import { AttendanceRecord } from '../types';

/**
 * Service for handling attendance-related operations
 */
export class AttendanceService {
  constructor(private records: AttendanceRecord[] = []) {}

  /**
   * Marks attendance for a course
   */
  async markAttendance(
    courseId: string,
    date: string,
    status: 'present' | 'absent' | 'excused'
  ): Promise<AttendanceRecord> {
    const record: AttendanceRecord = {
      id: Date.now().toString(),
      courseId,
      date,
      status
    };
    
    this.records.push(record);
    return record;
  }

  /**
   * Checks if attendance is already marked
   */
  isAttendanceMarked(courseId: string, date: string): boolean {
    return this.records.some(record => 
      record.courseId === courseId && 
      record.date.split('T')[0] === date.split('T')[0]
    );
  }

  /**
   * Gets attendance records for a course
   */
  getRecordsForCourse(courseId: string): AttendanceRecord[] {
    return this.records.filter(record => record.courseId === courseId);
  }

  /**
   * Gets attendance statistics for a course
   */
  getAttendanceStats(course: Course) {
    const records = this.getRecordsForCourse(course.id);
    return {
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      excused: records.filter(r => r.status === 'excused').length,
      total: course.totalClasses
    };
  }
}
import { ClassSchedule } from '../types';

/**
 * Course Model representing an academic course
 */
export class Course {
  constructor(
    public id: string,
    public code: string,
    public name: string,
    public instructor: string,
    public totalClasses: number,
    public attendedClasses: number,
    public schedule: ClassSchedule[]
  ) {}

  /**
   * Calculates attendance percentage
   */
  getAttendancePercentage(): number {
    return Math.round((this.attendedClasses / this.totalClasses) * 100) || 0;
  }

  /**
   * Gets attendance status
   */
  getAttendanceStatus(): 'good' | 'warning' | 'critical' {
    const percentage = this.getAttendancePercentage();
    if (percentage >= 75) return 'good';
    if (percentage >= 60) return 'warning';
    return 'critical';
  }

  /**
   * Gets classes for a specific day
   */
  getClassesForDay(day: string): ClassSchedule[] {
    return this.schedule.filter(s => s.day === day);
  }
}
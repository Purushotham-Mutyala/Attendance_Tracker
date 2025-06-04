/**
 * Utility class for date operations
 */
export class DateUtils {
  /**
   * Formats a date string
   */
  static formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
    if (format === 'short') {
      return date.toLocaleDateString();
    }
    
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Gets relative time string
   */
  static getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.round(diffInHours * 60)} min ago`;
    }
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    }
    return date.toLocaleDateString();
  }

  /**
   * Gets days in a month
   */
  static getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
}
/**
 * Utility class for input validation
 */
export class ValidationUtils {
  /**
   * Validates email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Gets roll number format hint
   */
  static getRollNumberHint(): string {
    return 'Enter your roll number';
  }

  /**
   * Validates required fields
   */
  static validateRequired(fields: Record<string, any>): string[] {
    const errors: string[] = [];
    
    Object.entries(fields).forEach(([key, value]) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.push(`${key} is required`);
      }
    });
    
    return errors;
  }

  /**
   * Validates year field
   */
  static isValidYear(year: number): boolean {
    return year >= 1 && year <= 5;
  }

  /**
   * Validates section field
   */
  static isValidSection(section: string): boolean {
    return /^[A-Z]$/.test(section);
  }
}
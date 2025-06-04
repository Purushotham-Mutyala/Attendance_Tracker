/**
 * User Model representing a student in the system
 */
export class User {
  constructor(
    public id: string,
    public username: string,
    public rollNumber: string,
    public year: number,
    public course: string,
    public section: string
  ) {}

  /**
   * Creates a display name for the user
   */
  getDisplayName(): string {
    return `${this.username} (${this.rollNumber})`;
  }

  /**
   * Gets user's academic information
   */
  getAcademicInfo(): string {
    return `${this.year} Year - ${this.section} Section`;
  }

  /**
   * Gets user's initials for avatar
   */
  getInitials(): string {
    return this.username.substring(0, 2).toUpperCase();
  }
}
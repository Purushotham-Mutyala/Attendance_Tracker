import { Course, User, AttendanceRecord } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(rollNumber: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ rollNumber, password })
    });
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async register(userData: Omit<User, 'id'>) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // Course endpoints
  async getCourses(): Promise<Course[]> {
    return this.request('/courses');
  }

  async getCourse(id: string): Promise<Course> {
    return this.request(`/courses/${id}`);
  }

  async createCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  }

  // Attendance endpoints
  async markAttendance(courseId: string, date: string, status: 'present' | 'absent' | 'excused'): Promise<AttendanceRecord> {
    return this.request(`/attendance/${courseId}`, {
      method: 'POST',
      body: JSON.stringify({ date, status })
    });
  }

  async getAttendance(courseId: string): Promise<AttendanceRecord[]> {
    return this.request(`/attendance/${courseId}`);
  }
}

export const api = new ApiService();
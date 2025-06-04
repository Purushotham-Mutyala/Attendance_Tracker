import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { GraduationCap } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    rollNumber: '',
    password: '',
    username: '',
    year: '',
    course: '',
    section: '',
  });
  const [error, setError] = useState('');
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.rollNumber || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      await login(formData.rollNumber, formData.password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (
      !formData.rollNumber ||
      !formData.password ||
      !formData.username ||
      !formData.year ||
      !formData.course ||
      !formData.section
    ) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      await register({
        ...formData,
        year: parseInt(formData.year)
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          AttendTrack
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Student Attendance Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 flex border-b">
            <button
              className={`pb-3 px-2 -mb-px font-medium ${
                !isRegistering
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsRegistering(false)}
            >
              Login
            </button>
            <button
              className={`pb-3 px-2 -mb-px font-medium ${
                isRegistering
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsRegistering(true)}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {!isRegistering ? (
            <form onSubmit={handleLoginSubmit}>
              <Input
                label="Roll Number"
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="Enter your roll number"
                required
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Input
                    label="Roll Number"
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter your roll number"
                    required
                  />
                </div>
                
                <div>
                  <Input
                    label="Year"
                    type="number"
                    name="year"
                    min="1"
                    max="4"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    label="Section"
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g. A"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Input
                    label="Course"
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                >
                  Register
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
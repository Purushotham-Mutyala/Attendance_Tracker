import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (rollNumber: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const [registeredUsers, setRegisteredUsers] = useState<Array<{ rollNumber: string; password: string }>>(() => {
    const stored = localStorage.getItem('registeredUsers');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (rollNumber: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if user is registered
      const registeredUser = registeredUsers.find(u => u.rollNumber === rollNumber);
      if (!registeredUser) {
        throw new Error('User not registered. Please register first.');
      }

      // Verify password
      if (registeredUser.password !== password) {
        throw new Error('Invalid credentials');
      }

      // Get user data
      const storedUserData = localStorage.getItem(`userData_${rollNumber}`);
      if (!storedUserData) {
        throw new Error('User data not found');
      }

      const userData = JSON.parse(storedUserData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      showToast({ 
        title: 'Login successful',
        variant: 'success'
      });
    } catch (error) {
      showToast({ 
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'error'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      if (registeredUsers.some(u => u.rollNumber === userData.rollNumber)) {
        throw new Error('User already registered with this roll number');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        rollNumber: userData.rollNumber,
        year: userData.year,
        course: userData.course,
        section: userData.section
      };

      // Store user credentials
      const updatedUsers = [...registeredUsers, { 
        rollNumber: userData.rollNumber, 
        password: userData.password 
      }];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      // Store user data
      localStorage.setItem(`userData_${userData.rollNumber}`, JSON.stringify(newUser));
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      showToast({ 
        title: 'Registration successful',
        variant: 'success'
      });
    } catch (error) {
      showToast({ 
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'error'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        ...userData
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem(`userData_${user.rollNumber}`, JSON.stringify(updatedUser));
      
      showToast({ 
        title: 'Profile updated',
        description: 'Your information has been saved',
        variant: 'success'
      });
    } catch (error) {
      showToast({ 
        title: 'Update failed',
        description: 'Please try again',
        variant: 'error'
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    showToast({ 
      title: 'Logged out successfully',
      variant: 'success'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { NotificationProvider } from './context/NotificationContext';
import { MassBunkProvider } from './context/MassBunkContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContextProvider } from './context/ToastContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import ProfilePage from './pages/ProfilePage';
import MassBunkPage from './pages/MassBunkPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <ToastContextProvider>
        <AuthProvider>
          <NotificationProvider>
            <CourseProvider>
              <MassBunkProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50 dark:bg-dark-bg dark:bg-dark-gradient transition-colors duration-200">
                    <Routes>
                      <Route path="/" element={<LoginPage />} />
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute>
                            <DashboardPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/calculator" 
                        element={
                          <ProtectedRoute>
                            <CalculatorPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/massbunk" 
                        element={
                          <ProtectedRoute>
                            <MassBunkPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/course/:id" 
                        element={
                          <ProtectedRoute>
                            <CourseDetailsPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/settings" 
                        element={
                          <ProtectedRoute>
                            <SettingsPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="*" element={<Navigate to="/\" replace />} />
                    </Routes>
                  </div>
                </Router>
              </MassBunkProvider>
            </CourseProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastContextProvider>
    </ThemeProvider>
  );
}

export default App;
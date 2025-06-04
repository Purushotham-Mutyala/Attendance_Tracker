import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Calendar, Calculator, Settings, Users, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';

interface SidebarProps {
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Calendar className="w-5 h-5" /> },
    { path: '/calculator', label: 'Calculator', icon: <Calculator className="w-5 h-5" /> },
    { path: '/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { path: '/massbunk', label: 'Mass Bunk', icon: <Users className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 px-4 py-3 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Attendance Tracker</h1>
          <NotificationBell />
        </div>
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-20 
          ${isOpen ? 'w-64' : isMobile ? 'w-0 -translate-x-full' : 'w-16'} 
          ${isMobile ? 'pt-16' : 'pt-5'}
        `}
      >
        {isOpen && (
          <div className="flex flex-col h-full">
            {!isMobile && (
              <div className="flex items-center justify-between px-4 mb-6">
                <h1 className="font-bold text-xl">AttendTrack</h1>
                <button
                  onClick={toggleSidebar}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {user && (
              <div className="flex flex-col items-center mb-6 px-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-blue-600">
                    {user.username.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-xs text-gray-500">{user.rollNumber}</p>
                <p className="text-xs text-gray-500">
                  {user.year} Year - {user.section} Section
                </p>
              </div>
            )}

            <nav className="flex-1">
              <ul className="px-2 space-y-1">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center px-4 py-2 rounded-md transition-colors
                        ${
                          location.pathname === item.path
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {!isOpen && !isMobile && (
          <div className="flex flex-col items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 mb-6 rounded-full hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <span className="text-sm font-bold text-blue-600">
                {user?.username.substring(0, 2).toUpperCase() || "AT"}
              </span>
            </div>

            <nav className="flex-1">
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center justify-center p-2 rounded-md transition-colors
                        ${
                          location.pathname === item.path
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      {item.icon}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
      
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.round(diffInHours * 60)} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="relative">
      <button
        className="p-2 rounded-full hover:bg-gray-100 relative"
        onClick={toggleNotifications}
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-xs text-white flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-3 bg-blue-50 flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <button
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div
                      className={`h-2 w-2 mt-1.5 mr-2 rounded-full flex-shrink-0 ${
                        notification.read ? 'bg-gray-300' : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
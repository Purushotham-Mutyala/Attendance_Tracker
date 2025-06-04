import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (user) {
      const storedNotifications = localStorage.getItem(`notifications-${user.id}`);
      
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        // Mock notifications for demonstration
        const mockNotifications: Notification[] = [
          {
            id: '1',
            userId: user.id,
            message: 'Welcome to the Student Attendance Tracker!',
            type: 'info',
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            userId: user.id,
            message: 'New mass bunk poll for Data Structures class on Friday',
            type: 'warning',
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            link: '/massbunk/2'
          }
        ];
        setNotifications(mockNotifications);
        localStorage.setItem(`notifications-${user.id}`, JSON.stringify(mockNotifications));
      }
    }
    setIsLoading(false);
  }, [user]);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!user) return;
    
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications-${user.id}`, JSON.stringify(updatedNotifications));
  };

  const markAsRead = (id: string) => {
    if (!user) return;
    
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications-${user.id}`, JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    if (!user) return;
    
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications-${user.id}`, JSON.stringify(updatedNotifications));
  };

  const clearNotifications = () => {
    if (!user) return;
    
    setNotifications([]);
    localStorage.setItem(`notifications-${user.id}`, JSON.stringify([]));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
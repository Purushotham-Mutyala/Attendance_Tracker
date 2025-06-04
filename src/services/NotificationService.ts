import { Notification } from '../types';

/**
 * Service for managing notifications
 */
export class NotificationService {
  private notifications: Notification[] = [];

  /**
   * Adds a new notification
   */
  addNotification(
    userId: string,
    message: string,
    type: 'info' | 'warning' | 'success' | 'error',
    link?: string
  ): Notification {
    const notification: Notification = {
      id: Date.now().toString(),
      userId,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    this.notifications.unshift(notification);
    return notification;
  }

  /**
   * Marks a notification as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Gets unread notifications count
   */
  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  /**
   * Gets notifications for a user
   */
  getUserNotifications(userId: string): Notification[] {
    return this.notifications.filter(n => n.userId === userId);
  }
}
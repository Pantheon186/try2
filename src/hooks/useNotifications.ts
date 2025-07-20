// Notifications Hook - Manages in-app notifications and alerts
import { useState, useCallback, useEffect } from 'react';
import { useToastNotifications } from '../components/enhanced/ToastNotifications';
import { config } from '../config/environment';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 means persistent
  timestamp: Date;
  read?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const toast = useToastNotifications();

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);
  // Add a new notification
  const addNotification = useCallback((
    type: Notification['type'],
    title: string,
    message: string,
    duration: number = config.ui.notificationDuration,
    actions?: NotificationAction[]
  ) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: new Date(),
      read: false,
      actions
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration (if not persistent)
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Clear read notifications
  const clearReadNotifications = useCallback(() => {
    setNotifications(prev => prev.filter(notification => !notification.read));
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    toast.showSuccess(title, message, duration);
    return addNotification('success', title, message, duration);
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    toast.showError(title, message, duration);
    return addNotification('error', title, message, duration);
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    toast.showWarning(title, message, duration);
    return addNotification('warning', title, message, duration);
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    toast.showInfo(title, message, duration);
    return addNotification('info', title, message, duration);
  }, [addNotification]);

  // Show booking-related notifications
  const showBookingSuccess = useCallback((bookingId: string, itemName: string) => {
    return showSuccess(
      'Booking Confirmed!',
      `Your booking for ${itemName} has been confirmed successfully. Booking ID: ${bookingId}`,
      7000
    );
  }, [showSuccess]);

  const showBookingError = useCallback((itemName: string, error?: string) => {
    return showError(
      'Booking Failed',
      error || `Failed to book ${itemName}. Please try again or contact support.`,
      8000
    );
  }, [showError]);

  const showCancellationSuccess = useCallback((bookingId: string) => {
    return showSuccess(
      'Booking Cancelled',
      `Booking ${bookingId} has been cancelled successfully. Refund will be processed within 3-5 business days.`,
      7000
    );
  }, [showSuccess]);

  const showPaymentSuccess = useCallback((bookingId: string, amount: number) => {
    return showSuccess(
      'Payment Successful',
      `Payment of ₹${amount.toLocaleString('en-IN')} for booking ${bookingId} has been processed successfully.`,
      6000
    );
  }, [showSuccess]);

  const showPaymentError = useCallback((bookingId: string, error?: string) => {
    return showError(
      'Payment Failed',
      error || `Payment for booking ${bookingId} failed. Please try again or contact support.`,
      8000
    );
  }, [showError]);

  // Show authentication-related notifications
  const showLoginSuccess = useCallback((userName: string) => {
    return showSuccess(
      'Welcome Back!',
      `Successfully logged in as ${userName}.`,
      4000
    );
  }, [showSuccess]);

  const showLoginError = useCallback(() => {
    return showError(
      'Login Failed',
      'Invalid credentials. Please check your email and password.',
      6000
    );
  }, [showError]);

  const showLogoutSuccess = useCallback(() => {
    return showInfo(
      'Logged Out',
      'You have been successfully logged out.',
      3000
    );
  }, [showInfo]);

  const showSessionExpired = useCallback(() => {
    return showWarning(
      'Session Expired',
      'Your session has expired. Please log in again.',
      0 // Persistent
    );
  }, [showWarning]);

  // Show system notifications
  const showMaintenanceWarning = useCallback(() => {
    return showWarning(
      'Scheduled Maintenance',
      'System maintenance is scheduled for tonight at 2:00 AM. Some features may be temporarily unavailable.',
      0 // Persistent notification
    );
  }, [showWarning]);

  const showConnectionError = useCallback(() => {
    return showError(
      'Connection Error',
      'Unable to connect to the server. Please check your internet connection.',
      0 // Persistent until resolved
    );
  }, [showError]);

  const showDataSyncSuccess = useCallback(() => {
    return showSuccess(
      'Data Synchronized',
      'Your data has been synchronized with the server.',
      3000
    );
  }, [showSuccess]);

  const showOfflineMode = useCallback(() => {
    return showWarning(
      'Offline Mode',
      'You are currently offline. Some features may be limited.',
      0 // Persistent until online
    );
  }, [showWarning]);

  // Show update notifications
  const showUpdateAvailable = useCallback(() => {
    return addNotification(
      'info',
      'Update Available',
      'A new version of the application is available.',
      0,
      [
        {
          label: 'Update Now',
          action: () => window.location.reload(),
          style: 'primary'
        },
        {
          label: 'Later',
          action: () => {},
          style: 'secondary'
        }
      ]
    );
  }, [addNotification]);
  return {
    notifications,
    toasts: toast.toasts,
    removeToast: toast.removeToast,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    clearReadNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showBookingSuccess,
    showBookingError,
    showCancellationSuccess,
    showPaymentSuccess,
    showPaymentError,
    showLoginSuccess,
    showLoginError,
    showLogoutSuccess,
    showSessionExpired,
    showMaintenanceWarning,
    showConnectionError,
    showDataSyncSuccess,
    showOfflineMode,
    showUpdateAvailable
  };
};
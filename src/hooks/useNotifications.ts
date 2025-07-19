// Notifications Hook - Manages in-app notifications and alerts
import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 means persistent
  timestamp: Date;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add a new notification
  const addNotification = useCallback((
    type: Notification['type'],
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: new Date()
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

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('success', title, message, duration);
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('error', title, message, duration);
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('warning', title, message, duration);
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    return addNotification('info', title, message, duration);
  }, [addNotification]);

  // Show booking-related notifications
  const showBookingSuccess = useCallback((bookingId: string, itemName: string) => {
    return showSuccess(
      'Booking Confirmed!',
      `Your booking for ${itemName} (${bookingId}) has been confirmed successfully.`,
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

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showBookingSuccess,
    showBookingError,
    showCancellationSuccess,
    showLoginSuccess,
    showLoginError,
    showLogoutSuccess,
    showMaintenanceWarning,
    showConnectionError
  };
};
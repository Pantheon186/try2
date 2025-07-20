import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

interface ToastNotificationsProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

const ToastNotifications: React.FC<ToastNotificationsProps> = ({ toasts, onRemoveToast }) => {
  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-md
            transform transition-all duration-300 ease-in-out
            ${getToastStyles(toast.type)}
            animate-in slide-in-from-top-5
          `}
          style={{
            animationDelay: `${index * 100}ms`,
            marginTop: index > 0 ? '8px' : '0'
          }}
        >
          {getToastIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">{toast.title}</h4>
            <p className="text-sm mt-1 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => onRemoveToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

// Hook for managing toast notifications
export const useToastNotifications = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    type: Toast['type'],
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    return addToast('success', title, message, duration);
  };

  const showError = (title: string, message: string, duration?: number) => {
    return addToast('error', title, message, duration);
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    return addToast('warning', title, message, duration);
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    return addToast('info', title, message, duration);
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default ToastNotifications;
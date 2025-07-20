// Notification Center Component - Displays in-app notifications
import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Bell } from 'lucide-react';
import { useNotifications, type Notification } from '../hooks/useNotifications';
import { Formatters } from '../utils/formatters';

const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    removeNotification, 
    markAsRead, 
    markAllAsRead,
    clearReadNotifications 
  } = useNotifications();

  const [isExpanded, setIsExpanded] = React.useState(false);

  if (notifications.length === 0) {
    return null;
  }

  const getNotificationIcon = (type: Notification['type']) => {
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

  const getNotificationStyles = (type: Notification['type']) => {
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleActionClick = (action: any) => {
    action.action();
  };

  if (!isExpanded) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="relative bg-white/90 backdrop-blur-md border border-white/30 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Bell size={20} className="text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border border-white/30 rounded-t-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-gray-700" />
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={clearReadNotifications}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear read
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white/90 backdrop-blur-md border-l border-r border-white/30 max-h-96 overflow-y-auto">
        {notifications.slice(0, 10).map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`
              border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-50 transition-colors
              ${!notification.read ? 'bg-blue-50' : ''}
            `}
          >
            <div className="flex items-start gap-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                    {notification.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-sm mt-1 leading-relaxed text-gray-600">
                  {notification.message}
                </p>
                <p className="text-xs mt-2 text-gray-500">
                  {Formatters.relativeTime(notification.timestamp.toISOString())}
                </p>
                
                {/* Action Buttons */}
                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(action);
                        }}
                        className={`
                          text-xs px-3 py-1 rounded transition-colors
                          ${action.style === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                            action.style === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' :
                            'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                        `}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Bell size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 10 && (
        <div className="bg-white/90 backdrop-blur-md border border-white/30 rounded-b-lg p-3 text-center">
          <p className="text-xs text-gray-500">
            Showing 10 of {notifications.length} notifications
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
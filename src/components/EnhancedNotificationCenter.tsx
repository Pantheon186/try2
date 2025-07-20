import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Bell, BellRing, Trash2, MarkAsUnread } from 'lucide-react';
import { MockDataService } from '../services/MockDataService';
import { MockNotification } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { Formatters } from '../utils/formatters';

const EnhancedNotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<MockNotification[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userNotifications = await MockDataService.getUserNotifications(user.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await MockDataService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      for (const notification of unreadNotifications) {
        await MockDataService.markNotificationAsRead(notification.id);
      }
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: MockNotification['type']) => {
    switch (type) {
      case 'booking':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'payment':
        return <AlertCircle size={20} className="text-blue-500" />;
      case 'complaint':
        return <AlertTriangle size={20} className="text-red-500" />;
      case 'system':
        return <Info size={20} className="text-gray-500" />;
      case 'promotion':
        return <Info size={20} className="text-purple-500" />;
      case 'review':
        return <CheckCircle size={20} className="text-yellow-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: MockNotification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'normal':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'high':
        return notification.priority === 'high' || notification.priority === 'urgent';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  if (!isExpanded) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="relative bg-white/90 backdrop-blur-md border border-white/30 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          {unreadCount > 0 ? (
            <BellRing size={20} className="text-blue-600 animate-pulse" />
          ) : (
            <Bell size={20} className="text-gray-700" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-h-[80vh] bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell size={18} />
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-white/20 text-white text-xs rounded-full px-2 py-1">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'high', label: 'Important' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      {unreadCount > 0 && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                  !notification.read ? 'bg-blue-50' : ''
                } ${getPriorityColor(notification.priority)}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm mt-1 leading-relaxed text-gray-700">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {Formatters.relativeTime(notification.createdAt)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        notification.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {notification.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {filter === 'unread' ? 'No unread notifications' : 
               filter === 'high' ? 'No important notifications' : 
               'No notifications'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedNotificationCenter;
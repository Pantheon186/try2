import React, { useEffect, useState, useCallback } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { config } from '../../config/environment';

interface RealTimeUpdatesProps {
  onBookingUpdate?: (booking: any) => void;
  onNotificationReceived?: (notification: any) => void;
  className?: string;
}

const RealTimeUpdates: React.FC<RealTimeUpdatesProps> = ({
  onBookingUpdate,
  onNotificationReceived,
  className = ''
}) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleRealtimeEvent = useCallback((payload: any) => {
    console.log('Real-time event received:', payload);
    setLastUpdate(new Date());

    switch (payload.eventType) {
      case 'INSERT':
        if (payload.table === 'bookings' && onBookingUpdate) {
          onBookingUpdate(payload.new);
          addNotification(
            'info',
            'New Booking',
            `A new booking has been created: ${payload.new.item_name}`,
            5000
          );
        }
        if (payload.table === 'notifications' && onNotificationReceived) {
          onNotificationReceived(payload.new);
        }
        break;

      case 'UPDATE':
        if (payload.table === 'bookings' && onBookingUpdate) {
          onBookingUpdate(payload.new);
          addNotification(
            'info',
            'Booking Updated',
            `Booking ${payload.new.booking_reference} has been updated`,
            3000
          );
        }
        break;

      case 'DELETE':
        if (payload.table === 'bookings') {
          addNotification(
            'warning',
            'Booking Deleted',
            `A booking has been removed from the system`,
            3000
          );
        }
        break;

      default:
        console.log('Unhandled real-time event:', payload);
    }
  }, [onBookingUpdate, onNotificationReceived, addNotification]);

  const setupRealtimeSubscription = useCallback(async () => {
    if (!config.database.useSupabase || !user) {
      return null;
    }

    try {
      // Subscribe to bookings changes for the current user
      const bookingsChannel = supabase
        .channel('user-bookings')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            filter: `agent_id=eq.${user.id}`
          },
          (payload) => handleRealtimeEvent({ ...payload, table: 'bookings' })
        )
        .subscribe((status) => {
          console.log('Bookings subscription status:', status);
          setIsConnected(status === 'SUBSCRIBED');
          if (status === 'SUBSCRIBED') {
            setRetryCount(0);
          }
        });

      // Subscribe to notifications for the current user
      const notificationsChannel = supabase
        .channel('user-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => handleRealtimeEvent({ ...payload, table: 'notifications' })
        )
        .subscribe();

      // For admins, subscribe to all bookings
      let adminChannel = null;
      if (user.role === 'Basic Admin' || user.role === 'Super Admin') {
        adminChannel = supabase
          .channel('admin-bookings')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'bookings'
            },
            (payload) => handleRealtimeEvent({ ...payload, table: 'bookings', admin: true })
          )
          .subscribe();
      }

      return () => {
        bookingsChannel.unsubscribe();
        notificationsChannel.unsubscribe();
        if (adminChannel) {
          adminChannel.unsubscribe();
        }
      };
    } catch (error) {
      console.error('Failed to setup real-time subscription:', error);
      setIsConnected(false);
      return null;
    }
  }, [user, handleRealtimeEvent]);

  const handleConnectionLost = useCallback(() => {
    setIsConnected(false);
    
    // Retry connection with exponential backoff
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 seconds
    
    setTimeout(() => {
      setRetryCount(prev => prev + 1);
      setupRealtimeSubscription();
    }, retryDelay);

    addNotification(
      'warning',
      'Connection Lost',
      'Real-time updates disconnected. Attempting to reconnect...',
      0 // Persistent until reconnected
    );
  }, [retryCount, setupRealtimeSubscription, addNotification]);

  const handleManualRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    if (!config.features.enableRealTimeUpdates) {
      return;
    }

    const cleanup = setupRealtimeSubscription();

    // Monitor connection status
    const connectionMonitor = setInterval(() => {
      if (isConnected && Date.now() - (lastUpdate?.getTime() || 0) > 60000) {
        // No updates for 1 minute, check connection
        handleConnectionLost();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      if (cleanup) {
        cleanup.then(unsubscribe => unsubscribe?.());
      }
      clearInterval(connectionMonitor);
    };
  }, [setupRealtimeSubscription, isConnected, lastUpdate, handleConnectionLost]);

  // Don't render if real-time updates are disabled
  if (!config.features.enableRealTimeUpdates) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Connection Status Indicator */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <div className="flex items-center gap-1 text-green-600">
            <Wifi size={16} />
            <span className="text-xs font-medium">Live</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-600">
            <WifiOff size={16} />
            <span className="text-xs font-medium">Offline</span>
          </div>
        )}
      </div>

      {/* Last Update Time */}
      {lastUpdate && (
        <span className="text-xs text-gray-500">
          Updated {lastUpdate.toLocaleTimeString()}
        </span>
      )}

      {/* Manual Refresh Button */}
      {!isConnected && (
        <button
          onClick={handleManualRefresh}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-xs"
          title="Refresh page"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      )}

      {/* Retry Count (Development only) */}
      {import.meta.env.DEV && retryCount > 0 && (
        <span className="text-xs text-orange-600">
          Retry: {retryCount}
        </span>
      )}
    </div>
  );
};

export default RealTimeUpdates;
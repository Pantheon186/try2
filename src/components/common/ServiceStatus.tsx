// Service Status Indicator Component
import React, { useState, useEffect } from 'react';
import { SupabaseService } from '../../services/SupabaseService';
import { config } from '../../config/environment';
import { DataSeeder } from '../../services/dataSeeder';

const ServiceStatus: React.FC = () => {
  const [status, setStatus] = useState({
    supabaseConnected: false,
    dataSource: 'unknown' as 'supabase' | 'localStorage' | 'unknown',
    lastCheck: new Date(),
    dataCount: { cruises: 0, users: 0, bookings: 0 }
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show status indicator in development
    const shouldShow = import.meta.env.MODE === 'development';
    setIsVisible(shouldShow);

    // Check service connection and data status
    const checkConnection = async () => {
      try {
        const dataStatus = await DataSeeder.getDataStatus();
        setStatus({
          supabaseConnected: dataStatus.source === 'supabase',
          dataSource: dataStatus.source as 'supabase' | 'localStorage' | 'unknown',
          lastCheck: new Date(),
          dataCount: dataStatus.dataCount || { cruises: 0, users: 0, bookings: 0 }
        });
      } catch (error) {
        setStatus({
          supabaseConnected: false,
          dataSource: 'unknown',
          lastCheck: new Date(),
          dataCount: { cruises: 0, users: 0, bookings: 0 }
        });
      }
    };

    checkConnection();

    // Check connection periodically
    const interval = setInterval(async () => {
      checkConnection();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const getStatusColor = () => {
    if (status.dataSource === 'supabase') {
      return 'bg-green-500';
    } else if (status.dataSource === 'localStorage') {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (status.dataSource) {
      case 'supabase':
        return `Supabase Connected (${status.dataCount.users} users, ${status.dataCount.cruises} cruises)`;
      case 'localStorage':
        return `Demo Mode (${status.dataCount.users} users, ${status.dataCount.bookings} bookings)`;
      default:
        return 'No Data Source';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-lg border border-gray-200 shadow-lg p-3 flex items-center gap-2 max-w-xs">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
        <span className="text-xs font-medium text-gray-700 truncate">
          {getStatusText()}
        </span>
        {import.meta.env.MODE === 'development' && (
          <span className="text-xs text-gray-500">
            (Dev Mode)
          </span>
        )}
      </div>
    </div>
  );
};

export default ServiceStatus;
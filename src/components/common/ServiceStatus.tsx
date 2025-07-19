// Service Status Indicator Component
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';

const ServiceStatus: React.FC = () => {
  const [status, setStatus] = useState({
    supabaseConnected: false,
    lastCheck: new Date()
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show status indicator in development
    const shouldShow = import.meta.env.MODE === 'development';
    setIsVisible(shouldShow);

    // Check Supabase connection
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        setStatus({
          supabaseConnected: !error,
          lastCheck: new Date()
        });
      } catch (error) {
        setStatus({
          supabaseConnected: false,
          lastCheck: new Date()
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
    if (status.supabaseConnected) {
      return 'bg-green-500';
    } else {
      return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    if (status.supabaseConnected) {
      return 'Connected to Database';
    } else {
      return 'Database Unavailable';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-lg border border-gray-200 shadow-lg p-3 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
        <span className="text-xs font-medium text-gray-700">
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
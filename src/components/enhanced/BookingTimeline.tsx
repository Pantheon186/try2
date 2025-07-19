import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, CreditCard, FileText, User } from 'lucide-react';
import { BookingEvent } from '../../types/enhanced';
import { Formatters } from '../../utils/formatters';

interface BookingTimelineProps {
  events: BookingEvent[];
  className?: string;
}

const BookingTimeline: React.FC<BookingTimelineProps> = ({ events, className = '' }) => {
  const getEventIcon = (type: BookingEvent['type']) => {
    switch (type) {
      case 'created':
        return <FileText size={16} className="text-blue-500" />;
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'modified':
        return <Clock size={16} className="text-yellow-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'payment':
        return <CreditCard size={16} className="text-blue-600" />;
      case 'refund':
        return <CreditCard size={16} className="text-orange-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getEventColor = (type: BookingEvent['type']) => {
    switch (type) {
      case 'created':
        return 'border-blue-200 bg-blue-50';
      case 'confirmed':
        return 'border-green-200 bg-green-50';
      case 'modified':
        return 'border-yellow-200 bg-yellow-50';
      case 'cancelled':
        return 'border-red-200 bg-red-50';
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'payment':
        return 'border-blue-200 bg-blue-50';
      case 'refund':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Timeline</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {sortedEvents.map((event, index) => (
          <div key={event.id} className="relative flex items-start gap-4 pb-6">
            {/* Timeline dot */}
            <div className={`
              relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 
              ${getEventColor(event.type)}
            `}>
              {getEventIcon(event.type)}
            </div>
            
            {/* Event content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800 capitalize">
                    {event.type.replace('_', ' ')}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {Formatters.relativeTime(event.timestamp)}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-2">{event.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={14} />
                  <span>{event.userName}</span>
                  <span>•</span>
                  <span>{Formatters.dateTime(event.timestamp)}</span>
                </div>
                
                {/* Metadata */}
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                      View Details
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {sortedEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock size={32} className="mx-auto mb-2 opacity-50" />
            <p>No timeline events yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingTimeline;
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';
import { Card, Statistic, Select, DatePicker, Button, Tabs, Progress } from 'antd';
import { useEnhancedBookings } from '../../hooks/useEnhancedBookings';
import { useAuth } from '../../hooks/useAuth';
import AnalyticsDashboard from './AnalyticsDashboard';
import RealTimeUpdates from './RealTimeUpdates';
import { ThemeToggle } from './ThemeProvider';
import { Formatters } from '../../utils/formatters';
import { PerformanceOptimizer } from '../../utils/performanceOptimizer';
import dayjs from 'dayjs';

interface AdvancedDashboardProps {
  userRole: string;
  onLogout: () => void;
}

const AdvancedDashboard: React.FC<AdvancedDashboardProps> = ({ userRole, onLogout }) => {
  const { user } = useAuth();
  const { bookings, analytics, loading, refetch } = useEnhancedBookings();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Memoized calculations for performance
  const dashboardStats = useMemo(() => 
    PerformanceOptimizer.memoize(() => {
      if (!analytics) return null;

      const recentBookings = bookings.filter(booking => 
        dayjs(booking.bookingDate).isAfter(dateRange[0]) &&
        dayjs(booking.bookingDate).isBefore(dateRange[1])
      );

      const totalRevenue = recentBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
      const totalCommission = recentBookings.reduce((sum, booking) => sum + booking.commissionAmount, 0);

      return {
        totalBookings: recentBookings.length,
        totalRevenue,
        totalCommission,
        averageBookingValue: recentBookings.length > 0 ? totalRevenue / recentBookings.length : 0,
        conversionRate: analytics.bookings.conversionRate,
        growthRate: 15.5 // Mock growth rate
      };
    })()
  , [analytics, bookings, dateRange]);

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      // Mock export functionality
      const data = {
        bookings: bookings.length,
        revenue: dashboardStats?.totalRevenue || 0,
        dateRange: dateRange.map(d => d.format('YYYY-MM-DD')),
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-report-${dayjs().format('YYYY-MM-DD')}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleBookingUpdate = (booking: any) => {
    console.log('Real-time booking update:', booking);
    refetch(); // Refresh data
  };

  const handleNotificationReceived = (notification: any) => {
    console.log('Real-time notification:', notification);
  };

  if (loading && !dashboardStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-gray-600 dark:text-gray-300">Loading advanced dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <header className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border-b border-white/30 dark:border-gray-700/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Title and Real-time Status */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Advanced Dashboard
              </h1>
              <RealTimeUpdates
                onBookingUpdate={handleBookingUpdate}
                onNotificationReceived={handleNotificationReceived}
              />
            </div>

            {/* Right - Controls */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              <Select
                value={selectedRegion}
                onChange={setSelectedRegion}
                className="w-32"
                size="small"
              >
                <Select.Option value="all">All Regions</Select.Option>
                <Select.Option value="mumbai">Mumbai</Select.Option>
                <Select.Option value="delhi">Delhi</Select.Option>
                <Select.Option value="bangalore">Bangalore</Select.Option>
              </Select>

              <Button
                icon={<RefreshCw size={16} />}
                onClick={refetch}
                loading={loading}
                size="small"
              >
                Refresh
              </Button>

              <Button
                icon={<Download size={16} />}
                onClick={() => handleExport('excel')}
                size="small"
              >
                Export
              </Button>

              <Button
                type="primary"
                danger
                onClick={onLogout}
                size="small"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/30 dark:border-gray-700/30">
              <Statistic
                title="Total Bookings"
                value={dashboardStats.totalBookings}
                prefix={<Calendar className="text-blue-500" size={20} />}
                suffix={
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp size={14} className="text-green-600" />
                    <span className="text-green-600">+{dashboardStats.growthRate}%</span>
                  </div>
                }
              />
            </Card>

            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/30 dark:border-gray-700/30">
              <Statistic
                title="Total Revenue"
                value={dashboardStats.totalRevenue}
                formatter={(value) => Formatters.currency(Number(value))}
                prefix={<DollarSign className="text-green-500" size={20} />}
              />
            </Card>

            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/30 dark:border-gray-700/30">
              <Statistic
                title="Commission Earned"
                value={dashboardStats.totalCommission}
                formatter={(value) => Formatters.currency(Number(value))}
                prefix={<TrendingUp className="text-purple-500" size={20} />}
              />
            </Card>

            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/30 dark:border-gray-700/30">
              <Statistic
                title="Conversion Rate"
                value={dashboardStats.conversionRate}
                suffix="%"
                prefix={<Users className="text-orange-500" size={20} />}
              />
            </Card>
          </div>
        )}

        {/* Date Range Filter */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-700/30 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="text-gray-600 dark:text-gray-400" size={20} />
              <span className="font-medium text-gray-800 dark:text-gray-200">Date Range:</span>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                format="DD/MM/YYYY"
              />
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing data for {userRole} • {user?.region || 'All Regions'}
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {analytics && (
          <AnalyticsDashboard
            data={analytics}
            userRole={userRole}
            onRefresh={refetch}
            onExport={handleExport}
            loading={loading}
          />
        )}

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card 
            title="Performance Trends" 
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/30 dark:border-gray-700/30"
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Booking Success Rate</span>
                  <span className="text-sm text-green-600">85%</span>
                </div>
                <Progress percent={85} strokeColor="#10b981" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-blue-600">92%</span>
                </div>
                <Progress percent={92} strokeColor="#3b82f6" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm text-purple-600">78%</span>
                </div>
                <Progress percent={78} strokeColor="#8b5cf6" />
              </div>
            </div>
          </Card>

          <Card 
            title="Quick Actions" 
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/30 dark:border-gray-700/30"
          >
            <div className="space-y-3">
              <Button
                block
                icon={<Eye size={16} />}
                className="text-left"
              >
                View All Bookings
              </Button>
              
              <Button
                block
                icon={<BarChart3 size={16} />}
                className="text-left"
              >
                Generate Report
              </Button>
              
              <Button
                block
                icon={<Users size={16} />}
                className="text-left"
              >
                Customer Management
              </Button>
              
              <Button
                block
                icon={<Settings size={16} />}
                className="text-left"
              >
                Dashboard Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;
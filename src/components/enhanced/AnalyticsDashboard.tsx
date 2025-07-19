import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card, Statistic, Select, DatePicker, Button, Progress } from 'antd';
import { AnalyticsData, MonthlyData, RegionalData } from '../../types/enhanced';
import { Formatters } from '../../utils/formatters';
import dayjs from 'dayjs';

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  userRole: string;
  onRefresh: () => void;
  onExport: (format: 'pdf' | 'excel') => void;
  loading?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  userRole,
  onRefresh,
  onExport,
  loading = false
}) => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp size={16} className="text-green-600" />;
    if (growth < 0) return <TrendingUp size={16} className="text-red-600 rotate-180" />;
    return null;
  };

  const renderKPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white/60 backdrop-blur-sm border-white/30">
        <Statistic
          title="Total Bookings"
          value={data.bookings.total}
          prefix={<Calendar className="text-blue-500" size={20} />}
          suffix={
            <div className="flex items-center gap-1 text-sm">
              {getGrowthIcon(15)}
              <span className={getGrowthColor(15)}>+15%</span>
            </div>
          }
        />
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-white/30">
        <Statistic
          title="Total Revenue"
          value={data.revenue.total}
          formatter={(value) => Formatters.currency(Number(value))}
          prefix={<DollarSign className="text-green-500" size={20} />}
          suffix={
            <div className="flex items-center gap-1 text-sm">
              {getGrowthIcon(data.revenue.growth)}
              <span className={getGrowthColor(data.revenue.growth)}>
                {data.revenue.growth > 0 ? '+' : ''}{data.revenue.growth.toFixed(1)}%
              </span>
            </div>
          }
        />
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-white/30">
        <Statistic
          title="Conversion Rate"
          value={data.bookings.conversionRate}
          suffix="%"
          prefix={<TrendingUp className="text-purple-500" size={20} />}
        />
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-white/30">
        <Statistic
          title="Customer Satisfaction"
          value={data.customers.satisfaction}
          suffix="/5"
          prefix={<Users className="text-orange-500" size={20} />}
        />
      </Card>
    </div>
  );

  const renderBookingsByStatus = () => (
    <Card 
      title="Bookings by Status" 
      className="bg-white/60 backdrop-blur-sm border-white/30 mb-6"
      extra={
        <Select
          value={selectedMetric}
          onChange={setSelectedMetric}
          className="w-32"
        >
          <Select.Option value="count">Count</Select.Option>
          <Select.Option value="revenue">Revenue</Select.Option>
        </Select>
      }
    >
      <div className="space-y-4">
        {Object.entries(data.bookings.byStatus).map(([status, count]) => {
          const percentage = (count / data.bookings.total) * 100;
          const statusColors: Record<string, string> = {
            'Confirmed': '#10b981',
            'Pending': '#f59e0b',
            'Cancelled': '#ef4444',
            'Completed': '#3b82f6'
          };

          return (
            <div key={status} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium capitalize">{status}</span>
                <span className="text-sm text-gray-600">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress
                percent={percentage}
                strokeColor={statusColors[status] || '#6b7280'}
                showInfo={false}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );

  const renderRevenueChart = () => (
    <Card 
      title="Revenue Trend" 
      className="bg-white/60 backdrop-blur-sm border-white/30 mb-6"
      extra={
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
        />
      }
    >
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Revenue chart visualization</p>
          <p className="text-sm text-gray-500">
            Monthly revenue: {data.revenue.byMonth.map(m => Formatters.currency(m.value)).join(', ')}
          </p>
        </div>
      </div>
    </Card>
  );

  const renderRegionalPerformance = () => (
    <Card 
      title="Regional Performance" 
      className="bg-white/60 backdrop-blur-sm border-white/30 mb-6"
    >
      <div className="space-y-4">
        {data.revenue.byRegion.map((region) => (
          <div key={region.region} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{region.region}</span>
              <div className="text-right">
                <div className="font-semibold">{Formatters.currency(region.value)}</div>
                <div className="text-sm text-gray-600">{region.percentage.toFixed(1)}%</div>
              </div>
            </div>
            <Progress
              percent={region.percentage}
              strokeColor="#3b82f6"
              showInfo={false}
            />
          </div>
        ))}
      </div>
    </Card>
  );

  const renderTopPerformers = () => (
    <Card 
      title="Top Performing Agents" 
      className="bg-white/60 backdrop-blur-sm border-white/30"
    >
      <div className="space-y-4">
        {data.performance.agents.slice(0, 5).map((agent, index) => (
          <div key={agent.agentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {index + 1}
              </div>
              <div>
                <div className="font-medium">{agent.agentName}</div>
                <div className="text-sm text-gray-600">
                  {agent.bookings} bookings • {agent.efficiency}% efficiency
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{Formatters.currency(agent.revenue)}</div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
          <p className="text-gray-600">
            Performance insights for {userRole.toLowerCase()} operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            icon={<RefreshCw size={16} />}
            onClick={onRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <Select
            defaultValue="pdf"
            className="w-32"
            onChange={(format) => onExport(format as 'pdf' | 'excel')}
          >
            <Select.Option value="pdf">Export PDF</Select.Option>
            <Select.Option value="excel">Export Excel</Select.Option>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      {renderKPICards()}

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {renderBookingsByStatus()}
          {renderRegionalPerformance()}
        </div>
        <div className="space-y-6">
          {renderRevenueChart()}
          {renderTopPerformers()}
        </div>
      </div>

      {/* Customer Demographics */}
      {userRole === 'Super Admin' && (
        <Card 
          title="Customer Demographics" 
          className="bg-white/60 backdrop-blur-sm border-white/30"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.customers.demographics.map((demo) => (
              <div key={demo.category}>
                <h4 className="font-medium mb-3">{demo.category}</h4>
                <div className="space-y-2">
                  {demo.segments.map((segment) => (
                    <div key={segment.label} className="flex justify-between items-center">
                      <span className="text-sm">{segment.label}</span>
                      <span className="text-sm font-medium">{segment.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
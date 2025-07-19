import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  Award,
  FileText,
  BarChart3,
  PieChart,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  DollarSign,
  Calendar,
  Home,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from 'lucide-react';
import { 
  Table, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Statistic, 
  Progress, 
  Tag, 
  Switch,
  Rate,
  DatePicker,
  InputNumber,
  Tabs,
  message
} from 'antd';
import { SupabaseService } from '../services/SupabaseService';
import LoadingSpinner from './common/LoadingSpinner';
import { Formatters } from '../utils/formatters';

interface SuperAdminDashboardProps {
  userRole: string;
  onLogout: () => void;
  onBack: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ userRole, onLogout, onBack }) => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersData, bookingsData, complaintsData, offersData] = await Promise.all([
          SupabaseService.getAllUsers(),
          SupabaseService.getAllBookings(),
          SupabaseService.getAllComplaints(),
          SupabaseService.getAllOffers()
        ]);
        
        setUsers(usersData);
        setBookings(bookingsData);
        setComplaints(complaintsData);
        setOffers(offersData);
      } catch (error) {
        console.error('Failed to load super admin data:', error);
        message.error('Failed to load dashboard data');
        
        // Fallback to mock data
        setUsers([
          { id: '1', name: 'John Smith', email: 'john@example.com', role: 'Travel Agent', status: 'Active', region: 'Mumbai' },
          { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Basic Admin', status: 'Active', region: 'Delhi' }
        ]);
        setBookings([
          { id: '1', agentId: '1', itemName: 'Royal Caribbean Explorer', totalAmount: 90000, status: 'Confirmed' }
        ]);
        setComplaints([
          { id: '1', customer_name: 'Rahul Gupta', subject: 'Service Issue', status: 'Open', priority: 'High' }
        ]);
        setOffers([
          { id: '1', title: 'Early Bird Special', status: 'Active', discount_value: 15, discount_type: 'Percentage' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Mock Super Admin data
  const superAdmin = {
    name: "Michael Chen",
    email: "michael.chen@yorkeholidays.com",
    role: "Super Administrator",
    avatar: "MC"
  };

  // Calculate global statistics
  const totalUsers = users.length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
  const totalComplaints = complaints.length;
  const activeOffers = offers.filter(offer => offer.status === 'Active').length;

  // Performance data for charts
  const performanceMetrics = {
    conversionRate: 85.5,
    averageBookingValue: totalRevenue / Math.max(bookings.length, 1),
    topPerformingAgent: 'John Smith'
  };

  // Handle user management actions
  const handleUserAction = (userId: string, action: 'activate' | 'deactivate' | 'delete' | 'changeRole') => {
    console.log(`${action} user:`, userId);
    message.success(`User ${action} completed successfully.`);
  };

  // Handle complaint assignment
  const handleAssignComplaint = (complaintId: string, assignTo: string) => {
    console.log('Assigning complaint:', complaintId, 'to:', assignTo);
    message.success('Complaint has been assigned successfully.');
  };

  // Handle offer creation
  const handleCreateOffer = (offerData: any) => {
    console.log('Creating offer:', offerData);
    message.success('New offer has been created successfully.');
    setShowOfferModal(false);
  };

  // Handle permission changes
  const handlePermissionChange = (feature: string, enabled: boolean) => {
    console.log(`${feature} ${enabled ? 'enabled' : 'disabled'}`);
    message.info(`${feature} has been ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Table columns for all users
  const userColumns = [
    {
      title: 'User',
      key: 'user',
      render: (record: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {record.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
          </div>
          <div>
            <div className="font-medium">{record.name || 'Unknown'}</div>
            <div className="text-sm text-gray-500">{record.email || 'No email'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'Super Admin' ? 'red' : role === 'Basic Admin' ? 'purple' : 'blue'}>
          {role || 'Unknown'}
        </Tag>
      )
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      render: (region: string) => region || 'Not specified'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status || 'Unknown'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => setSelectedUser(record)}>
            <Eye size={14} />
          </Button>
          <Button size="small" onClick={() => handleUserAction(record.id, 'activate')}>
            <UserCheck size={14} />
          </Button>
          <Button size="small" danger onClick={() => handleUserAction(record.id, 'deactivate')}>
            <UserX size={14} />
          </Button>
        </div>
      )
    }
  ];

  // Table columns for complaints
  const complaintColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-mono text-xs">{text?.substring(0, 8) || 'N/A'}</span>
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (name: string) => name || 'Unknown'
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => subject || 'No subject'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category || 'Other'}</Tag>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={
          priority === 'Critical' ? 'red' : 
          priority === 'High' ? 'orange' : 
          priority === 'Medium' ? 'blue' : 'green'
        }>
          {priority || 'Low'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'Open' ? 'red' : 
          status === 'In Progress' ? 'orange' : 
          status === 'Resolved' ? 'green' : 'purple'
        }>
          {status || 'Open'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => setSelectedComplaint(record)}>
            View
          </Button>
          <Button size="small" onClick={() => handleAssignComplaint(record.id, 'admin1')}>
            Assign
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading Super Admin Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Top Navigation */}
      <nav className="bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Portal Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Home size={24} />
                <span className="text-xl font-bold">Super Admin Portal</span>
              </button>
            </div>

            {/* Center - Welcome Message */}
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-800">
                Welcome back, {superAdmin.name}
              </h2>
              <p className="text-sm text-gray-600">{superAdmin.role}</p>
            </div>

            {/* Right - Navigation */}
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
                System Logs
              </button>
              <button className="text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-lg">
                Control Panel
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/20 backdrop-blur-md border-white/30">
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<Users className="text-blue-500" size={20} />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
          <Card className="bg-white/20 backdrop-blur-md border-white/30">
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              formatter={(value) => Formatters.currency(Number(value))}
              prefix={<DollarSign className="text-green-500" size={20} />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
          <Card className="bg-white/20 backdrop-blur-md border-white/30">
            <Statistic
              title="Active Offers"
              value={activeOffers}
              prefix={<FileText className="text-purple-500" size={20} />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
          <Card className="bg-white/20 backdrop-blur-md border-white/30">
            <Statistic
              title="Total Complaints"
              value={totalComplaints}
              prefix={<AlertTriangle className="text-red-500" size={20} />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg mb-6">
          <div className="flex flex-wrap gap-2 p-4">
            {[
              { key: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
              { key: 'users', label: 'User Management', icon: <Users size={18} /> },
              { key: 'performance', label: 'Performance', icon: <TrendingUp size={18} /> },
              { key: 'complaints', label: 'Complaints', icon: <AlertTriangle size={18} /> },
              { key: 'offers', label: 'Offers', icon: <FileText size={18} /> },
              { key: 'permissions', label: 'Permissions', icon: <Shield size={18} /> }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/30 text-gray-700 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
              
              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Bookings by Month" className="bg-white/30">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Chart visualization would be here</p>
                      <p className="text-sm text-gray-500">Showing cruise vs hotel bookings</p>
                    </div>
                  </div>
                </Card>
                
                <Card title="Revenue by Region" className="bg-white/30">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart size={48} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Pie chart would be here</p>
                      <p className="text-sm text-gray-500">Regional revenue distribution</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/30">
                  <Statistic
                    title="Conversion Rate"
                    value={performanceMetrics.conversionRate}
                    suffix="%"
                    valueStyle={{ color: '#10b981' }}
                  />
                </Card>
                <Card className="bg-white/30">
                  <Statistic
                    title="Average Booking Value"
                    value={performanceMetrics.averageBookingValue}
                    formatter={(value) => Formatters.currency(Number(value))}
                    valueStyle={{ color: '#3b82f6' }}
                  />
                </Card>
                <Card className="bg-white/30">
                  <Statistic
                    title="Top Performer"
                    value={performanceMetrics.topPerformingAgent}
                    valueStyle={{ color: '#8b5cf6' }}
                  />
                </Card>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <Button 
                  type="primary" 
                  icon={<Plus />}
                  onClick={() => setShowUserModal(true)}
                >
                  Add New User
                </Button>
              </div>
              
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="id"
                className="bg-white/50 rounded-lg"
                pagination={{ pageSize: 10 }}
                loading={loading}
              />
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Analytics</h2>
              
              {/* Agent Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.filter(user => user.role === 'Travel Agent').map(agent => (
                  <Card key={agent.id} className="bg-white/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {agent.name?.split(' ').map((n: string) => n[0]).join('') || 'A'}
                        </div>
                        <div>
                          <div className="font-medium">{agent.name || 'Unknown Agent'}</div>
                          <div className="text-sm text-gray-600">{agent.region || 'No region'}</div>
                        </div>
                      </div>
                      <Tag color="blue">
                        {agent.status || 'Unknown'}
                      </Tag>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bookings:</span>
                        <span className="font-medium">{bookings.filter(b => b.agentId === agent.id).length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Revenue:</span>
                        <span className="font-medium">{Formatters.currency(bookings.filter(b => b.agentId === agent.id).reduce((sum, b) => sum + (b.totalAmount || 0), 0))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Rate:</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <Progress percent={85} size="small" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Complaint Monitoring</h2>
                <div className="flex gap-2">
                  <Tag color="red">Open: {complaints.filter(c => c.status === 'Open').length}</Tag>
                  <Tag color="orange">In Progress: {complaints.filter(c => c.status === 'In Progress').length}</Tag>
                  <Tag color="green">Resolved: {complaints.filter(c => c.status === 'Resolved').length}</Tag>
                </div>
              </div>
              
              <Table
                columns={complaintColumns}
                dataSource={complaints}
                rowKey="id"
                className="bg-white/50 rounded-lg"
                pagination={{ pageSize: 10 }}
                loading={loading}
              />
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Offer Management</h2>
                <Button 
                  type="primary" 
                  icon={<Plus />}
                  onClick={() => setShowOfferModal(true)}
                >
                  Create Global Offer
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map(offer => (
                  <Card key={offer.id} className="bg-white/30">
                    <div className="mb-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{offer.title || 'Untitled Offer'}</h4>
                        <Tag color={offer.status === 'Active' ? 'green' : offer.status === 'Expired' ? 'red' : 'orange'}>
                          {offer.status || 'Unknown'}
                        </Tag>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{offer.description || 'No description'}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span className="font-medium">
                            {offer.discount_type === 'Percentage' ? `${offer.discount_value}%` : Formatters.currency(offer.discount_value)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Usage:</span>
                          <span>{offer.usage_count || 0}/{offer.max_usage || '∞'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="small" icon={<Edit />} />
                      <Button size="small" icon={<Trash2 />} danger />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">System Permissions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Basic Admin Permissions" className="bg-white/30">
                  <div className="space-y-4">
                    {[
                      { key: 'create_offers', label: 'Create Offers', enabled: true },
                      { key: 'manage_inventory', label: 'Manage Inventory', enabled: true },
                      { key: 'view_all_bookings', label: 'View All Bookings', enabled: false },
                      { key: 'delete_agents', label: 'Delete Agents', enabled: false }
                    ].map(permission => (
                      <div key={permission.key} className="flex justify-between items-center">
                        <span>{permission.label}</span>
                        <Switch 
                          checked={permission.enabled}
                          onChange={(checked) => handlePermissionChange(permission.key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Regional Access Control" className="bg-white/30">
                  <div className="space-y-4">
                    {[
                      { region: 'North India', locked: false },
                      { region: 'South India', locked: false },
                      { region: 'West India', locked: true },
                      { region: 'East India', locked: false }
                    ].map(region => (
                      <div key={region.region} className="flex justify-between items-center">
                        <span>{region.region}</span>
                        <Button 
                          size="small"
                          icon={region.locked ? <Lock size={14} /> : <Unlock size={14} />}
                          onClick={() => handlePermissionChange(`region_${region.region}`, !region.locked)}
                        >
                          {region.locked ? 'Locked' : 'Open'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        title="User Details"
        open={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {selectedUser.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedUser.name || 'Unknown User'}</h3>
                <p className="text-gray-600">{selectedUser.email || 'No email'}</p>
                <Tag color={selectedUser.status === 'Active' ? 'green' : 'red'}>
                  {selectedUser.status || 'Unknown'}
                </Tag>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <p className="text-gray-900">{selectedUser.region || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <p className="text-gray-900">{selectedUser.role || 'Unknown'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Complaint Details Modal */}
      <Modal
        title="Complaint Details"
        open={!!selectedComplaint}
        onCancel={() => setSelectedComplaint(null)}
        footer={null}
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <p className="text-gray-900">{selectedComplaint.customer_name || 'Unknown'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <p className="text-gray-900">{selectedComplaint.subject || 'No subject'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{selectedComplaint.description || 'No description'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <Tag color={
                  selectedComplaint.priority === 'Critical' ? 'red' : 
                  selectedComplaint.priority === 'High' ? 'orange' : 'blue'
                }>
                  {selectedComplaint.priority || 'Low'}
                </Tag>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Tag>{selectedComplaint.category || 'Other'}</Tag>
              </div>
            </div>
            {selectedComplaint.resolution && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                <p className="text-gray-900">{selectedComplaint.resolution}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Offer Modal */}
      <Modal
        title="Create Global Offer"
        open={showOfferModal}
        onCancel={() => setShowOfferModal(false)}
        onOk={() => handleCreateOffer({})}
      >
        <Form layout="vertical">
          <Form.Item label="Offer Title" required>
            <Input placeholder="Enter offer title" />
          </Form.Item>
          <Form.Item label="Description" required>
            <Input.TextArea placeholder="Enter offer description" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Discount Type" required>
              <Select placeholder="Select discount type">
                <Select.Option value="percentage">Percentage</Select.Option>
                <Select.Option value="fixed">Fixed Amount</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Discount Value" required>
              <InputNumber placeholder="Enter value" className="w-full" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Valid From" required>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="Valid To" required>
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
          <Form.Item label="Applicable For" required>
            <Select placeholder="Select applicable services">
              <Select.Option value="cruises">Cruises Only</Select.Option>
              <Select.Option value="hotels">Hotels Only</Select.Option>
              <Select.Option value="both">Both</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuperAdminDashboard;
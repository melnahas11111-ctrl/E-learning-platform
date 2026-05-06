// frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  Settings,
  Database,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Copy,
  LogOut,
  BarChart3,
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [qrTokens, setQrTokens] = useState([]);
  const [backupLogs, setBackupLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    position: '',
    organization: '',
    phone: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdminInfo();
    if (activeTab === 'dashboard') fetchDashboardStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'qr') fetchQRTokens();
    if (activeTab === 'backups') fetchBackupLogs();
  }, [activeTab]);

  const fetchAdminInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://api.elearning-platform.qa/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdminInfo(data);
      }
    } catch (err) {
      console.error('Error fetching admin info:', err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('https://api.elearning-platform.qa/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setDashboardStats(data.metrics);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('https://api.elearning-platform.qa/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchQRTokens = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('https://api.elearning-platform.qa/api/admin/qr-tokens', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch QR tokens');
      const data = await response.json();
      setQrTokens(data.tokens || []);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackupLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('https://api.elearning-platform.qa/api/admin/backups/logs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch backup logs');
      const data = await response.json();
      setBackupLogs(data.logs || []);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('https://api.elearning-platform.qa/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          temporaryPassword: Math.random().toString(36).slice(-12),
        }),
      });

      if (!response.ok) throw new Error('Failed to create user');
      
      setMessage('✅ User created successfully!');
      setShowUserForm(false);
      setFormData({ email: '', fullName: '', position: '', organization: '', phone: '' });
      fetchUsers();
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateQRToken = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('https://api.elearning-platform.qa/api/admin/qr-tokens/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expirationDays: 30 }),
      });

      if (!response.ok) throw new Error('Failed to generate QR token');
      
      setMessage('✅ QR token generated successfully!');
      fetchQRTokens();
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerFullBackup = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('https://api.elearning-platform.qa/api/admin/backups/full', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to trigger backup');
      
      setMessage('✅ Full backup initiated!');
      fetchBackupLogs();
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage('📋 Copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with ACES Logo */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <img
              src="/logo/aces-logo.png"
              alt="ACES Logo"
              className="h-12 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="border-l-2 border-gray-300 pl-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Platform Management
              </p>
            </div>
          </div>

          {/* Admin Info and Logout */}
          <div className="flex items-center space-x-6">
            {adminInfo && (
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {adminInfo.full_name}
                </p>
                <p className="text-sm text-gray-600">
                  Administrator
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Message Alert */}
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'qr', label: 'QR Enrollment', icon: Upload },
            { id: 'backups', label: 'Backups', icon: Database },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'border-b-2 border-yellow-500 text-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <Clock className="w-8 h-8 text-yellow-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            ) : dashboardStats ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {dashboardStats.users?.total || 0}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500 opacity-50" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 text-sm">Courses Completed</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {dashboardStats.courses?.completed || 0}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 text-sm">Pass Rate</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {dashboardStats.assessments?.passedCount 
                            ? Math.round((dashboardStats.assessments.passedCount / dashboardStats.assessments.totalAttempts) * 100)
                            : 0}%
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-500 opacity-50" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 text-sm">Active Assessments</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {dashboardStats.assessments?.totalAttempts || 0}
                        </p>
                      </div>
                      <AlertCircle className="w-8 h-8 text-yellow-500 opacity-50" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {dashboardStats.recentActivity && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-2">
                      {dashboardStats.recentActivity.slice(0, 5).map((activity, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <span className="text-gray-700">{activity.action_type}</span>
                          <span className="text-sm text-gray-600">{activity.count} events</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-600">No data available</p>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <button
              onClick={() => setShowUserForm(!showUserForm)}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              + Create New User
            </button>

            {showUserForm && (
              <form onSubmit={createUser} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    placeholder="Organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </form>
            )}

            <div className="grid gap-4">
              {loading ? (
                <p className="text-gray-600">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-600">No users found</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center hover:shadow-lg transition-shadow"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">{user.full_name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.position}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* QR Tokens Tab */}
        {activeTab === 'qr' && (
          <div className="space-y-6">
            <button
              onClick={generateQRToken}
              disabled={loading}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Generating...' : '+ Generate QR Token'}
            </button>

            <div className="grid gap-4">
              {qrTokens.length === 0 ? (
                <p className="text-gray-600">No QR tokens generated yet</p>
              ) : (
                qrTokens.map((token) => (
                  <div
                    key={token.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2 break-all">
                          {token.token_uuid}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          Status: {token.is_used ? '✅ Used' : '⏳ Available'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Expires: {new Date(token.expiration_date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(token.token_uuid)}
                        className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Copy className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Backups Tab */}
        {activeTab === 'backups' && (
          <div className="space-y-6">
            <button
              onClick={triggerFullBackup}
              disabled={loading}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Backing up...' : 'Backup Now'}
            </button>

            <div className="grid gap-4">
              {backupLogs.length === 0 ? (
                <p className="text-gray-600">No backup logs available</p>
              ) : (
                backupLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {log.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : log.status === 'in-progress' ? (
                            <Clock className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          <h4 className="font-semibold text-gray-900">
                            {log.backup_type.toUpperCase()} Backup
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(log.backup_timestamp).toLocaleString()}
                        </p>
                        {log.size_bytes && (
                          <p className="text-xs text-gray-500">
                            Size: {(log.size_bytes / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                          log.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : log.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer with ACES Branding */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            E-Learning Platform © 2024 ACES Company
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Qatar Ministry of Public Health | Food Sample Collection Training
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;

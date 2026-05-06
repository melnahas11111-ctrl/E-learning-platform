// frontend/src/components/TraineeDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  BarChart3,
  LogOut,
} from 'lucide-react';

const TraineeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchUserInfo();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('https://api.elearning-platform.qa/api/progress/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
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
        setUserInfo(data);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  const getCourseProgress = (course) => {
    const percentage = Math.round(course.progress_percentage || 0);
    return percentage;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg m-4">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with ACES Logo */}
      <header className="bg-white shadow-md sticky top-0 z-50">
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
                E-Learning Platform
              </h1>
              <p className="text-sm text-gray-600">
                Food Sample Collection Training
              </p>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-6">
            {userInfo && (
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {userInfo.full_name || 'User'}
                </p>
                <p className="text-sm text-gray-600">
                  {userInfo.position || 'Trainee'}
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Your Learning Dashboard
          </h2>
          <p className="text-gray-600">
            Track your progress and complete the Food Sample Collection training course
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {['overview', 'modules', 'assessments', 'resources'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-yellow-500 text-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Course Progress Cards */}
            {dashboardData?.courses?.map((course) => {
              const progress = getCourseProgress(course);
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {course.course_id}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Version {course.version}
                      </p>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      course.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : course.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Course Progress
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {dashboardData?.modules?.filter(m => m.status === 'completed').length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Modules Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {dashboardData?.assessments?.filter(a => a.passing_status).length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Assessments Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {dashboardData?.assessments?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Assessments Taken</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Time Spent</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {Math.round((dashboardData?.modules?.reduce((sum, m) => sum + (m.time_spent_seconds || 0), 0) || 0) / 3600)}h
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Overall Grade</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {dashboardData?.assessments?.length > 0
                        ? Math.round(
                            dashboardData.assessments.reduce((sum, a) => sum + (a.score || 0), 0) /
                            dashboardData.assessments.length
                          )
                        : '-'}%
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-500 opacity-50" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Modules Completed</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {dashboardData?.modules?.filter(m => m.status === 'completed').length || 0}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-500 opacity-50" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pass Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {dashboardData?.assessments?.length > 0
                        ? Math.round(
                            (dashboardData.assessments.filter(a => a.passing_status).length /
                            dashboardData.assessments.length) * 100
                          )
                        : '-'}%
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-yellow-500 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            {dashboardData?.modules?.map((module, index) => (
              <div
                key={module.id}
                className="bg-white rounded-lg shadow-md p-6 flex items-start justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                      Module {index + 1}
                    </span>
                    {module.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {module.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {module.status === 'completed' && module.completion_time
                      ? `Completed on ${new Date(module.completion_time).toLocaleDateString()}`
                      : `Status: ${module.status}`}
                  </p>
                </div>
                <div className="flex items-center ml-4">
                  {module.status === 'completed' ? (
                    <span className="text-green-600 font-medium">✓ Complete</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">In Progress</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div className="space-y-4">
            {dashboardData?.assessments?.map((assessment, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {assessment.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Score: {assessment.score}% | Status: {assessment.passing_status ? 'Passed' : 'Failed'}
                    </p>
                  </div>
                  {assessment.passing_status ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📚 Course Resources
            </h3>
            <div className="space-y-3">
              <a
                href="/resources/iso-6887-1.pdf"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
              >
                <Download className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-gray-900 font-medium">ISO 6887-1 Standard Documentation</span>
              </a>
              <a
                href="/resources/iso-6887-2.pdf"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
              >
                <Download className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-gray-900 font-medium">ISO 6887-2: Meat & Products</span>
              </a>
              <a
                href="/resources/iso-6887-3.pdf"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
              >
                <Download className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-gray-900 font-medium">ISO 6887-3: Fish & Fishery Products</span>
              </a>
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

export default TraineeDashboard;

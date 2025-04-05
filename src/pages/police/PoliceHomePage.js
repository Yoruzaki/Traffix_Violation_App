import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { 
  FaExclamationTriangle, 
  FaBell, 
  FaSignOutAlt, 
  FaUserShield, 
  FaTrafficLight,
  FaChartLine,
  FaSearch,
  FaPlus
} from 'react-icons/fa';
import { GiPoliceBadge, GiPoliceCar } from 'react-icons/gi';
import { MdOutlineDashboard } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import ViolationChart from '../../components/ViolationChart';

const PoliceHomePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call for notifications
    const fetchNotifications = () => {
      const mockNotifications = [
        { 
          id: 1, 
          title: 'New Violation Reported', 
          message: 'Speeding violation recorded for vehicle DZ-123ABC', 
          time: '2 mins ago', 
          is_read: false 
        },
        { 
          id: 2, 
          title: 'System Update', 
          message: 'New system update available for review', 
          time: '1 hour ago', 
          is_read: true 
        },
        { 
          id: 3, 
          title: 'Checkpoint Reminder', 
          message: 'Scheduled checkpoint at Main Street at 15:00', 
          time: '3 hours ago', 
          is_read: false 
        }
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
    };
    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    if (id === 'all') {
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } else {
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    }
  };

  const handleAddViolation = () => {
    navigate('/police/violation-entry');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white">
          <div className="flex items-center justify-center h-16 px-4 border-b border-blue-700">
            <GiPoliceBadge className="h-8 w-8 text-blue-300" />
            <span className="ml-2 text-xl font-bold">TRAFFIX</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            <NavItem 
              icon={<MdOutlineDashboard />} 
              text="Dashboard" 
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <NavItem 
              icon={<FaExclamationTriangle />} 
              text="Violations" 
              active={activeTab === 'violations'}
              onClick={() => setActiveTab('violations')}
            />
            <NavItem 
              icon={<GiPoliceCar />} 
              text="Patrols" 
              active={activeTab === 'patrols'}
              onClick={() => setActiveTab('patrols')}
            />
            <NavItem 
              icon={<FaTrafficLight />} 
              text="Checkpoints" 
              active={activeTab === 'checkpoints'}
              onClick={() => setActiveTab('checkpoints')}
            />
            <NavItem 
              icon={<FaChartLine />} 
              text="Analytics" 
              active={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
            />
          </nav>
          <div className="p-4 border-t border-blue-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <FaUserShield />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-blue-300">{user?.station}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button className="md:hidden text-gray-500 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="relative ml-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search violations, vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 relative"
              >
                <FaBell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              <button 
                onClick={logout}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </div>
          </div>
        </header>

        {/* Notification Panel */}
        {showNotificationPanel && (
          <div className="absolute right-4 top-16 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                <button 
                  onClick={() => markAsRead('all')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      if (!notification.is_read) markAsRead(notification.id);
                    }}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-gray-200 text-center">
              <button 
                onClick={() => navigate('/shared/notifications')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all notifications
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back, {user?.name}. Here's what's happening today.</p>
              </div>
              <button
                onClick={handleAddViolation}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <FaPlus className="mr-2" />
                Add Violation
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard 
                title="Today's Violations" 
                value="24" 
                change="+12%"
                icon={<FaExclamationTriangle className="text-blue-500" />}
                trend="up"
              />
              <StatCard 
                title="Fines Collected" 
                value="DA 48,500" 
                change="+8%"
                icon={<GiPoliceBadge className="text-green-500" />}
                trend="up"
              />
              <StatCard 
                title="Pending Cases" 
                value="7" 
                change="-2"
                icon={<FaTrafficLight className="text-yellow-500" />}
                trend="down"
              />
              <StatCard 
                title="Avg. Response Time" 
                value="14m" 
                change="-3m"
                icon={<GiPoliceCar className="text-red-500" />}
                trend="down"
              />
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Violation Trends</h2>
                  <select className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <ViolationChart />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <ActivityItem 
                      key={item}
                      type="violation"
                      title="Speeding violation"
                      description="Vehicle DZ-123ABC456"
                      time="15 minutes ago"
                      status="completed"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ActionButton 
                  icon={<FaExclamationTriangle />}
                  text="New Violation"
                  color="bg-blue-100 text-blue-600"
                  onClick={handleAddViolation}
                />
                <ActionButton 
                  icon={<GiPoliceCar />}
                  text="Start Patrol"
                  color="bg-green-100 text-green-600"
                />
                <ActionButton 
                  icon={<FaTrafficLight />}
                  text="Set Checkpoint"
                  color="bg-purple-100 text-purple-600"
                />
                <ActionButton 
                  icon={<FaChartLine />}
                  text="Generate Report"
                  color="bg-yellow-100 text-yellow-600"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${
        active ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white'
      }`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      {text}
    </button>
  );
};

const StatCard = ({ title, value, change, icon, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-opacity-20 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className={`mt-4 text-sm flex items-center ${
        trend === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        {trend === 'up' ? (
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
          </svg>
        )}
        {change}
      </div>
    </div>
  );
};

const ActivityItem = ({ type, title, description, time, status }) => {
  const getIcon = () => {
    switch(type) {
      case 'violation': return <FaExclamationTriangle className="text-red-500" />;
      case 'patrol': return <GiPoliceCar className="text-blue-500" />;
      default: return <FaBell className="text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1 mr-3">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          {getIcon()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
      <div className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status}
      </div>
    </div>
  );
};

const ActionButton = ({ icon, text, color, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-lg ${color} hover:opacity-90 transition`}
    >
      <span className="text-xl mb-2">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
};

export default PoliceHomePage;
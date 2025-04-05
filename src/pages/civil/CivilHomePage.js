import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaUser, FaCar, FaPhone, FaIdCard, FaBell, FaSignOutAlt, FaQuestionCircle, FaFilter } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { MdWarning, MdPayment } from 'react-icons/md';
import Logo from '../../assets/logo.png'; // Replace with your actual logo path
import bdlLogo from './bdl-logo.png'; // Make sure these files exist
import edhahabiaLogo from './dhahabia-logo.png'; // in the same directory

const CivilHomePage = () => {
  const { user, logout } = useAuth();
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showViolationDetails, setShowViolationDetails] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await api.get('/api/violations');
        setViolations(response.data);
        setFilteredViolations(response.data);
      } catch (error) {
        console.error('Failed to fetch violations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  useEffect(() => {
    // Apply filter when filter state changes
    if (filter === 'all') {
      setFilteredViolations(violations);
    } else if (filter === 'paid') {
      setFilteredViolations(violations.filter(v => v.paid));
    } else {
      setFilteredViolations(violations.filter(v => !v.paid));
    }
  }, [filter, violations]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch (e) {
      console.error('Invalid date format:', dateString);
      return 'N/A';
    }
  };

  const handlePayViolation = async (violationId) => {
    try {
      await api.put(`/api/violations/${violationId}/pay`);
      setViolations(violations.map(v => 
        v.id === violationId ? { ...v, paid: true, payment_date: new Date().toISOString() } : v
      ));
      setShowPaymentDialog(null);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-pulse flex flex-col items-center">
          <img src={Logo} alt="Logo" className="h-16 mb-4" />
          <div className="text-blue-600 font-medium">Loading your data...</div>
        </div>
      </div>
    );
  }

  const paidCount = violations.filter(v => v.paid).length;
  const unpaidCount = violations.length - paidCount;
  const totalAmount = violations.reduce((sum, v) => sum + parseFloat(v.fine_amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* App Bar */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="h-10" />
            <h1 className="text-xl font-bold hidden sm:block">My Civil Space</h1>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-full hover:bg-blue-700 transition relative"
              title="Notifications"
            >
              <FaBell className="text-xl" />
              {unpaidCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unpaidCount}
                </span>
              )}
            </button>
            <button 
              onClick={logout}
              className="p-2 rounded-full hover:bg-blue-700 transition"
              title="Logout"
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full text-white shadow">
                <FaUser className="text-2xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaPhone className="text-blue-600" />
                </div>
                <div>
                  <span className="font-semibold">Phone:</span> {user?.phone}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaIdCard className="text-blue-600" />
                </div>
                <div>
                  <span className="font-semibold">CIN:</span> {user?.cin}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-bold text-lg mb-3">Vehicle Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaCar className="text-blue-600" />
                  </div>
                  <div>
                    <span className="font-semibold">Plate:</span> {user?.license_plate}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaCar className="text-blue-600" />
                  </div>
                  <div>
                    <span className="font-semibold">Type:</span> {user?.vehicle_type}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Total Violations" 
            value={violations.length.toString()} 
            icon={<MdWarning className="text-2xl" />} 
            gradient="from-orange-400 to-amber-500"
          />
          <StatCard 
            title="To Pay" 
            value={unpaidCount.toString()} 
            icon={<MdPayment className="text-2xl" />} 
            gradient="from-red-400 to-pink-500"
          />
          <StatCard 
            title="Total Due" 
            value={`${formatCurrency(totalAmount)} DA`} 
            icon={<GiMoneyStack className="text-2xl" />} 
            gradient="from-green-500 to-emerald-600"
          />
        </div>

        {/* Violations Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                My Violations
              </h2>
              <div className="relative">
                <button 
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg border border-blue-200 hover:border-blue-300"
                >
                  <FaFilter />
                  <span>Filter</span>
                </button>
                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div 
                      className={`px-4 py-2 cursor-pointer ${filter === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        setFilter('all');
                        setShowFilterMenu(false);
                      }}
                    >
                      All Violations
                    </div>
                    <div 
                      className={`px-4 py-2 cursor-pointer ${filter === 'paid' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        setFilter('paid');
                        setShowFilterMenu(false);
                      }}
                    >
                      Paid Only
                    </div>
                    <div 
                      className={`px-4 py-2 cursor-pointer ${filter === 'unpaid' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        setFilter('unpaid');
                        setShowFilterMenu(false);
                      }}
                    >
                      Unpaid Only
                    </div>
                  </div>
                )}
              </div>
            </div>

            {filteredViolations.length === 0 ? (
              <EmptyViolationsCard />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredViolations.map(violation => (
                  <ViolationCard 
                    key={violation.id}
                    violation={violation}
                    onViewDetails={() => setShowViolationDetails(violation)}
                    onPay={() => setShowPaymentDialog(violation)}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Help Button */}
      <button 
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        title="Help"
      >
        <FaQuestionCircle className="text-2xl" />
      </button>

      {/* Modals */}
      {showNotifications && (
        <NotificationsModal 
          onClose={() => setShowNotifications(false)}
          unpaidCount={unpaidCount}
        />
      )}

      {showHelp && (
        <HelpModal 
          onClose={() => setShowHelp(false)}
        />
      )}

      {showViolationDetails && (
        <ViolationDetailsModal 
          violation={showViolationDetails}
          onClose={() => setShowViolationDetails(null)}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />
      )}

      {showPaymentDialog && (
        <PaymentModal 
          violation={showPaymentDialog}
          onClose={() => setShowPaymentDialog(null)}
          onPay={handlePayViolation}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, gradient }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center border border-gray-100 hover:shadow-lg transition">
      <div className={`bg-gradient-to-r ${gradient} p-3 rounded-full text-white mb-2 shadow`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
};

const EmptyViolationsCard = ({ filter = 'all' }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
      <div className="text-green-400 text-5xl mb-4">✓</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">No violations found</h3>
      <p className="text-gray-600">
        {filter === 'all' 
          ? "You currently have no violations recorded." 
          : filter === 'paid' 
            ? "You have no paid violations." 
            : "You have no unpaid violations."}
      </p>
    </div>
  );
};

const ViolationCard = ({ violation, onViewDetails, onPay, formatDate, formatCurrency }) => {
  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-white border-gray-200 hover:border-blue-200"
      onClick={onViewDetails}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800">{violation.violation_type}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          violation.paid 
            ? 'bg-green-100 text-green-800' 
            : 'bg-amber-100 text-amber-800'
        }`}>
          {violation.paid ? 'Paid' : 'Pending'}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <span className="w-24 font-semibold">Date:</span>
          <span>{formatDate(violation.violation_date)}</span>
        </div>
        <div className="flex items-center">
          <span className="w-24 font-semibold">Location:</span>
          <span>{violation.location}</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg mb-4 border border-blue-100">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Amount:</span>
          <span className="text-blue-600 font-bold text-lg">
            {formatCurrency(violation.fine_amount)} DA
          </span>
        </div>
      </div>

      {!violation.paid && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPay();
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
        >
          Pay the fine
        </button>
      )}
    </div>
  );
};

const NotificationsModal = ({ onClose, unpaidCount }) => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'New violation',
      message: 'You have received a new speeding violation',
      time: 'Today, 10:30',
      icon: 'warning',
      color: 'orange',
      read: false
    },
    {
      id: 2,
      title: 'Payment confirmed',
      message: 'Your payment of 5000 DA has been confirmed',
      time: 'Yesterday, 15:45',
      icon: 'check',
      color: 'green',
      read: true
    },
    {
      id: 3,
      title: 'Payment reminder',
      message: 'You have a pending violation to pay',
      time: '12/03/2023',
      icon: 'notification',
      color: 'red',
      read: false
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Notifications
              {unpaidCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unpaidCount} new
                </span>
              )}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              &times;
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
              >
                <div className={`bg-${notification.color}-100 p-2 rounded-full flex-shrink-0`}>
                  {notification.icon === 'warning' && <MdWarning className={`text-${notification.color}-500`} />}
                  {notification.icon === 'check' && <span className={`text-${notification.color}-500`}>✓</span>}
                  {notification.icon === 'notification' && <FaBell className={`text-${notification.color}-500`} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{notification.title}</h3>
                    {!notification.read && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2">New</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};

const HelpModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Help and Support
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              &times;
            </button>
          </div>

          <p className="mb-4 text-gray-700">
            If you have questions or need assistance, please contact our customer service:
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaPhone className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Phone Support</p>
                <p className="text-gray-600">0560 123 456</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaIdCard className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Email Support</p>
                <p className="text-gray-600">support@traffic.dz</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaCar className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Visit Us</p>
                <p className="text-gray-600">123 Rue de la Paix, Alger</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ViolationDetailsModal = ({ violation, onClose, formatDate, formatCurrency }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Violation Details
          </h2>

          <div className="space-y-4">
            <div className="flex">
              <span className="w-32 font-semibold text-gray-700">Type:</span>
              <span className="text-gray-800">{violation.violation_type}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-gray-700">Date/Time:</span>
              <span className="text-gray-800">{formatDate(violation.violation_date)}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-gray-700">Location:</span>
              <span className="text-gray-800">{violation.location}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-gray-700">Plate:</span>
              <span className="text-gray-800">{violation.license_plate}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-gray-700">Amount:</span>
              <span className="text-blue-600 font-bold">{formatCurrency(violation.fine_amount)} DA</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-gray-700">Status:</span>
              <span className={`font-semibold ${
                violation.paid ? 'text-green-600' : 'text-amber-600'
              }`}>
                {violation.paid ? 'Paid' : 'Pending'}
              </span>
            </div>
            {violation.paid && (
              <div className="flex">
                <span className="w-32 font-semibold text-gray-700">Payment Date:</span>
                <span className="text-gray-800">{formatDate(violation.payment_date)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Close
            </button>
            {!violation.paid && (
              <button
                onClick={() => {
                  onClose();
                  // You might want to trigger payment here
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
              >
                Pay Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({ violation, onClose, onPay, formatCurrency }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'bdl' or 'edhahabia'
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      onPay(violation.id);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-full text-white">
              <GiMoneyStack className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Pay Fine
            </h2>
          </div>

          {/* Violation Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6 border border-blue-100">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Violation:</span>
              <span className="font-semibold text-gray-800">{violation.violation_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Amount:</span>
              <span className="font-bold text-blue-600 text-lg">
                {formatCurrency(violation.fine_amount)} DA
              </span>
            </div>
          </div>

          {/* Payment Method Selection or Form */}
          {!showPaymentForm ? (
            <>
              <p className="mb-4 text-gray-700">Select your payment method:</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* BDL Payment Option */}
                <button
                  onClick={() => {
                    setPaymentMethod('bdl');
                    setShowPaymentForm(true);
                  }}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    paymentMethod === 'bdl' 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <img 
                    src={bdlLogo} 
                    alt="BDL" 
                    className="h-12 mb-2 object-contain"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/100x50?text=BDL+Logo';
                    }}
                  />
                  <span className="font-medium">BDL</span>
                </button>
                
                {/* Edhahabia Payment Option */}
                <button
                  onClick={() => {
                    setPaymentMethod('edhahabia');
                    setShowPaymentForm(true);
                  }}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    paymentMethod === 'edhahabia' 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <img 
                    src={edhahabiaLogo} 
                    alt="Carte Edhahabia" 
                    className="h-12 mb-2 object-contain"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/100x50?text=Edhahabia';
                    }}
                  />
                  <span className="font-medium">Carte Edhahabia</span>
                </button>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmitPayment}>
              {/* Payment Method Header */}
              <div className="flex flex-col items-center mb-6">
                <img 
                  src={paymentMethod === 'bdl' ? bdlLogo : edhahabiaLogo} 
                  alt={paymentMethod === 'bdl' ? "BDL" : "Carte Edhahabia"} 
                  className="h-10 object-contain mb-2"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = paymentMethod === 'bdl' 
                      ? 'https://via.placeholder.com/150x60?text=BDL' 
                      : 'https://via.placeholder.com/150x60?text=Edhahabia';
                  }}
                />
                <h3 className="font-semibold text-gray-700">
                  {paymentMethod === 'bdl' ? 'BDL Card' : 'Carte Edhahabia'}
                </h3>
              </div>

              {/* Payment Form */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9\s]{13,19}"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      pattern="\d\d/\d\d"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="123"
                      pattern="\d{3,4}"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaIdCard className="text-blue-600 text-sm" />
                  </div>
                  <span>Your payment is secured with SSL encryption</span>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-between space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg transition shadow-md flex-1 ${
                    isProcessing ? 'opacity-70' : 'hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


export default CivilHomePage;
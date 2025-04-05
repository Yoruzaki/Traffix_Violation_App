import { useEffect, useState } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real app, you would use the API:
        // const response = await api.get('/api/notifications');
        // setNotifications(response.data);
        
        // Mock data for demonstration
        const mockNotifications = [
          { 
            id: 1, 
            title: 'New Violation Reported', 
            message: 'Speeding violation recorded for vehicle DZ-123ABC', 
            created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
            is_read: false 
          },
          { 
            id: 2, 
            title: 'System Update', 
            message: 'New system update available for review', 
            created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            is_read: true 
          },
          { 
            id: 3, 
            title: 'Checkpoint Reminder', 
            message: 'Scheduled checkpoint at Main Street at 15:00', 
            created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            is_read: false 
          },
          { 
            id: 4, 
            title: 'Payment Received', 
            message: 'Payment of 5000 DA received for violation #123', 
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            is_read: true 
          }
        ];
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  const markAsRead = async (id) => {
    try {
      if (id === 'all') {
        // In a real app: await api.put('/api/notifications/mark-read');
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      } else {
        // In a real app: await api.put(`/api/notifications/${id}/read`);
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, is_read: true } : n
        ));
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      // In a real app: await api.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <div className="space-x-2">
            <button
              onClick={() => markAsRead('all')}
              className="flex items-center text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              <FaCheck className="mr-1" /> Mark all as read
            </button>
          </div>
        </div>
        
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-gray-400 text-5xl mb-4">
              <FaBell />
            </div>
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-gray-600">
              You don't have any notifications at this time
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`bg-white rounded-lg shadow-sm p-4 ${
                  !notification.is_read ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{notification.title}</h3>
                    <p className="text-gray-600 my-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Mark as read"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
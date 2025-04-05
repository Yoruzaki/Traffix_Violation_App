import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PoliceHomePage from './pages/police/PoliceHomePage';
import CivilHomePage from './pages/civil/CivilHomePage';
import ViolationEntryPage from './pages/police/ViolationEntryPage';
import VehicleInfoPage from './pages/police/VehicleInfoPage';
import ConfirmationPage from './pages/police/ConfirmationPage';
import NotificationsPage from './pages/shared/NotificationsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/police" element={<ProtectedRoute role="police"><PoliceHomePage /></ProtectedRoute>} />
          <Route path="/police/violation-entry" element={<ProtectedRoute role="police"><ViolationEntryPage /></ProtectedRoute>} />
          <Route path="/police/vehicle-info" element={<ProtectedRoute role="police"><VehicleInfoPage /></ProtectedRoute>} />
          <Route path="/police/confirmation" element={<ProtectedRoute role="police"><ConfirmationPage /></ProtectedRoute>} />
          <Route path="/civil" element={<ProtectedRoute role="civil"><CivilHomePage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/" element={<HomeRedirect />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'police' ? '/police' : '/civil'} replace />;
  }

  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user?.role === 'police' ? '/police' : '/civil'} replace />;
}

export default App;
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  // Initialize axios interceptors
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setAuthToken(token);
          const response = await api.get('/api/user');
          setUser(response.data);
          setIsAuthenticated(true);
          
          // Set default authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await api.post('/api/login', { identifier, password });
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      navigate(response.data.user.role === 'police' ? '/police' : '/civil');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed',
        error: error.response?.data?.error || 'Invalid credentials'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/register', userData);
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);
      setUser({ ...userData, id: response.data.user_id, role: 'civil' });
      setIsAuthenticated(true);
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      navigate('/civil');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || {}
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthToken(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/api/user');
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        authToken,
        login,
        register,
        logout,
        refreshUser,
        hasRole: (role) => user?.role === role,
        hasAnyRole: (roles) => roles.includes(user?.role),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, userService } from '../services/api';

// Create the auth context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in (on mount/refresh)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // For the hardcoded manager login
          if (token === 'manager-hardcoded-token') {
            setCurrentUser({
              id: 999,
              username: 'manager',
              fullName: 'Built-in Manager',
              email: 'manager@example.com',
              role: 'manager'
            });
          } 
          // For the hardcoded employee login
          else if (token === 'employee-hardcoded-token') {
            setCurrentUser({
              id: 998,
              username: 'employee',
              fullName: 'Built-in Employee',
              email: 'employee@example.com',
              role: 'employee'
            });
          } 
          else {
            // For regular logins
            try {
              const response = await userService.getCurrentUser();
              setCurrentUser(response.data);
            } catch (error) {
              console.error('Failed to fetch user data:', error);
              localStorage.removeItem('token');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  const login = async (username, password) => {
    try {
      setError('');
      
      // Built-in manager login - bypass API call
      if (username === 'manager' && password === '1234') {
        const managerUser = {
          id: 999,
          username: 'manager',
          fullName: 'Built-in Manager',
          email: 'manager@example.com',
          role: 'manager'
        };
        localStorage.setItem('token', 'manager-hardcoded-token');
        setCurrentUser(managerUser);
        return true;
      }
      
      // Built-in employee login - bypass API call
      if (username === 'employee' && password === '4321') {
        const employeeUser = {
          id: 998,
          username: 'employee',
          fullName: 'Built-in Employee',
          email: 'employee@example.com',
          role: 'employee'
        };
        localStorage.setItem('token', 'employee-hardcoded-token');
        setCurrentUser(employeeUser);
        return true;
      }
      
      // Regular login through API
      const response = await authService.login({ username, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const response = await authService.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isManager: currentUser?.role === 'manager',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
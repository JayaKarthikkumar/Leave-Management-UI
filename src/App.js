import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmployeeLeaveForm from './pages/EmployeeLeaveForm';
import EmployeeLeaveList from './pages/EmployeeLeaveList';
import ManagerLeaveList from './pages/ManagerLeaveList';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/Navbar';
import Loading from './components/Loading';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leave/new" 
                element={
                  <ProtectedRoute>
                    <EmployeeLeaveForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leave/my-requests" 
                element={
                  <ProtectedRoute>
                    <EmployeeLeaveList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leave/all" 
                element={
                  <ProtectedRoute requiredRole="manager">
                    <ManagerLeaveList />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect to dashboard if logged in */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

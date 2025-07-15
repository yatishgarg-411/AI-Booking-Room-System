import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // Not logged in, redirect to login
    return <Navigate to="/" replace />;
  }

  // Authenticated, render children
  return children;
};

export default ProtectedRoute;
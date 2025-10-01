import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

/**
 * A wrapper component for routes that require authentication
 * Redirects to login page if user is not authenticated
 */
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the protected content if authenticated
  return children;
}

export default ProtectedRoute; 
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from './StateViews';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <LoadingState message="Verifying authentication session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <div className="state-box" style={{ borderColor: 'var(--danger-light)' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Access Denied (403 Forbidden)</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            You do not possess the administrator privileges required to access this resource.
          </p>
          <a href="/" className="btn btn-primary">Return to Homepage</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

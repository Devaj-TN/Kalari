import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminSession } from '../../lib/security';
import ErrorBoundary from './ErrorBoundary';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isValid } = getAdminSession();

  if (!isValid) {
    // Redirect unauthenticated user to admin login with return path
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <ErrorBoundary
      fallbackTitle="Admin Portal Error"
      fallbackMessage="An unexpected issue occurred within the Admin Portal. Please refresh or return to Dashboard."
    >
      {children}
    </ErrorBoundary>
  );
}

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { isTokenExpired } from '../utils/tokenUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['customer', 'admin'], 
  redirectTo = '/login' 
}) => {
  const location = useLocation();
  const { isAuthenticated, user, accessToken } = useSelector((state: RootState) => state.user);

  // Check if user is authenticated
  if (!isAuthenticated || !user || !accessToken) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if token is expired
  if (isTokenExpired(accessToken)) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate page based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'customer') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;








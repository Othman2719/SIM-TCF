import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <LoginScreen />;
  }

  if (requireAdmin && state.currentUser?.role !== 'admin') {
    return <LoginScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
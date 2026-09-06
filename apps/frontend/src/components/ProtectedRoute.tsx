import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '@intelident/shared';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

// HOC para componentes individuales
export const withPermission = (
  Component:    React.ComponentType,
  allowedRoles: UserRole[],
): React.FC => {
  return () => {
    const { user } = useAuthStore();
    if (!user || !allowedRoles.includes(user.role)) {
      return (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No tienes permiso para ver este contenido
        </div>
      );
    }
    return <Component />;
  };
};
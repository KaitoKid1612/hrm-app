import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'ADMIN' | 'EMPLOYER' | 'CANDIDATE'>;
  redirectTo?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = ROUTES.DASHBOARD,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;

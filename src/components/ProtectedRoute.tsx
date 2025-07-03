// src/components/ProtectedRoute.tsx (Versão Corrigida)

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthHook'; // <-- CORREÇÃO APLICADA AQUI
import { APP_ROUTES } from '@/constants';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading, token, isAdmin } = useAuth(); // Esta linha agora funcionará corretamente
  const location = useLocation();

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-xl">A verificar autenticação...</p>
        </div>
    );
  }

  if (!token || !user) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }
  
  if (isAdmin) return <Outlet />;

  return <Outlet />;
};

export default ProtectedRoute;
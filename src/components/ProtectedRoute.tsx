// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/constants';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Ex: ['ADMIN', 'PRESTADOR']
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading, token, isAdmin } = useAuth();
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

  // Se a rota exige um papel específico e o utilizador não o tem...
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // ...redireciona para a home, ou para uma página "Não Autorizado".
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  // Se for admin, tem acesso a tudo
  if(isAdmin) return <Outlet />;

  // Se passou por todas as verificações, renderiza a página solicitada.
  return <Outlet />;
};

export default ProtectedRoute;
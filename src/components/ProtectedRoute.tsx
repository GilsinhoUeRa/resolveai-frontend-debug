// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthHook';
import { APP_ROUTES } from '@/constants';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading, token } = useAuth();
  const location = useLocation();

  // 1. Enquanto a autenticação estiver a ser verificada, mostramos uma tela de carregamento.
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">A verificar autenticação...</p>
      </div>
    );
  }

  // 2. Se a verificação terminou e não há token, redireciona para o login.
  if (!token) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // 3. Se houver um token, mas os dados do utilizador ainda não chegaram, esperamos.
  if (!user) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl">A carregar dados do utilizador...</p>
        </div>
    );
  }

  // 4. Se a rota exige um papel (role) e o utilizador não o tem, redireciona para a home.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  // 5. Se passou por todas as verificações, renderiza a página filha solicitada.
  // O <Outlet /> é a mágica que renderiza <UserProfilePage />, <ChatPage />, etc.
  return <Outlet />;
};

export default ProtectedRoute;
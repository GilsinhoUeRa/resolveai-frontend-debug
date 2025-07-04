// src/App.tsx (Versão Final e Corrigida)
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componentes de Layout e Proteção de Rota
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Páginas
import WelcomePage from '@/pages/WelcomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CompleteRegistrationPage from '@/pages/CompleteRegistrationPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import HomePage from '@/pages/HomePage';
import UserProfilePage from '@/pages/UserProfilePage';
import ProviderRegistrationPage from '@/pages/ProviderRegistrationPage';
// ... importe todas as suas outras páginas ...
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import NotFoundPage from '@/pages/NotFoundPage';

import { APP_ROUTES } from '@/constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Rotas que utilizam o Layout Principal */}
        <Route path="/" element={<MainLayout />}>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route index element={<WelcomePage />} />
          <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/complete-registration" element={<CompleteRegistrationPage />} />

          {/* --- ROTAS PROTEGIDAS (exigem login) --- */}
          <Route element={<ProtectedRoute />}>
            <Route path={APP_ROUTES.HOME} element={<HomePage />} />
            <Route path={APP_ROUTES.USER_PROFILE} element={<UserProfilePage />} />
            {/* Adicione aqui todas as outras rotas que um utilizador logado pode aceder */}
          </Route>

          {/* A rota "Não Encontrado" deve ser a última rota dentro do layout principal */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Rotas de Admin (utilizam um layout e proteção específicos) */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
              <Route index element={<Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              {/* ... outras rotas de admin ... */}
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
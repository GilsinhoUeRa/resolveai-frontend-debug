// src/App.tsx (Versão Final e Corrigida)
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Componentes de Layout e Proteção de Rota
import MainLayout from '@/layouts/MainLayout'; // Assumindo que você criou este ficheiro
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute'; // <-- IMPORTAÇÃO CORRETA

// Páginas
import WelcomePage from '@/pages/WelcomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import HomePage from '@/pages/HomePage';
// ... importe todas as suas outras páginas ...
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

import { APP_ROUTES } from '@/constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Rotas de Layout Principal */}
        <Route element={<MainLayout />}>
          {/* Rotas Públicas */}
          <Route path={APP_ROUTES.WELCOME} element={<WelcomePage />} />
          <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* --- Rotas Protegidas --- */}
          {/* Todas as rotas dentro deste elemento exigirão login */}
          <Route element={<ProtectedRoute />}>
            <Route path={APP_ROUTES.HOME} element={<HomePage />} />
            {/* ... adicione todas as outras rotas protegidas aqui ... */}
          </Route>
		  <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Rotas de Admin */}
        {/* O wrapper externo verifica se o utilizador tem a role 'ADMIN' */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
              <Route index element={<Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              {/* ... outras rotas de admin ... */}
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
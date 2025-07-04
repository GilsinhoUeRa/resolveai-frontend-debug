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
import ChatListPage from '@/pages/ChatListPage';
import ChatConversationPage from '@/pages/ChatConversationPage';
import MyFavoritesPage from '@/pages/MyFavoritesPage';
import MyReviewsPage from '@/pages/MyReviewsPage';
// ... importe todas as suas outras páginas ...
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

import { APP_ROUTES } from '@/constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* O MainLayout envolve todas as rotas principais da aplicação */}
        <Route path="/" element={<MainLayout />}>
          
          {/* --- ROTAS PÚBLICAS --- */}
          {/* Estas rotas são acessíveis por qualquer pessoa, mesmo sem login. */}
          <Route index element={<WelcomePage />} />
          <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/complete-registration" element={<CompleteRegistrationPage />} />
          
          {/* --- ROTAS PROTEGIDAS --- */}
          {/* O componente ProtectedRoute envolve todas as rotas que exigem login. */}
          <Route element={<ProtectedRoute />}>
            <Route path={APP_ROUTES.HOME} element={<HomePage />} />
            <Route path={APP_ROUTES.USER_PROFILE} element={<UserProfilePage />} />
            <Route path={APP_ROUTES.CHAT_LIST} element={<ChatListPage />} />
            <Route path={`${APP_ROUTES.CHAT_CONVERSATION}/:chatId`} element={<ChatConversationPage />} />
            <Route path={APP_ROUTES.MY_FAVORITES} element={<MyFavoritesPage />} />
            <Route path={APP_ROUTES.MY_REVIEWS} element={<MyReviewsPage />} />
            {/* Adicione aqui todas as outras rotas que um utilizador logado pode aceder */}
          </Route>
          
          {/* A rota "Não Encontrado" é a última, para apanhar todos os caminhos inválidos. */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* --- ROTAS DE ADMIN --- */}
        {/* Um grupo separado para o painel de admin, com o seu próprio layout e proteção de papel (role). */}
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
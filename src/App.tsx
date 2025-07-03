// src/App.tsx (Versão Final e Validada)

import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// Importações de todos os componentes de página
import WelcomePage from '@/pages/WelcomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import ProviderListPage from '@/pages/ProviderListPage';
import ProviderProfilePage from '@/pages/ProviderProfilePage';
import ProviderRegistrationPage from '@/pages/ProviderRegistrationPage';
import UserProfilePage from '@/pages/UserProfilePage';
import MyReviewsPage from '@/pages/MyReviewsPage';
import ChatListPage from '@/pages/ChatListPage';
import ChatConversationPage from '@/pages/ChatConversationPage';
import MyFavoritesPage from '@/pages/MyFavoritesPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage'; // Importa a nova página de callback

// Importações das páginas e layout de Admin
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
// ... e outras páginas de admin ...

// Hooks e Componentes de UI
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import ToastContainer from '@/components/ToastContainer';
import { APP_ROUTES } from '@/constants';

// --- COMPONENTES DE PROTEÇÃO DE ROTA ---
// Garante que apenas utilizadores autenticados possam aceder a certas páginas.
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">A carregar...</div>;
  }
  if (!user) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Garante que apenas utilizadores com a role 'ADMIN' possam aceder às páginas de administração.
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">A verificar permissões...</div>;
  }
  if (!user || !isAdmin) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }
  return <>{children}</>;
};

// --- COMPONENTE DE LAYOUT PRINCIPAL ---
// Define a estrutura visual padrão da aplicação (Navbar, Footer, etc.).
const MainAppLayout: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-light-bg">
      <Navbar />
      <ToastContainer />
      <main className={`flex-grow container mx-auto px-4 py-8 ${user ? 'pb-24 md:pb-8' : 'pb-8'}`}>
        <Outlet /> {/* As páginas filhas serão renderizadas aqui */}
      </main>
      {user && <BottomNavbar />}
      <Footer />
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DA APLICAÇÃO ---
const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Rotas que utilizam o Layout Principal */}
        <Route element={<MainAppLayout />}>
          {/* Rotas Públicas */}
          <Route path={APP_ROUTES.WELCOME} element={<WelcomePage />} />
          <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
          
          {/* Rota de Callback para a autenticação com Google */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
          {/* Rotas Protegidas (exigem login) */}
          <Route path={APP_ROUTES.HOME} element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path={APP_ROUTES.PROVIDERS} element={<ProtectedRoute><ProviderListPage /></ProtectedRoute>} />
          <Route path={`${APP_ROUTES.PROVIDER_PROFILE}/:providerId`} element={<ProtectedRoute><ProviderProfilePage /></ProtectedRoute>} />
          <Route path={APP_ROUTES.PROVIDER_REGISTER} element={<ProtectedRoute><ProviderRegistrationPage /></ProtectedRoute>} />
          <Route path={APP_ROUTES.USER_PROFILE} element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          <Route path={APP_ROUTES.MY_REVIEWS} element={<ProtectedRoute><MyReviewsPage /></ProtectedRoute>} />
          <Route path={APP_ROUTES.CHAT_LIST} element={<ProtectedRoute><ChatListPage /></ProtectedRoute>} />
          <Route path={`${APP_ROUTES.CHAT_CONVERSATION}/:chatId`} element={<ProtectedRoute><ChatConversationPage /></ProtectedRoute>} />
          <Route path={APP_ROUTES.MY_FAVORITES} element={<ProtectedRoute><MyFavoritesPage /></ProtectedRoute>} />
          
          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Rotas de Admin (utilizam um layout e proteção específicos) */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route index element={<Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          {/* ... e outras rotas de admin ... */}
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
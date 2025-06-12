import React, { useEffect } from 'react'; // Adicionado useEffect
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import WelcomePage from '@/pages/WelcomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import ProviderListPage from '@/pages/ProviderListPage';
import ProviderProfilePage from '@/pages/ProviderProfilePage';
import ProviderRegistrationPage from '@/pages/ProviderRegistrationPage';
import ContactUsPage from '@/pages/ContactUsPage';
import UserProfilePage from '@/pages/UserProfilePage';
import MyReviewsPage from '@/pages/MyReviewsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ChatListPage from '@/pages/ChatListPage'; 
import ChatConversationPage from '@/pages/ChatConversationPage'; 
import TermsOfServicePage from '@/pages/TermsOfServicePage'; 
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage'; 
import NotificationHistoryPage from '@/pages/NotificationHistoryPage';
import MyFavoritesPage from '@/pages/MyFavoritesPage';
import PricingPlansPage from '@/pages/PricingPlansPage'; // Nova página de planos
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/constants';
import ToastContainer from '@/components/ToastContainer';

// Admin imports
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProfessionsPage from '@/pages/admin/AdminProfessionsPage';
import AdminSpecialtiesPage from '@/pages/admin/AdminSpecialtiesPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage'; 


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando permissões...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }
  return <>{children}</>;
};


const App: React.FC = () => {
  const { user, isAdmin, checkAndUpdateSubscriptionStatus } = useAuth(); // Adicionado checkAndUpdateSubscriptionStatus

  useEffect(() => {
    if (user) {
      checkAndUpdateSubscriptionStatus();
    }
  }, [user, checkAndUpdateSubscriptionStatus]);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-light-bg text-grafite-profundo">
        <Routes>
          <Route element={<MainAppLayout />}>
            <Route path={APP_ROUTES.WELCOME} element={<WelcomePage />} />
            <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={APP_ROUTES.TERMS_OF_SERVICE} element={<TermsOfServicePage />} />
            <Route path={APP_ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
            <Route path={APP_ROUTES.CONTACT} element={<ContactUsPage />} />
            <Route path={APP_ROUTES.PRICING_PLANS} element={<PricingPlansPage />} /> 
            
            <Route path={APP_ROUTES.HOME} element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path={APP_ROUTES.PROVIDERS} element={<ProtectedRoute><ProviderListPage /></ProtectedRoute>} />
            <Route path={`${APP_ROUTES.PROVIDER_PROFILE}/:providerId`} element={<ProtectedRoute><ProviderProfilePage /></ProtectedRoute>} />
            <Route path={APP_ROUTES.PROVIDER_REGISTER} element={<ProtectedRoute><ProviderRegistrationPage /></ProtectedRoute>} />
            <Route path={APP_ROUTES.USER_PROFILE} element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path={APP_ROUTES.MY_REVIEWS} element={<ProtectedRoute><MyReviewsPage /></ProtectedRoute>} />
            <Route path={APP_ROUTES.CHAT_LIST} element={<ProtectedRoute><ChatListPage /></ProtectedRoute>} />
            <Route path={`${APP_ROUTES.CHAT_CONVERSATION}/:chatId`} element={<ProtectedRoute><ChatConversationPage /></ProtectedRoute>} />
            <Route path={APP_ROUTES.NOTIFICATIONS_HISTORY} element={<ProtectedRoute><NotificationHistoryPage /></ProtectedRoute>} />
            <Route path={APP_ROUTES.MY_FAVORITES} element={<ProtectedRoute><MyFavoritesPage /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
            <Route index element={<Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="professions" element={<AdminProfessionsPage />} />
            <Route path="specialties" element={<AdminSpecialtiesPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="users" element={<AdminUsersPage />} /> 
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
};

const MainAppLayout: React.FC = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className={`flex-grow container mx-auto px-4 py-8 ${user ? 'pb-20 md:pb-8' : 'pb-8'}`}>
        <Outlet /> 
      </main>
      {user && <BottomNavbar />}
      <Footer />
    </>
  );
};

export default App;
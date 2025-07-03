// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNavbar from '@/components/BottomNavbar';
import ToastContainer from '@/components/ToastContainer';
import { useAuth } from '@/hooks/useAuthHook';

const MainLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-light-bg">
      <Navbar />
      <ToastContainer />
      <main className={`flex-grow container mx-auto px-4 py-8 ${user ? 'pb-24 md:pb-8' : 'pb-8'}`}>
        {/* As páginas aninhadas (filhas) serão renderizadas aqui */}
        <Outlet />
      </main>
      {/* A barra de navegação inferior só aparece para utilizadores logados */}
      {user && <BottomNavbar />}
      <Footer />
    </div>
  );
};

export default MainLayout;
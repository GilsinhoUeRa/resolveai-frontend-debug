
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import Logo from '@/components/Logo';
import { APP_NAME, APP_ROUTES} from '@/constants';
import { useAuth } from '@/hooks/useAuthHook';
import Button from '@/components/Button';
import HomeIcon from '@/components/icons/HomeIcon';
import ListChecksIcon from '@/components/icons/ListChecksIcon'; 
import SparkleIcon from '@/components/icons/SparkleIcon'; 
import UsersIcon from '@/components/icons/UsersIcon'; 
import SettingsIcon from '@/components/icons/SettingsIcon'; 
import LayoutGridIcon from '@/components/icons/LayoutGridIcon'; 
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'; // Ícone para "Voltar para o Site"

interface AdminSidebarLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const AdminSidebarLink: React.FC<AdminSidebarLinkProps> = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
      ${isActive 
        ? 'bg-orange-energia text-white shadow-md' 
        : 'text-grafite-profundo hover:bg-light-bg hover:text-orange-energia'}`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // Hook para navegação

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.HOME); // Redireciona para a home após o logout
  };
  
  return (
    <div className="flex h-screen bg-light-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 space-y-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-cinza-neutro/20">
          <Logo size={36} />
          <span className="text-xl font-bold text-grafite-profundo">{APP_NAME} Admin</span>
        </div>
        <nav className="flex-grow space-y-2">
          <AdminSidebarLink 
            to={APP_ROUTES.ADMIN_DASHBOARD} 
            label="Dashboard" 
            icon={<HomeIcon size={20} />} 
          />
          <AdminSidebarLink 
            to={APP_ROUTES.ADMIN_PROFESSIONS} 
            label="Profissões" 
            icon={<ListChecksIcon size={20} />} 
          />
          <AdminSidebarLink 
            to={APP_ROUTES.ADMIN_SPECIALTIES} 
            label="Especialidades" 
            icon={<SparkleIcon size={20} />} 
          />
          <AdminSidebarLink 
            to={APP_ROUTES.ADMIN_CATEGORIES} 
            label="Categorias" 
            icon={<LayoutGridIcon size={20} />} 
          />
          <AdminSidebarLink 
            to={APP_ROUTES.ADMIN_USERS} 
            label="Usuários" 
            icon={<UsersIcon size={20} />} 
          />
          {/* <AdminSidebarLink 
            to={APP_ROUTES.ADMIN_SETTINGS} 
            label="Configurações" 
            icon={<SettingsIcon size={20} />} 
          /> */}
        </nav>
        
        <hr className="my-3 border-cinza-neutro/20" /> 
        
        <div className="space-y-2">
           <NavLink
            to={APP_ROUTES.HOME}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium text-grafite-profundo hover:bg-light-bg hover:text-orange-energia transition-colors"
          >
            <ArrowLeftIcon size={20} />
            <span>Voltar para o Site</span>
          </NavLink>

          <div className="text-xs text-cinza-neutro px-3 pt-2">
            Logado como: <span className="font-semibold">{user?.name}</span>
          </div>
          <Button onClick={handleLogout} variant="secondary" size="sm" fullWidth>
            Sair do Admin
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <Outlet /> {/* As páginas do admin serão renderizadas aqui */}
      </main>
    </div>
  );
};

export default AdminLayout;

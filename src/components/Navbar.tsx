import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { APP_NAME, APP_ROUTES, COLORS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';
import BellIcon from '@/components/icons/BellIcon';
import NotificationDropdown from '@/components/NotificationDropdown';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import LayoutGridIcon from '@/components/icons/LayoutGridIcon'; // Importar para o link do admin

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth(); // Adicionado isAdmin
  const { unreadNotificationCount } = useAppNotifications();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.WELCOME);
  };

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to={user ? APP_ROUTES.HOME : APP_ROUTES.WELCOME} className="flex items-center space-x-2">
          <Logo size={40} />
          <span className="text-2xl font-bold text-grafite-profundo">{APP_NAME}</span>
        </Link>
        <div className="space-x-1 md:space-x-2 flex items-center">
          {user && isAdmin && ( // Link do Painel do Admin
            <Link 
              to={APP_ROUTES.ADMIN_DASHBOARD} 
              className="text-grafite-profundo hover:text-orange-energia transition-colors px-1 md:px-2 py-1 text-sm md:text-base flex items-center"
              title="Painel do Administrador"
            >
              <LayoutGridIcon size={18} className="mr-1 md:mr-1.5 opacity-80 group-hover:opacity-100" />
              Painel
            </Link>
          )}
          {user && (
            <Link to={APP_ROUTES.HOME} className="text-grafite-profundo hover:text-orange-energia transition-colors px-1 md:px-2 py-1 text-sm md:text-base">
              Início
            </Link>
          )}
          {user && (
            <Link to={APP_ROUTES.PROVIDERS} className="text-grafite-profundo hover:text-orange-energia transition-colors px-1 md:px-2 py-1 text-sm md:text-base">
              Encontrar Prestadores
            </Link>
          )}
           {user && (
            <Link to={APP_ROUTES.MY_FAVORITES} className="text-grafite-profundo hover:text-orange-energia transition-colors px-1 md:px-2 py-1 text-sm md:text-base">
              Favoritos
            </Link>
          )}
           {user && (
            <Link to={APP_ROUTES.MY_REVIEWS} className="text-grafite-profundo hover:text-orange-energia transition-colors px-1 md:px-2 py-1 text-sm md:text-base hidden sm:inline">
              Minhas Avaliações
            </Link>
          )}
          {user && (
            <Link to={APP_ROUTES.CHAT_LIST} className="text-grafite-profundo hover:text-orange-energia transition-colors px-1 md:px-2 py-1 text-sm md:text-base">
              Mensagens
            </Link>
          )}
          <Link to={APP_ROUTES.CONTACT} className="text-grafite-profundo hover:text-orange-energia transition-colors px-1 md:px-2 py-1 text-sm md:text-base">
            Fale Conosco
          </Link>
          
          {user ? (
            <>
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown} 
                  className="p-1.5 rounded-full hover:bg-light-bg focus:outline-none relative"
                  aria-label={unreadNotificationCount > 0 ? `Notificações: ${unreadNotificationCount} não lidas` : "Notificações"}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <BellIcon size={24} hasNotifications={unreadNotificationCount > 0} isActive={isDropdownOpen} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white" aria-hidden="true">
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                  )}
                </button>
                {isDropdownOpen && <NotificationDropdown onClose={() => setIsDropdownOpen(false)} />}
              </div>

              <Link to={APP_ROUTES.USER_PROFILE} className="text-grafite-profundo hover:text-orange-energia transition-colors px-1 md:px-2 py-1 text-sm md:text-base">
                Perfil
              </Link>
              <Button onClick={handleLogout} variant="secondary" size="sm" className="!px-2 !py-1 md:!px-3">
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to={APP_ROUTES.LOGIN}>
                <Button variant="secondary" size="sm" className="!px-2 !py-1 md:!px-3">Entrar</Button>
              </Link>
              <Link to={APP_ROUTES.REGISTER}>
                <Button variant="primary" size="sm" className="!px-2 !py-1 md:!px-3">Registrar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

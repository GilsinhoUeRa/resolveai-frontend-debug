
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/types';
import HomeIcon from '@/components/icons/HomeIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import UserIcon from '@/components/icons/UserIcon';
import PlusCircleIcon from '@/components/icons/PlusCircleIcon';
import ListChecksIcon from '@/components/icons/ListChecksIcon';
import MessageSquareIcon from '@/components/icons/MessageSquareIcon';
import HeartIcon from '@/components/icons/HeartIcon'; 
import LayoutGridIcon from '@/components/icons/LayoutGridIcon'; // Ícone para o Painel Admin

const BottomNavbar: React.FC = () => {
  const { user, isAdmin } = useAuth(); // Adicionado isAdmin
  const location = useLocation();

  if (!user) {
    return null; 
  }

  let navItems = [
    { path: APP_ROUTES.HOME, label: 'Início', IconComponent: HomeIcon },
    { path: APP_ROUTES.PROVIDERS, label: 'Buscar', IconComponent: SearchIcon },
  ];

  if (isAdmin) { // Se for admin, adiciona o item do Painel
    navItems.push({ path: APP_ROUTES.ADMIN_DASHBOARD, label: 'Painel', IconComponent: LayoutGridIcon });
  }
  
  navItems.push({ path: APP_ROUTES.MY_FAVORITES, label: 'Favoritos', IconComponent: HeartIcon });
  navItems.push({ path: APP_ROUTES.CHAT_LIST, label: 'Mensagens', IconComponent: MessageSquareIcon }); 

   if (user.userType === UserType.CLIENT || (user.userType === UserType.PROVIDER ) ) { 
     navItems.push({ path: APP_ROUTES.PROVIDER_REGISTER, label: 'Anunciar', IconComponent: PlusCircleIcon });
   }

  navItems.push({ path: APP_ROUTES.USER_PROFILE, label: 'Perfil', IconComponent: UserIcon });


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-top z-40 border-t border-cinza-neutro/30 md:hidden">
      <div className="container mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                           (item.path === APP_ROUTES.HOME && location.pathname === APP_ROUTES.WELCOME) || 
                           (item.path === APP_ROUTES.PROVIDERS && location.pathname.startsWith(APP_ROUTES.PROVIDER_PROFILE)) ||
                           (item.path === APP_ROUTES.CHAT_LIST && location.pathname.startsWith(APP_ROUTES.CHAT_CONVERSATION)) ||
                           (item.path === APP_ROUTES.ADMIN_DASHBOARD && location.pathname.startsWith('/admin')); // Verifica se está em qualquer rota admin

          return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-1 rounded-lg group transition-colors flex-1 min-w-0 ${ 
              isActive ? 'text-orange-energia' : 'text-cinza-neutro hover:text-grafite-profundo'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <item.IconComponent isActive={isActive} size={navItems.length > 5 ? 22 : 24} /> 
            <span className={`text-[9px] sm:text-[10px] mt-0.5 ${isActive ? 'font-semibold text-orange-energia' : 'text-cinza-neutro group-hover:text-grafite-profundo'}`}>{item.label}</span> 
          </Link>
        )}
        )}
      </div>
    </nav>
  );
};

export default BottomNavbar;

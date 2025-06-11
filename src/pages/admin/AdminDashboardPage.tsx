
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/admin/StatCard';
import { APP_NAME, APP_ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { User, UserType, ProviderDetails } from '@/types';
import * as AdminDataService from '@/lib/adminDataService';
import Card from '@/components/Card'; 

// Ícones (reutilizar existentes)
import UsersIcon from '@/components/icons/UsersIcon';
import ListChecksIcon from '@/components/icons/ListChecksIcon'; 
import SparkleIcon from '@/components/icons/SparkleIcon'; 
import LayoutGridIcon from '@/components/icons/LayoutGridIcon'; 
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon'; 
import { BanIcon } from '@/components/icons/BanIcon'; 
import Button from '@/components/Button';

interface PlatformStats {
  totalUsers: number;
  totalClients: number;
  totalProviders: number;
  activeUsers: number;
  bannedUsers: number;
  managedProfessions: number;
  managedSpecialties: number;
  managedCategories: number;
}

const AdminDashboardPage: React.FC = () => {
  const { user, allUsers, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    const calculateStats = () => {
      const clients = allUsers.filter(u => u.userType === UserType.CLIENT).length;
      const providers = allUsers.filter(u => u.userType === UserType.PROVIDER).length;
      const active = allUsers.filter(u => u.isActive !== false).length; 
      const banned = allUsers.filter(u => u.isActive === false).length;

      setStats({
        totalUsers: allUsers.length,
        totalClients: clients,
        totalProviders: providers,
        activeUsers: active,
        bannedUsers: banned,
        managedProfessions: AdminDataService.getManagedProfessions().length,
        managedSpecialties: AdminDataService.getManagedSpecialties().length,
        managedCategories: AdminDataService.getManagedCategories().length,
      });
      setIsLoading(false);
    };

    calculateStats();
  }, [allUsers, authLoading]);

  const iconSize = 24;

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-grafite-profundo mb-6">Painel de Administração</h1>
        <div className="h-7 bg-cinza-neutro/30 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-5 bg-cinza-neutro/30 rounded w-1/2 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse !p-4"> 
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-cinza-neutro/30 w-12 h-12`}></div>
                <div>
                  <div className="h-4 bg-cinza-neutro/30 rounded w-24 mb-1.5"></div>
                  <div className="h-8 bg-cinza-neutro/30 rounded w-12"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-10">Não foi possível carregar as estatísticas.</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-grafite-profundo">Painel de Administração</h1>
        <p className="text-lg text-cinza-neutro">
          Visão geral da plataforma {APP_NAME}, {user?.name?.split(' ')[0] || 'Admin'}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total de Usuários" 
          value={stats.totalUsers} 
          icon={<UsersIcon size={iconSize} />} 
          iconBgColor="bg-blue-500"
          onClick={() => navigate(APP_ROUTES.ADMIN_USERS)}
        />
        <StatCard 
          title="Clientes" 
          value={stats.totalClients} 
          icon={<UsersIcon size={iconSize} />} 
          iconBgColor="bg-sky-500"
          onClick={() => navigate(APP_ROUTES.ADMIN_USERS + '?type=client')}
        />
        <StatCard 
          title="Prestadores" 
          value={stats.totalProviders} 
          icon={<UsersIcon size={iconSize} />} 
          iconBgColor="bg-indigo-500"
          onClick={() => navigate(APP_ROUTES.ADMIN_USERS + '?type=provider')}
        />
         <StatCard 
          title="Usuários Ativos" 
          value={stats.activeUsers} 
          icon={<CheckCircleIcon size={iconSize} />} 
          iconBgColor="bg-green-500"
          onClick={() => navigate(APP_ROUTES.ADMIN_USERS + '?status=active')}
        />
        <StatCard 
          title="Usuários Banidos" 
          value={stats.bannedUsers} 
          icon={<BanIcon size={iconSize} />} 
          iconBgColor="bg-red-500"
          onClick={() => navigate(APP_ROUTES.ADMIN_USERS + '?status=banned')}
        />
        <StatCard 
          title="Profissões Gerenciadas" 
          value={stats.managedProfessions} 
          icon={<ListChecksIcon size={iconSize} />} 
          iconBgColor="bg-purple-500"
          onClick={() => navigate(APP_ROUTES.ADMIN_PROFESSIONS)}
        />
        <StatCard 
          title="Especialidades" 
          value={stats.managedSpecialties} 
          icon={<SparkleIcon size={iconSize} />} 
          iconBgColor="bg-pink-500"
          onClick={() => navigate(APP_ROUTES.ADMIN_SPECIALTIES)}
        />
        <StatCard 
          title="Categorias de Serviço" 
          value={stats.managedCategories} 
          icon={<LayoutGridIcon size={iconSize} />} 
          iconBgColor="bg-teal-500"
          onClick={() => navigate(APP_ROUTES.ADMIN_CATEGORIES)}
        />
      </div>
      
      <Card className="bg-orange-energia text-white">
          <h2 className="text-xl font-semibold mb-3">Dica do Administrador</h2>
          <p className="text-sm opacity-90">
              Mantenha os dados da plataforma sempre atualizados para garantir a melhor experiência para seus usuários.
              Verifique regularmente se há novas profissões, especialidades ou categorias que podem ser adicionadas para enriquecer as opções de serviço.
              Lembre-se que usuários banidos não podem acessar a plataforma.
          </p>
      </Card>

    </div>
  );
};

export default AdminDashboardPage;
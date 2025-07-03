// src/pages/admin/AdminDashboardPage.tsx (Versão Corrigida)

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getDashboardStatsApi } from '@/services/admin.api';
import { useAuth } from '@/hooks/useAuthHook'; // <-- CORREÇÃO APLICADA AQUI
import StatCard from '@/components/admin/StatCard';
import Card from '@/components/Card';
import { APP_NAME, APP_ROUTES } from '@/constants';
import UsersIcon from '@/components/icons/UsersIcon';
import ListChecksIcon from '@/components/icons/ListChecksIcon';
import SparkleIcon from '@/components/icons/SparkleIcon';
import LayoutGridIcon from '@/components/icons/LayoutGridIcon';

const AdminDashboardPage: React.FC = () => {
    const { user } = useAuth(); // Esta linha agora funcionará corretamente
    const navigate = useNavigate();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-dashboard-stats'],
        queryFn: getDashboardStatsApi,
    });

    const iconSize = 24;

    if (isLoading || !stats) {
        return <div>A carregar estatísticas...</div>;
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
                    title="Total de Utilizadores" 
                    value={stats.totalUsers} 
                    icon={<UsersIcon size={iconSize} />} 
                    iconBgColor="bg-blue-500"
                    onClick={() => navigate(APP_ROUTES.ADMIN_USERS)}
                />
                <StatCard 
                    title="Prestadores" 
                    value={stats.totalProviders} 
                    icon={<UsersIcon size={iconSize} />} 
                    iconBgColor="bg-indigo-500"
                    onClick={() => navigate(APP_ROUTES.ADMIN_USERS + '?type=provider')}
                />
                <StatCard 
                    title="Profissões" 
                    value={stats.totalProfessions} 
                    icon={<ListChecksIcon size={iconSize} />} 
                    iconBgColor="bg-purple-500"
                    onClick={() => navigate(APP_ROUTES.ADMIN_PROFESSIONS)}
                />
                <StatCard 
                    title="Especialidades" 
                    value={stats.totalSpecialties} 
                    icon={<SparkleIcon size={iconSize} />} 
                    iconBgColor="bg-pink-500"
                    onClick={() => navigate(APP_ROUTES.ADMIN_SPECIALTIES)}
                />
                <StatCard 
                    title="Categorias" 
                    value={stats.totalCategories} 
                    icon={<LayoutGridIcon size={iconSize} />} 
                    iconBgColor="bg-teal-500"
                    onClick={() => navigate(APP_ROUTES.ADMIN_CATEGORIES)}
                />
            </div>

            <Card className="bg-orange-energia text-white">
                <h2 className="text-xl font-semibold mb-3">Dica do Administrador</h2>
                <p className="text-sm opacity-90">
                    Mantenha os dados da plataforma sempre atualizados para garantir a melhor experiência para os seus utilizadores.
                </p>
            </Card>
        </div>
    );
};

export default AdminDashboardPage;
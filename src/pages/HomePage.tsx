// src/pages/HomePage.tsx (Versão Final Refatorada)
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// Funções de API reais
import { getFeaturedProvidersApi } from '@/services/providers.api';
import { getCategoriesApi } from '@/services/admin.api'; // Usando a API real

// Componentes e Tipos
import ProfessionCard from '@/components/ProfessionCard';
import ProviderCard from '@/components/ProviderCard';
import ProviderCardSkeleton from '@/components/skeletons/ProviderCardSkeleton';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { ProfessionCategory, ProviderDetails } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/constants';
// Os outros hooks e componentes permanecem importados...

const HomePage: React.FC = () => {
    const { user } = useAuth(); // Usado apenas para o nome do usuário. Não mais para 'allUsers'.
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // 1. BUSCA OS PRESTADORES EM DESTAQUE DA API REAL
    const {
        data: featuredProviders,
        isLoading: loadingFeaturedProviders,
        isError: featuredProvidersError,
    } = useQuery<ProviderDetails[]>({
        queryKey: ['featured-providers'],
        queryFn: getFeaturedProvidersApi,
    });

    // 2. BUSCA AS CATEGORIAS DE SERVIÇO DA API REAL
    const {
        data: serviceCategories,
        isLoading: loadingCategories,
    } = useQuery<ProfessionCategory[]>({
        queryKey: ['categories'],
        queryFn: getCategoriesApi,
    });

    // A lógica de Atividades Recentes precisa ser refatorada para usar uma API real também.
    // Por enquanto, vamos desativá-la para focar na migração principal.
    const loadingRecentActivities = false;
    const recentActivities: any[] = [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`${APP_ROUTES.PROVIDERS}?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-grafite-profundo mb-2">
                    Olá, {user?.name?.split(' ')[0] || 'Usuário'}!
                </h1>
                <p className="text-xl text-cinza-neutro">O que você precisa resolver hoje?</p>
            </header>

            {/* Formulário de Busca (permanece o mesmo) */}
            <form onSubmit={handleSearch} className="mb-12 max-w-2xl mx-auto">
                {/* ... seu JSX do formulário ... */}
            </form>

            {/* Seção de Sugestões - Agora ligada ao useQuery */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-grafite-profundo mb-6 text-center md:text-left">
                    Sugestões para Você
                </h2>
                {loadingFeaturedProviders ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <ProviderCardSkeleton key={i} />)}
                    </div>
                ) : featuredProvidersError ? (
                    <p className="text-cinza-neutro text-center">Não foi possível carregar as sugestões.</p>
                ) : featuredProviders && featuredProviders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProviders.map(provider => (
                            <ProviderCard key={provider.id} provider={provider} />
                        ))}
                    </div>
                ) : (
                    <p className="text-cinza-neutro text-center">Nenhuma sugestão encontrada.</p>
                )}
            </section>

            {/* Seção de Atividades Recentes (Temporariamente desativada/simplificada) */}
            {(loadingRecentActivities || recentActivities.length > 0) && (
                 <section className="mb-12">
                    {/* ... JSX das atividades ... */}
                 </section>
            )}

            {/* Seção de Categorias - Agora ligada ao useQuery */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-grafite-profundo mb-6 text-center md:text-left">
                    Navegar por Categorias de Serviços
                </h2>
                {loadingCategories ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                             <Card key={i} className="animate-pulse">{/* ... Skeleton ... */}</Card>
                        ))}
                    </div>
                ) : serviceCategories && serviceCategories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {serviceCategories.map((category) => (
                            <ProfessionCard key={category.id} profession={category} />
                        ))}
                    </div>
                ) : (
                    <p className="text-cinza-neutro text-center">Nenhuma categoria encontrada.</p>
                )}
            </section>
            
            {/* CTA para Prestadores (permanece o mesmo) */}
            <section className="mt-16 py-12 bg-grafite-profundo text-white rounded-lg text-center px-6">
                 {/* ... seu JSX do CTA ... */}
            </section>
        </div>
    );
};

export default HomePage;
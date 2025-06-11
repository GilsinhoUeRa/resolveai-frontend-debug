
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessionCard from '@/components/ProfessionCard';
import ProviderCard from '@/components/ProviderCard'; 
import ProviderCardSkeleton from '@/components/skeletons/ProviderCardSkeleton'; 
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card'; // Added import for Card
import { ProfessionCategory, ProviderDetails, UserType, Profession, ActivityItem } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites'; 
import { APP_ROUTES, COLORS } from '@/constants'; // MOCK_PROFESSIONS removido daqui, pois não é usado diretamente
import { useToast } from '@/hooks/useToast';
import { useChat, getMockUserDetails } from '@/hooks/useChat';
import ActivityCard from '@/components/ActivityCard';
import ActivityCardSkeleton from '@/components/skeletons/ActivityCardSkeleton';
import * as AdminDataService from '@/lib/adminDataService'; // Para carregar categorias

// MOCK_PROFESSION_CATEGORIES foi movido para constants.ts

const HomePage: React.FC = () => {
  const { user, allUsers, loading: authLoading } = useAuth();
  const { chatSessions, loadingSessions: chatLoading } = useChat(); 
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [featuredProviders, setFeaturedProviders] = useState<ProviderDetails[]>([]);
  const [loadingFeaturedProviders, setLoadingFeaturedProviders] = useState<boolean>(true);
  const [featuredProvidersError, setFeaturedProvidersError] = useState<string | null>(null);

  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [loadingRecentActivities, setLoadingRecentActivities] = useState<boolean>(true);

  const [serviceCategories, setServiceCategories] = useState<ProfessionCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    setLoadingCategories(true);
    // Carrega categorias do serviço de dados do admin
    const categoriesFromService = AdminDataService.getManagedCategories();
    setServiceCategories(categoriesFromService.sort((a,b) => a.name.localeCompare(b.name)));
    setLoadingCategories(false);
  }, []);

  const fetchFeaturedProviders = useCallback(() => {
    if (authLoading) {
      setLoadingFeaturedProviders(true);
      return;
    }
    setLoadingFeaturedProviders(true);
    setFeaturedProvidersError(null);

    try {
      const providersFromAuth = allUsers.filter(
        (u): u is ProviderDetails => u.userType === UserType.PROVIDER && 'profession' in u && u.id !== user?.id
      );
      
      const shuffled = [...providersFromAuth].sort(() => 0.5 - Math.random());
      setFeaturedProviders(shuffled.slice(0, 4));

    } catch (error: any) {
      console.error('Error fetching featured providers (simulated):', error);
      setFeaturedProvidersError(error.message || 'Não foi possível carregar sugestões (simulado).');
      setFeaturedProviders([]);
    } finally {
      setLoadingFeaturedProviders(false);
    }
  }, [user, allUsers, authLoading]);

  useEffect(() => {
    fetchFeaturedProviders();
  }, [fetchFeaturedProviders]);

  const fetchRecentActivities = useCallback(async () => {
    if (!user || authLoading || chatLoading) {
      setLoadingRecentActivities(false);
      return;
    }
    setLoadingRecentActivities(true);
    const activities: ActivityItem[] = [];

    if (chatSessions) {
      chatSessions.forEach(session => {
        if (session.lastMessage && session.participantIds.includes(user.id)) {
          const otherParticipantId = session.participantIds.find(id => id !== user.id);
          const otherParticipant = otherParticipantId ? getMockUserDetails(otherParticipantId) : null; 
          
          activities.push({
            id: `chat_${session.id}_${new Date(session.lastMessage.timestamp).getTime()}`,
            type: 'chat',
            timestamp: session.lastMessage.timestamp,
            title: `Conversa com ${otherParticipant?.name || 'Desconhecido'}`,
            description: `${session.lastMessage.senderId === user.id ? 'Você: ' : ''}${session.lastMessage.content.substring(0, 50)}${session.lastMessage.content.length > 50 ? '...' : ''}`,
            linkTo: `${APP_ROUTES.CHAT_CONVERSATION}/${session.id}`,
            iconType: 'chat',
            relatedEntityName: otherParticipant?.name,
            relatedEntityPhotoUrl: otherParticipant?.photoUrl,
          });
        }
      });
    }
    
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setRecentActivities(activities.slice(0, 5));
    setLoadingRecentActivities(false);

  }, [user, authLoading, chatLoading, chatSessions, allUsers]);

  useEffect(() => {
    fetchRecentActivities();
  }, [fetchRecentActivities]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`${APP_ROUTES.PROVIDERS}?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
	  <h1 className="bg-green-400 text-purple-800 text-5xl font-extrabold p-8 underline decoration-wavy">
  Tailwind Está Funcionando!
</h1>
        <h1 className="text-4xl font-bold text-grafite-profundo mb-2">
          Olá, {user?.name?.split(' ')[0] || 'Usuário'}!
        </h1>
        <p className="text-xl text-cinza-neutro">O que você precisa resolver hoje?</p>
      </header>

      <form onSubmit={handleSearch} className="mb-12 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-md border border-cinza-neutro/30 focus-within:ring-2 focus-within:ring-orange-energia">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cinza-neutro ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            type="search"
            name="search"
            placeholder="Buscar por serviço ou profissional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow !border-0 !shadow-none !ring-0 !outline-none !p-0 !mb-0"
            containerClassName="flex-grow !mb-0"
          />
          <Button type="submit" variant="primary" size="md" className="rounded-md">
            Buscar
          </Button>
        </div>
      </form>

      {(loadingFeaturedProviders || featuredProviders.length > 0 || featuredProvidersError) && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-grafite-profundo mb-6 text-center md:text-left">
            Sugestões para Você
          </h2>
          {loadingFeaturedProviders ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <ProviderCardSkeleton key={i} />)}
            </div>
          ) : featuredProviders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProviders.map(provider => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
             featuredProvidersError ? 
             <p className="text-cinza-neutro text-center py-4 px-2 bg-white rounded-md shadow-sm">{featuredProvidersError}</p>
             : <p className="text-cinza-neutro text-center py-4 px-2 bg-white rounded-md shadow-sm">Não encontramos sugestões no momento. Explore as categorias abaixo!</p>
          )}
        </section>
      )}

      {(loadingRecentActivities || recentActivities.length > 0) && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-grafite-profundo mb-6 text-center md:text-left">
            Minhas Atividades Recentes
          </h2>
          {loadingRecentActivities ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <ActivityCardSkeleton key={i} />)}
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <p className="text-cinza-neutro text-center py-4 px-2 bg-white rounded-md shadow-sm">Nenhuma atividade recente para mostrar.</p>
          )}
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-grafite-profundo mb-6 text-center md:text-left">
          Navegar por Categorias de Serviços
        </h2>
        {loadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <Card key={i} className="animate-pulse">
                        <div className="w-full h-48 bg-cinza-neutro/30 rounded-t-xl"></div>
                        <div className="p-4">
                            <div className="h-6 bg-cinza-neutro/30 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-cinza-neutro/30 rounded w-full mb-1"></div>
                            <div className="h-4 bg-cinza-neutro/30 rounded w-5/6 mb-3"></div>
                            <div className="h-5 bg-cinza-neutro/30 rounded w-1/3"></div>
                        </div>
                    </Card>
                ))}
            </div>
        ) : serviceCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category) => (
                <ProfessionCard key={category.id} profession={category} />
            ))}
            </div>
        ) : (
            <p className="text-cinza-neutro text-center py-4 px-2 bg-white rounded-md shadow-sm">Nenhuma categoria de serviço disponível no momento.</p>
        )}
      </section>

       <section className="mt-16 py-12 bg-grafite-profundo text-white rounded-lg text-center px-6">
        <h2 className="text-3xl font-bold mb-4">É um Profissional?</h2>
        <p className="text-lg text-cinza-neutro mb-8 max-w-xl mx-auto">
          Destaque seus serviços em nossa plataforma e conecte-se com milhares de clientes. Cadastro rápido e fácil!
        </p>
        <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(APP_ROUTES.PROVIDER_REGISTER)}
        >
            Anuncie Seus Serviços Gratuitamente
        </Button>
      </section>
    </div>
  );
};

export default HomePage;

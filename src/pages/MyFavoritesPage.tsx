import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { ProviderDetails, UserType } from '@/types';
import ProviderCard from '@/components/ProviderCard';
import Button from '@/components/Button';
import { APP_ROUTES } from '@/constants';
import ProviderCardSkeleton from '@/components/skeletons/ProviderCardSkeleton';
import HeartIcon from '@/components/icons/HeartIcon';

const MyFavoritesPage: React.FC = () => {
  const { user, allUsers, loading: authLoading } = useAuth();
  const { favoriteProviderIds, loadingFavorites } = useFavorites();
  const [favoritedProviders, setFavoritedProviders] = useState<ProviderDetails[]>([]);

  useEffect(() => {
    if (!authLoading && !loadingFavorites && user) {
      const providers = allUsers
        .filter((u): u is ProviderDetails => u.userType === UserType.PROVIDER && favoriteProviderIds.includes(u.id))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically or by date added if tracked
      setFavoritedProviders(providers);
    } else if (!user) {
      setFavoritedProviders([]); // Clear if user logs out
    }
  }, [user, allUsers, favoriteProviderIds, authLoading, loadingFavorites]);

  const isLoading = authLoading || loadingFavorites;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-grafite-profundo">Meus Favoritos</h1>
          <div className="h-5 bg-cinza-neutro/30 rounded w-1/3 mt-1 animate-pulse"></div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {[1, 2, 3].map(i => <ProviderCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }
  
  if (!user) {
     return (
      <div className="text-center py-10">
        <p className="text-xl text-grafite-profundo">Por favor, faça login para ver seus favoritos.</p>
        <Link to={APP_ROUTES.LOGIN} className="mt-4 inline-block">
          <Button variant="primary">Ir para Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-grafite-profundo">Meus Prestadores Favoritos</h1>
        <p className="text-lg text-cinza-neutro">Acesse rapidamente os perfis que você mais gostou.</p>
      </header>

      {favoritedProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6"> {/* Changed to 1 column for consistency with ProviderListPage */}
          {favoritedProviders.map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white p-8 rounded-lg shadow-md">
          <HeartIcon size={60} isActive={false} className="mx-auto text-cinza-neutro mb-4" />
          <h3 className="mt-2 text-xl font-semibold text-grafite-profundo">Você ainda não favoritou nenhum prestador.</h3>
          <p className="mt-2 text-md text-cinza-neutro">
            Clique no ícone de coração <HeartIcon size={16} isActive={true} className="inline text-orange-energia" /> nos cards ou perfis dos prestadores para adicioná-los aqui.
          </p>
          <div className="mt-6">
            <Link to={APP_ROUTES.PROVIDERS}>
              <Button variant="primary" size="lg">
                Encontrar Prestadores
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFavoritesPage;
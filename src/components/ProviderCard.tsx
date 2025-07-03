import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/Card';
import StarRating from '@/components/StarRating';
import { ProviderDetails } from '@/types';
import { APP_ROUTES } from '@/constants';
import CheckShieldIcon from '@/components/icons/CheckShieldIcon';
import SparkleIcon from '@/components/icons/SparkleIcon';
import HeartIcon from '@/components/icons/HeartIcon'; 
import { useFavorites } from '@/hooks/useFavorites'; 
import { useAuth } from '@/hooks/useAuthHook';

interface ProviderCardProps {
  provider: ProviderDetails; 
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const { user } = useAuth();
  const { favoriteProviderIds, addFavorite, removeFavorite, isFavorite, loadingFavorites } = useFavorites();
  const isCurrentlyFavorite = isFavorite(provider.id);

  const placeholderPhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=f57c00&color=fff&size=128`;

  const isVerified = provider.isVerified || (!!provider.bio && !!provider.photoUrl && (provider.specialties?.length || 0) > 0);
  const isNew = provider.isNew;
  const isTopRated = provider.isTopRated || ((provider.averageRating || 0) >= 4.7 && (provider.reviewCount || 0) >= 10);

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    event.preventDefault(); 
    if (isCurrentlyFavorite) {
      removeFavorite(provider.id);
    } else {
      addFavorite(provider.id);
    }
  };

  const getSubscriptionBadge = () => {
    if (provider.subscriptionPlan === 'pro' || provider.subscriptionPlan === 'premium') {
      return (
        <div className="flex items-center bg-yellow-400 text-grafite-profundo text-xs font-bold px-2 py-0.5 rounded-full shadow" title={`Plano ${provider.subscriptionPlan}`}>
          <SparkleIcon size={12} className="mr-1" color="currentColor"/> {/* Use currentColor to inherit text color */}
          {provider.subscriptionPlan === 'pro' ? 'PRO' : 'PREMIUM'}
        </div>
      );
    }
    if (provider.subscriptionPlan === 'trial' && provider.trialEndsAt && new Date(provider.trialEndsAt) > new Date()) {
      return (
        <div className="flex items-center bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow" title="Em período de teste">
          TESTE
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-orange-energia/30 relative overflow-hidden">
      <div className="absolute top-3 right-3 flex flex-col items-end space-y-1.5 z-10">
        {user && user.id !== provider.id && !loadingFavorites && (
          <button
            onClick={handleToggleFavorite}
            aria-label={isCurrentlyFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
            title={isCurrentlyFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <HeartIcon isActive={isCurrentlyFavorite} size={20} />
          </button>
        )}
        {getSubscriptionBadge()}
        {isNew && !getSubscriptionBadge() && ( // Show "NOVO" only if not already showing a subscription badge that implies newness or status
          <div className="flex items-center bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
            <SparkleIcon size={12} className="mr-1" color="white"/>
            NOVO
          </div>
        )}
        {isTopRated && (
           <div className="flex items-center bg-yellow-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
            <SparkleIcon size={12} className="mr-1" color="white"/>
            EM ALTA
          </div>
        )}
         {isVerified && (
          <div className="flex items-center bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow" title="Perfil Verificado">
            <CheckShieldIcon size={12} className="mr-1" color="white" />
            VERIFICADO
          </div>
        )}
      </div>

      <Link to={`${APP_ROUTES.PROVIDER_PROFILE}/${provider.id}`} className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex-shrink-0 pt-1">
          <img
            src={provider.photoUrl || placeholderPhotoUrl}
            alt={provider.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-orange-energia"
            onError={(e) => (e.currentTarget.src = placeholderPhotoUrl)}
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-grafite-profundo hover:text-orange-energia transition-colors">
            {provider.name}
          </h3>
          <p className="text-lg text-orange-energia font-semibold">{provider.profession.name}</p>
          {provider.city && <p className="text-sm text-cinza-neutro mt-1">Cidade: {provider.city}</p>}
          
          {provider.specialties && provider.specialties.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-semibold text-grafite-profundo uppercase">Especialidades:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {provider.specialties.slice(0, 3).map(spec => (
                  <span key={spec.id} className="text-xs bg-cinza-neutro/20 text-grafite-profundo px-2 py-0.5 rounded-full">
                    {spec.name}
                  </span>
                ))}
                {provider.specialties.length > 3 && (
                   <span className="text-xs bg-cinza-neutro/20 text-grafite-profundo px-2 py-0.5 rounded-full">
                    +{provider.specialties.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          )}

          {provider.averageRating !== undefined && provider.reviewCount !== undefined && (
            <div className="mt-3 flex items-center space-x-2">
              <StarRating rating={provider.averageRating} readOnly size={20} />
              <span className="text-sm text-cinza-neutro">
                ({provider.averageRating.toFixed(1)}) {provider.reviewCount} {provider.reviewCount === 1 ? 'avaliação' : 'avaliações'}
              </span>
            </div>
          )}
          
          <p className="text-sm text-grafite-profundo mt-3 line-clamp-2">
            {provider.bio || "Este prestador ainda não adicionou uma biografia."}
          </p>

        </div>
      </Link>
       <div className="mt-4 pt-4 border-t border-cinza-neutro/30 flex justify-end">
          <Link to={`${APP_ROUTES.PROVIDER_PROFILE}/${provider.id}`}>
            <button className="bg-orange-energia text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium">
              Ver Perfil Completo
            </button>
          </Link>
        </div>
    </Card>
  );
};

export default ProviderCard;
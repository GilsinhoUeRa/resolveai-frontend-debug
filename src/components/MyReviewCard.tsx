
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/Card';
import StarRating from '@/components/StarRating';
import { Review, ProviderDetails } from '@/types';
import { APP_ROUTES, COLORS } from '@/constants';
import Button from '@/components/Button';
import EditIcon from '@/components/icons/EditIcon'; // Será necessário criar este ícone
import TrashIcon from '@/components/icons/TrashIcon'; // Será necessário criar este ícone

interface MyReviewCardProps {
  review: Review;
  provider?: ProviderDetails; // Provedor que foi avaliado
  onEditRequest: (review: Review) => void; // Callback para solicitar edição
  onDeleteRequest: (reviewId: string) => void; // Callback para solicitar exclusão
}

const MyReviewCard: React.FC<MyReviewCardProps> = ({ review, provider, onEditRequest, onDeleteRequest }) => {
  // Função para formatar a data da avaliação
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // URL de placeholder para a foto do provedor, caso não exista uma
  const providerPlaceholderPhotoUrl = provider ? `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=9e9e9e&color=fff&size=96` : '';

  return (
    <Card className="border border-cinza-neutro/20 hover:shadow-orange-energia/20">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Seção de informações do provedor (se disponível) */}
        {provider && (
          <div className="flex-shrink-0 sm:w-1/4 md:w-1/5 text-center sm:text-left">
            <img
              src={provider.photoUrl || providerPlaceholderPhotoUrl}
              alt={provider.name}
              className="w-20 h-20 rounded-full object-cover mx-auto sm:mx-0 mb-2 border-2 border-orange-energia/50"
              onError={(e) => { if (providerPlaceholderPhotoUrl) e.currentTarget.src = providerPlaceholderPhotoUrl; }}
            />
            <Link to={`${APP_ROUTES.PROVIDER_PROFILE}/${provider.id}`} className="block">
              <h4 className="text-lg font-semibold text-grafite-profundo hover:text-orange-energia transition-colors">{provider.name}</h4>
            </Link>
            <p className="text-sm text-cinza-neutro">{provider.profession.name}</p>
          </div>
        )}

        {/* Seção principal da avaliação */}
        <div className={`flex-grow ${provider ? 'sm:w-3/4 md:w-4/5' : 'w-full'}`}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
            <StarRating rating={review.rating} readOnly size={20} />
            <span className="text-xs text-cinza-neutro mt-1 sm:mt-0">{formatDate(review.date)}</span>
          </div>
          <p className="text-sm text-grafite-profundo leading-relaxed prose prose-sm max-w-none">
            {review.comment}
          </p>
          
          {/* Botões de Ação: Editar e Excluir */}
          <div className="mt-4 pt-3 border-t border-cinza-neutro/20 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            {provider && (
                 <Link to={`${APP_ROUTES.PROVIDER_PROFILE}/${provider.id}`} className="order-first sm:order-none">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto !text-xs !py-1 !px-2">
                        Ver Perfil do Prestador
                    </Button>
                </Link>
            )}
            <Button 
                onClick={() => onEditRequest(review)} 
                variant="secondary" 
                size="sm"
                className="w-full sm:w-auto !text-xs !py-1 !px-2"
            >
              <EditIcon size={14} className="mr-1" /> Editar
            </Button>
            <Button 
                onClick={() => onDeleteRequest(review.id)} 
                variant="danger" 
                size="sm"
                className="w-full sm:w-auto !text-xs !py-1 !px-2"
            >
              <TrashIcon size={14} className="mr-1" /> Excluir
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MyReviewCard;

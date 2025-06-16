// src/pages/ProviderProfilePage.tsx (Versão Final Corrigida)

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProviderById, getReviewsByProvider, createReview } from '@/services/api';
import { Review as ReviewType, ProviderDetails } from '@/types';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';
import Button from '@/components/Button';
import Textarea from '@/components/Textarea';
import ProfilePageSkeleton from '@/components/skeletons/ProfilePageSkeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { APP_ROUTES } from '@/constants';

const ProviderProfilePage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { user } = useAuth();
  
  // Estados para controlar os campos do formulário
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  // BUSCANDO DADOS DO PRESTADOR
  const { data: provider, isLoading: isLoadingProvider, isError } = useQuery<ProviderDetails, Error>({
    queryKey: ['provider', providerId],
    queryFn: () => getProviderById(providerId!),
    enabled: !!providerId,
  });

  // BUSCANDO AS AVALIAÇÕES
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<ReviewType[], Error>({
    queryKey: ['reviews', providerId],
    queryFn: () => getReviewsByProvider(providerId!),
    enabled: !!provider, // Só busca as avaliações depois que os dados do prestador chegarem
  });

  // CONFIGURANDO A MUTAÇÃO PARA CRIAR A AVALIAÇÃO
  const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      addToast('Avaliação enviada com sucesso!', 'success');
      queryClient.invalidateQueries({ queryKey: ['reviews', providerId] });
      setNewRating(0);
      setNewComment('');
    },
    onError: (error) => {
      addToast(`Erro ao enviar avaliação: ${error.message}`, 'error');
    }
  });

  const handleReviewSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const servicoId = provider?.servicos?.[0]?.id;

    if (servicoId && newRating > 0 && newComment.trim()) {
      submitReview({ servicoId, nota: newRating, comentario: newComment });
    } else {
      let errorMessage = 'Por favor, dê uma nota e escreva um comentário.';
      if (!servicoId) {
        errorMessage = 'Não foi possível identificar um serviço para avaliar.';
      }
      addToast(errorMessage, 'error');
    }
  };

  if (isLoadingProvider) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !provider) {
    return (
      <div className="text-center py-10">
        <h1>Erro</h1>
        <p>Prestador não encontrado.</p>
        <Link to={APP_ROUTES.HOME}>
          <Button>Voltar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Aqui vai o seu JSX para exibir o perfil completo do 'provider' */}
      <h1 className="text-4xl font-bold">{provider.name}</h1>
      <p>{provider.profession?.name}</p>
      
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Avaliações</h2>
        {isLoadingReviews ? (
          <p>Carregando avaliações...</p>
        ) : (
          reviews?.map(review => <ReviewCard key={review.id} review={review} />)
        )}

        {/* Formulário de Nova Avaliação (Corrigido) */}
        <form onSubmit={handleReviewSubmit} className="mt-6 p-4 border-t">
          <h3 className="font-bold mb-2">Deixe sua avaliação</h3>
          <div className="mb-3">
            <StarRating rating={newRating} onRate={setNewRating} size={28} />
          </div>
          <Textarea
            label="Seu comentário:"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            required
            placeholder="Descreva sua experiência..."
            disabled={isSubmittingReview}
          />
          <Button type="submit" isLoading={isSubmittingReview} className="mt-2">
            {isSubmittingReview ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default ProviderProfilePage;
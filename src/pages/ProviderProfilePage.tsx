// src/pages/ProviderProfilePage.tsx (Versão Refatorada)

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Funções da API que precisaremos (vamos criá-las no Passo 2)
import { getProviderById, getReviewsByProvider, createReview } from '@/services/api'; 
import { Review as ReviewType } from '@/types';

// Seus componentes de UI
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
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. BUSCANDO DADOS DO PRESTADOR COM useQuery
  const { data: provider, isLoading: isLoadingProvider, isError: isProviderError } = useQuery({
    queryKey: ['provider', providerId], // A chave inclui o ID para ser única
    queryFn: () => getProviderById(providerId!), // '!' para garantir ao TS que providerId existe
    enabled: !!providerId, // Só executa a query se o providerId existir
  });

  // 2. BUSCANDO AS AVALIAÇÕES COM useQuery
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['reviews', providerId],
    queryFn: () => getReviewsByProvider(providerId!),
    enabled: !!providerId,
  });

// 3. CONFIGURANDO A MUTAÇÃO PARA CRIAR UMA NOVA AVALIAÇÃO
  const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
    // A mutationFn agora espera um objeto que inclui todos os dados necessários
    mutationFn: (data: { providerId: string; rating: number; comment: string }) => 
      createReview(data.providerId, data.rating, data.comment),
    
    onSuccess: () => {
      addToast('Avaliação enviada com sucesso!', 'success');
      // Invalida o cache de avaliações para forçar uma nova busca dos dados
      queryClient.invalidateQueries({ queryKey: ['reviews', providerId] });
    },
    onError: (error) => {
      addToast(`Erro ao enviar avaliação: ${error.message}`, 'error');
    }
  });

  // A função que chama a mutação agora passa o providerId junto
  const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement> & { target: { rating: { value: string }, comment: { value: string } } }) => {
    event.preventDefault();
    const rating = parseInt(event.target.rating.value, 10);
    const comment = event.target.comment.value;
    
    if (providerId && rating > 0 && comment.trim()) {
      submitReview({ providerId, rating, comment }); // Passa todos os dados necessários
    } else {
      addToast('Por favor, dê uma nota e escreva um comentário.', 'error');
    }
  };

  
  return (
    <div className="container mx-auto px-2 py-8">
      {/* SEU JSX PARA EXIBIR O PERFIL DO PRESTADOR VAI AQUI */}
      {/* Exemplo: */}
      <h1 className="text-4xl font-bold">{provider.name}</h1>
      <p>{provider.profession?.name}</p>

      {/* SEÇÃO DE AVALIAÇÕES */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Avaliações</h2>
        {isLoadingReviews ? (
          <p>Carregando avaliações...</p>
        ) : (
          reviews?.map(review => <ReviewCard key={review.id} review={review} />)
        )}

        {/* FORMULÁRIO DE NOVA AVALIAÇÃO (adaptado do seu código) */}
        <form onSubmit={handleReviewSubmit} className="mt-6 p-4 border-t">
          <h3 className="font-bold mb-2">Deixe sua avaliação</h3>
          <StarRating rating={0} onRate={() => {}} size={28} name="rating" />
          <Textarea name="comment" label="Seu comentário:" rows={3} required />
          <Button type="submit" isLoading={isSubmittingReview} className="mt-2">
            {isSubmittingReview ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default ProviderProfilePage;
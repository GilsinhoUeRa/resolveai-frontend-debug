// src/pages/ProviderProfilePage.tsx (Versão Final e Completa)

import React, { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Importações corretas dos Módulos de API
import { getProviderByIdApi } from '@/services/user.api'; 
import { getReviewsByProviderApi, createReviewApi } from '@/services/reviews.api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

// Tipos e Componentes
import { Review, ProviderDetails, NovaAvaliacaoPayload } from '@/types';
import ReviewCard from '@/components/ReviewCard';
import ProfilePageSkeleton from '@/components/skeletons/ProfilePageSkeleton';
import Button from '@/components/Button';
import Textarea from '@/components/Textarea';
import StarRating from '@/components/StarRating';

const ProviderProfilePage: React.FC = () => {
    const { providerId } = useParams<{ providerId: string }>();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const { user } = useAuth();

    // Estado local apenas para o formulário de nova avaliação
    const [newReviewRating, setNewReviewRating] = useState(0);
    const [newReviewComment, setNewReviewComment] = useState('');

    // Query para buscar os dados do prestador
    const { data: provider, isLoading: isLoadingProvider, isError: isProviderError } = useQuery<ProviderDetails>({
        queryKey: ['provider', providerId],
        queryFn: () => getProviderByIdApi(providerId!),
        enabled: !!providerId,
    });

    // Query para buscar as avaliações deste prestador
    const { data: reviews = [], isLoading: isLoadingReviews } = useQuery<Review[]>({
        queryKey: ['reviews', providerId],
        queryFn: () => getReviewsByProviderApi(providerId!),
        enabled: !!provider,
    });

    // Mutação para criar uma nova avaliação
    const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
        mutationFn: createReviewApi,
        onSuccess: () => {
            addToast('Avaliação enviada com sucesso!', 'success');
            queryClient.invalidateQueries({ queryKey: ['reviews', providerId] });
            // Limpa o formulário após o sucesso
            setNewReviewRating(0);
            setNewReviewComment('');
        },
        onError: (error: any) => {
            addToast(error.response?.data?.erro || 'Erro ao enviar avaliação.', 'error');
        },
    });

    const handleReviewSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (newReviewRating === 0 || !newReviewComment.trim()) {
            addToast('Por favor, selecione uma nota e escreva um comentário.', 'error');
            return;
        }
        // Assumindo que a avaliação está ligada ao prestador e não a um serviço específico por agora
        // Para uma lógica mais complexa, você passaria um 'servicoId' aqui
        const reviewData: NovaAvaliacaoPayload = { nota: newReviewRating, comentario: newReviewComment };
        submitReview({ providerId: providerId!, reviewData });
    };
    
    if (isLoadingProvider) return <ProfilePageSkeleton />;
    if (isProviderError || !provider) return <div className="text-center py-10">Erro: Prestador não encontrado.</div>;

    const placeholderPhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=f57c00&color=fff&size=128`;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                {/* Header do Perfil */}
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                    <img
                        src={provider.photoUrl || placeholderPhotoUrl}
                        alt={provider.name}
                        className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-8 border-4 border-white shadow-md"
                    />
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold text-grafite-profundo">{provider.name}</h1>
                        <p className="text-lg text-orange-energia font-semibold">{provider.profession?.name}</p>
                        <p className="text-md text-cinza-neutro mt-1">{provider.city}, {provider.uf}</p>
                    </div>
                    {/* Botão de Contato/Chat viria aqui */}
                </div>

                {/* Biografia */}
                <section className="mt-8 border-t pt-6">
                    <h2 className="text-xl font-semibold text-grafite-profundo mb-3">Sobre Mim</h2>
                    <p className="text-grafite-profundo leading-relaxed">{provider.bio || 'Este prestador ainda não adicionou uma biografia.'}</p>
                </section>
                
                {/* Seção de Avaliações */}
                <section className="mt-8 border-t pt-6">
                    <h2 className="text-xl font-semibold text-grafite-profundo mb-4">Avaliações ({reviews.length})</h2>
                    {isLoadingReviews ? (
                        <p>A carregar avaliações...</p>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                        </div>
                    ) : (
                        <p className="text-cinza-neutro">Este prestador ainda não possui avaliações.</p>
                    )}
                </section>

                {/* Formulário para Adicionar Avaliação (só aparece para clientes logados) */}
                {user && user.role === 'CLIENTE' && (
                     <section className="mt-8 border-t pt-6">
                        <h2 className="text-xl font-semibold text-grafite-profundo mb-4">Deixe a sua Avaliação</h2>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">A sua nota</label>
                                <StarRating rating={newReviewRating} onRate={setNewReviewRating} size={32} />
                            </div>
                            <Textarea
                                label="O seu comentário"
                                value={newReviewComment}
                                onChange={(e) => setNewReviewComment(e.target.value)}
                                placeholder="Descreva a sua experiência com este prestador..."
                                required
                                rows={4}
                            />
                            <Button type="submit" isLoading={isSubmittingReview}>
                                {isSubmittingReview ? 'A enviar...' : 'Enviar Avaliação'}
                            </Button>
                        </form>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProviderProfilePage;
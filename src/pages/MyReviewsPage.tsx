// src/pages/MyReviewsPage.tsx (Versão Final e Completa)
import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Funções de API e Tipos
import { getMyReviewsApi, updateReviewApi, deleteReviewApi } from '@/services/reviews.api';
import { Review, NovaAvaliacaoPayload } from '@/types';

// Hooks e Componentes de UI
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import MyReviewCard from '@/components/MyReviewCard';
import ProfilePageSkeleton from '@/components/skeletons/ProfilePageSkeleton';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import StarRating from '@/components/StarRating';
import Textarea from '@/components/Textarea';
import { APP_ROUTES } from '@/constants';

const MyReviewsPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const { user, loading: authLoading } = useAuth();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');

    // Query para buscar as avaliações do usuário logado
    const { data: userReviews = [], isLoading } = useQuery<Review[]>({
        queryKey: ['my-reviews', user?.id],
        queryFn: getMyReviewsApi,
        enabled: !!user,
    });

    // Mutação para ATUALIZAR uma avaliação
    const updateMutation = useMutation({
        mutationFn: updateReviewApi,
        onSuccess: () => {
            addToast('Avaliação atualizada com sucesso!', 'success');
            queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
            closeEditModal();
        },
        onError: (error: any) => addToast(error.response?.data?.erro || 'Erro ao atualizar.', 'error'),
    });

    // Mutação para DELETAR uma avaliação
    const deleteMutation = useMutation({
        mutationFn: deleteReviewApi,
        onSuccess: () => {
            addToast('Avaliação excluída com sucesso.', 'info');
            queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
        },
        onError: (error: any) => addToast(error.response?.data?.erro || 'Erro ao excluir.', 'error'),
    });

    // Funções para controlar o modal de edição
    const handleEditRequest = (review: Review) => {
        setEditingReview(review);
        setEditRating(review.rating);
        setEditComment(review.comment);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const handleConfirmEdit = (e: FormEvent) => {
        e.preventDefault();
        if (!editingReview) return;
        const reviewData: NovaAvaliacaoPayload = { nota: editRating, comentario: editComment };
        updateMutation.mutate({ reviewId: editingReview.id, reviewData });
    };

    const handleDeleteRequest = (reviewId: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
            deleteMutation.mutate(reviewId);
        }
    };

    if (isLoading || authLoading) {
        return <ProfilePageSkeleton />;
    }

    if (!user) {
         return (
          <div className="text-center py-10">
            <p className="text-xl">Por favor, faça login para ver suas avaliações.</p>
            <Link to={APP_ROUTES.LOGIN} className="mt-4 inline-block"><Button variant="primary">Ir para Login</Button></Link>
          </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-grafite-profundo">Minhas Avaliações</h1>
                <p className="text-lg text-cinza-neutro">Aqui estão todos os feedbacks que você compartilhou.</p>
            </header>

            {userReviews.length > 0 ? (
                <div className="space-y-6">
                    {userReviews.map(review => (
                        <MyReviewCard
                            key={review.id}
                            review={review}
                            onEditRequest={handleEditRequest}
                            onDeleteRequest={handleDeleteRequest}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white p-8 rounded-lg shadow-md">
                    {/* Seu JSX para estado vazio */}
                </div>
            )}

            <Modal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                title="Editar Avaliação"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={closeEditModal}>Cancelar</Button>
                        <Button form="editReviewForm" type="submit" isLoading={updateMutation.isPending}>Salvar</Button>
                    </div>
                }
            >
                <form id="editReviewForm" onSubmit={handleConfirmEdit} className="space-y-4">
                    <StarRating rating={editRating} onRate={setEditRating} size={28} />
                    <Textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} rows={5} required />
                </form>
            </Modal>
        </div>
    );
};

export default MyReviewsPage;
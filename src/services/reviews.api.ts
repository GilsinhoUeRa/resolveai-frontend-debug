// src/services/reviews.api.ts
import apiClient from './api';
import { Review, NovaAvaliacaoPayload } from '@/types';

/**
 * Busca todas as avaliações de um serviço/prestador específico.
 * @param servicoId O ID do serviço cujas avaliações serão buscadas.
 */

export const getReviewsByProviderApi = async (providerId: string): Promise<Review[]> => {
    const { data } = await apiClient.get(`/prestadores/${providerId}/avaliacoes`);
    return data;
}; 
 
export const getReviewsForServiceApi = async (servicoId: string): Promise<Review[]> => {
    const { data } = await apiClient.get(`/servicos/${servicoId}/avaliacoes`);
    return data;
};

/**
 * Busca todas as avaliações feitas pelo utilizador autenticado.
 */
export const getMyReviewsApi = async (): Promise<Review[]> => {
    const { data } = await apiClient.get('/usuarios/me/avaliacoes');
    return data;
};

/**
 * Cria uma nova avaliação para um serviço específico.
 * @param servicoId O ID do serviço que está a ser avaliado.
 * @param reviewData Os dados da nova avaliação (nota, comentário).
 */
export const createReviewApi = async ({ servicoId, reviewData }: { servicoId: string; reviewData: NovaAvaliacaoPayload }): Promise<Review> => {
    const { data } = await apiClient.post(`/servicos/${servicoId}/avaliacoes`, reviewData);
    return data;
};

/**
 * Atualiza uma avaliação existente.
 * @param reviewId O ID da avaliação a ser atualizada.
 * @param reviewData Os novos dados da avaliação.
 */
export const updateReviewApi = async ({ reviewId, reviewData }: { reviewId: string; reviewData: NovaAvaliacaoPayload }): Promise<Review> => {
    // Nota: Garanta que esta rota PATCH /api/avaliacoes/:id existe no seu backend.
    const { data } = await apiClient.patch(`/avaliacoes/${reviewId}`, reviewData);
    return data;
};

/**
 * Elimina uma avaliação.
 * @param reviewId O ID da avaliação a ser eliminada.
 */
export const deleteReviewApi = async (reviewId: string): Promise<void> => {
    // Nota: Garanta que esta rota DELETE /api/avaliacoes/:id existe no seu backend.
    await apiClient.delete(`/avaliacoes/${reviewId}`);
};
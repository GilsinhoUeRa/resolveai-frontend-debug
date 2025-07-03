// src/services/services.api.ts
import apiClient from './api';
import { Review, NovaAvaliacaoPayload, Servico } from '@/types'; // Adicione Servico se necessário

// Exemplo de como poderia ser a busca de serviços, se necessário no futuro
export const getServicosApi = async (): Promise<Servico[]> => {
    const { data } = await apiClient.get('/servicos');
    return data;
};

/**
 * Busca todas as avaliações de um prestador específico.
 */
export const getReviewsByProviderApi = async (providerId: string): Promise<Review[]> => {
    // Assumindo que o backend tenha esta rota
    const { data } = await apiClient.get(`/servicos/reviews/provider/${providerId}`);
    return data;
};

/**
 * Cria uma nova avaliação para um serviço específico.
 */
export const createReviewApi = async ({ servicoId, reviewData }: { servicoId: string; reviewData: NovaAvaliacaoPayload }): Promise<Review> => {
    const { data } = await apiClient.post(`/servicos/${servicoId}/avaliacoes`, reviewData);
    return data;
};
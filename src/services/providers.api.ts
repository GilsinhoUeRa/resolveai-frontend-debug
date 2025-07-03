// src/services/providers.api.ts
import apiClient from './api';
import { ProviderDetails } from '@/types';

/**
 * Busca os prestadores em destaque para a HomePage.
 */
export const getFeaturedProvidersApi = async (): Promise<ProviderDetails[]> => {
    // Este endpoint foi o que planejamos para o backend
    const { data } = await apiClient.get('/prestadores/destaques');
    return data;
};

// Adicione outras funções relacionadas a prestadores aqui no futuro,
// como a busca geral com filtros.
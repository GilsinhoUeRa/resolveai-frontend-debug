// src/services/user.api.ts
import apiClient from './api';
import { ProviderDetails, ProviderProfilePayload } from '@/types';

/**
 * Envia os dados do perfil de prestador para a API.
 */
export const becomeProviderApi = async (payload: ProviderProfilePayload): Promise<ProviderDetails> => {
  const { data } = await apiClient.patch('/usuarios/me/provider-profile', payload);
  return data;
};

/**
 * Busca os detalhes completos dos prestadores favoritados pelo usuário.
 */
export const getFavoriteProvidersApi = async (): Promise<ProviderDetails[]> => {
    const { data } = await apiClient.get('/usuarios/me/favoritos');
    return data;
};

/**
 * Busca os detalhes completos de um prestador específico pelo seu ID.
 */
export const getProviderByIdApi = async (providerId: string): Promise<ProviderDetails> => {
  // Note que usamos o endpoint de 'prestadores' que criamos no backend
  const { data } = await apiClient.get(`/prestadores/${providerId}`);
  return data;
};
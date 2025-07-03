// src/services/favorites.api.ts

import apiClient from './api'; // Importamos nossa instância unificada do Axios

/**
 * Busca os IDs dos prestadores favoritados pelo usuário logado.
 * @returns Uma promessa que resolve para um array de strings (IDs).
 */
export const getFavorites = async (): Promise<string[]> => {
  const { data } = await apiClient.get('/usuarios/me/favoritos');
  return data;
};

/**
 * Adiciona um prestador aos favoritos do usuário logado.
 * @param prestadorId - O ID do prestador a ser favoritado.
 */
export const addFavoriteApi = async (prestadorId: string): Promise<void> => {
  // O backend não precisa retornar nada além de um status de sucesso (201),
  // então o tipo de retorno da promessa pode ser 'void'.
  await apiClient.post('/usuarios/me/favoritos', { prestadorId });
};

/**
 * Remove um prestador dos favoritos do usuário logado.
 * @param prestadorId - O ID do prestador a ser removido.
 */
export const removeFavoriteApi = async (prestadorId: string): Promise<void> => {
  await apiClient.delete(`/usuarios/me/favoritos/${prestadorId}`);
};
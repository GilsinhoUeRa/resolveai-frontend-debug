// src/services/categories.api.ts

import apiClient from './api';
import { Category } from '@/types'; // Supondo que você tenha o tipo Category

/**
 * Busca todas as categorias da API.
 */
export const getCategoriesApi = async (): Promise<Category[]> => {
  const { data } = await apiClient.get('/categories');
  return data;
};

/**
 * Cria uma nova categoria.
 * @param name - O nome da nova categoria.
 */
export const createCategoryApi = async (name: string): Promise<Category> => {
  const { data } = await apiClient.post('/categories', { name });
  return data;
};

/**
 * Atualiza uma categoria existente.
 * @param payload - Objeto com o ID e o novo nome da categoria.
 */
export const updateCategoryApi = async (payload: { id: string; name: string }): Promise<Category> => {
  const { id, name } = payload;
  const { data } = await apiClient.patch(`/categories/${id}`, { name });
  return data;
};

/**
 * Deleta uma categoria.
 * @param id - O ID da categoria a ser deletada.
 */
export const deleteCategoryApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
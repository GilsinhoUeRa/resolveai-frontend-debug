// src/services/api.ts

import axios from 'axios';

// 1. Cria a instância do Axios com a URL base da nossa API na nuvem.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Tipagem para os dados que enviaremos para criar uma avaliação
export interface NovaAvaliacaoPayload {
  nota: number;
  comentario: string;
}

// 2. Define a "forma" dos nossos dados com interfaces TypeScript.
export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  nome_prestador: string;
  nota_media: string;
  total_avaliacoes: string;
}

// Interface para os parâmetros de filtro que a função pode receber.
interface GetServicosParams {
  q?: string;
  categoria?: string;
}

export const getProviderById = async (id: string): Promise<ProviderDetails> => {
  const response = await api.get(`/usuarios/${id}`); // Assumindo que sua rota de perfil usa /usuarios/:id
  return response.data;
};

export const getReviewsByProvider = async (providerId: string): Promise<Review[]> => {
  // Nota: O backend precisa ter esta rota implementada
  const response = await api.get(`/servicos/reviews/provider/${providerId}`);
  return response.data;
};

export const createReview = async (providerId: string, rating: number, comment: string): Promise<any> => {
  // Nota: O backend precisa ter esta rota implementada e protegida
  const response = await api.post(`/providers/${providerId}/reviews`, { rating, comment });
  return response.data;
};

// Função que faz a chamada POST para o backend
export const criarAvaliacao = async (
  payload: NovaAvaliacaoPayload,
  servicoId: number
): Promise<any> => { // O 'any' pode ser substituído pela interface da avaliação criada
  // Nossa rota no backend é: POST /api/servicos/:servicoId/avaliacoes
  const response = await api.post(`/servicos/${servicoId}/avaliacoes`, payload);
  return response.data;
};

// 3. Cria e exporta a função para buscar os serviços.
export const getServicos = async (params: GetServicosParams = {}): Promise<Servico[]> => {
  try {
    // Passamos os parâmetros para o Axios, que os adicionará na URL.
    const response = await api.get('/servicos', { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    throw error;
  }
};

export default api;
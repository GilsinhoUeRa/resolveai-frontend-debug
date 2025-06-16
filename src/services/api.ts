// src/services/api.ts

import axios from 'axios';
import { ProviderDetails } from '@/types'; // Certifique-se que o tipo ProviderDetails está correto em types.ts
// 1. Cria a instância do Axios com a URL base da nossa API na nuvem.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

const apiClient = axios.create({
  // IMPORTANTE: Use a URL base da sua API.
  // Se estiver rodando o backend localmente, será http://localhost:3001/api
  baseURL: 'http://localhost:3001/api',
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

export const loginUsuario = async (credentials: { email: string, senha: string }): Promise<{ token: string }> => {
  const response = await api.post('/login', credentials);
  // Esperamos que o backend retorne um objeto com a propriedade "token"
  return response.data;
}

// Busca os dados de um perfil de usuário/prestador
export const getProviderById = async (id: string): Promise<ProviderDetails> => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

// Busca as avaliações de um prestador específico
export const getReviewsByProvider = async (providerId: string): Promise<Review[]> => {
  const response = await api.get(`/servicos/reviews/provider/${providerId}`);
  return response.data;
};

// Cria uma nova avaliação para um serviço
export const createReview = async ({ servicoId, nota, comentario }: { servicoId: number, nota: number, comentario: string }): Promise<any> => {
  const response = await api.post(`/servicos/${servicoId}/avaliacoes`, { nota, comentario });
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

/**
 * Busca a lista de todos os serviços (que inclui dados dos prestadores)
 * A palavra "export" na frente torna esta função disponível para outros arquivos.
 */
export const getServices = async (): Promise<ProviderDetails[]> => {
  const { data } = await apiClient.get('/servicos'); // Faz a chamada GET para o seu backend
  return data;
};

export default api;
// src/services/api.ts

import axios from 'axios';

// 1. Cria a instância do Axios com a URL base da nossa API na nuvem.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

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
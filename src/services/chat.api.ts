// src/services/chat.api.ts (Versão Final e Corrigida)

import apiClient from './api'; // Importamos a nossa instância unificada do Axios
import { ChatSession, ChatMessage } from '@/types'; // Importamos os tipos necessários

/**
 * Busca as sessões de chat do utilizador logado.
 */
export const getChatSessionsApi = async (): Promise<ChatSession[]> => {
  const { data } = await apiClient.get('/chat/sessoes');
  return data;
};

/**
 * Busca as mensagens de uma sessão de chat específica.
 * @param sessionId - O ID da sessão de chat.
 */
// --- CORREÇÃO APLICADA AQUI ---
export const getMessagesForSessionApi = async (sessionId: string): Promise<ChatMessage[]> => {
  const { data } = await apiClient.get(`/chat/sessoes/${sessionId}/mensagens`);
  return data;
};

/**
 * Busca os detalhes de uma sessão de chat específica pelo seu ID.
 * @param sessionId - O ID da sessão de chat.
 */
// Esta função busca os detalhes de UMA sessão, incluindo os dados do outro participante
export const getChatSessionByIdApi = async (sessionId: string): Promise<ChatSession> => {
    const { data } = await apiClient.get(`/chat/sessoes/${sessionId}`); // O seu backend precisa de ter esta rota
    return data;
};

/**
 * Envia uma nova mensagem para uma sessão de chat.
 * @param payload - Um objeto contendo o ID da sessão e o conteúdo da mensagem.
 */
export const sendMessageApi = async (payload: { sessionId: string; content: string }): Promise<ChatMessage> => {
  const { sessionId, content } = payload;
  const { data } = await apiClient.post(`/chat/sessoes/${sessionId}/mensagens`, { content });
  return data;
};

/**
 * Inicia uma nova sessão de chat com outro utilizador ou obtém a existente.
 * @param otherUserId - O ID do outro utilizador na conversa.
 */
export const startOrGetChatSessionApi = async (otherUserId: string): Promise<{ sessionId: string }> => {
    const { data } = await apiClient.post('/chat/sessoes', { otherUserId });
    return data;
};
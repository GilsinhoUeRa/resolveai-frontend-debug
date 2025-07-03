// src/hooks/useChat.tsx (Refatorado com TanStack Query)

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuthHook';
import { getChatSessionsApi, sendMessageApi, startOrGetChatSessionApi } from '@/services/chat.api'; // Caminho correto para o novo módulo
import { ChatContextType, ChatSession } from '@/types';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query para buscar a lista de sessões de chat do usuário logado
  const { data: chatSessions = [], isLoading: loadingSessions } = useQuery<ChatSession[]>({
    queryKey: ['chatSessions', user?.id],
    queryFn: getChatSessionsApi,
    enabled: !!user, // Só executa se o usuário estiver logado
    refetchInterval: 10000, // Opcional: Atualiza a lista de conversas a cada 10 segundos
  });

  // Mutação para ENVIAR uma nova mensagem
  const sendMessageMutation = useMutation({
    mutationFn: sendMessageApi,
    onSuccess: (newMessage) => {
      // Invalida as queries para forçar a atualização da UI
      queryClient.invalidateQueries({ queryKey: ['messages', newMessage.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['chatSessions', user?.id] });
    },
  });

  // Mutação para INICIAR uma nova conversa
  const startChatMutation = useMutation({
    mutationFn: startOrGetChatSessionApi,
    onSuccess: () => {
      // Invalida a query de sessões para que a nova conversa apareça na lista
      queryClient.invalidateQueries({ queryKey: ['chatSessions', user?.id] });
    },
  });

  const value: any = { // O tipo 'any' é temporário até adicionarmos as outras funções
    chatSessions,
    loadingSessions,
    sendMessage: sendMessageMutation.mutateAsync,
    startOrGetChatSession: startChatMutation.mutateAsync,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
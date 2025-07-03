// src/hooks/useChat.tsx (Apenas Contexto e Provider)
import React, { createContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuthHook';
import { 
    getChatSessionsApi, 
    sendMessageApi, 
    startOrGetChatSessionApi,
    getMessagesForSessionApi // Importa a função que faltava
} from '@/services/chat.api';
import { ChatContextType, ChatSession, ChatMessage } from '@/types';

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: chatSessions = [], isLoading: loadingSessions } = useQuery<ChatSession[]>({
        queryKey: ['chatSessions', user?.id],
        queryFn: getChatSessionsApi,
        enabled: !!user,
    });

    const sendMessageMutation = useMutation<ChatMessage, Error, { sessionId: string; content: string }>({
        mutationFn: sendMessageApi,
        onSuccess: (newMessage) => {
            queryClient.invalidateQueries({ queryKey: ['messages', newMessage.sessionId] });
            queryClient.invalidateQueries({ queryKey: ['chatSessions', user?.id] });
        },
    });

    const startChatMutation = useMutation<{ sessionId: string }, Error, string>({
        mutationFn: startOrGetChatSessionApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatSessions', user?.id] });
        },
    });

    // Função para buscar mensagens, que na verdade é uma chamada direta à API
    // Não precisa de um useQuery aqui, pois cada página de chat fará a sua própria query.
    const getMessagesForSession = (sessionId: string): Promise<ChatMessage[]> => {
        return getMessagesForSessionApi(sessionId);
    };

    // O valor do contexto agora está completo e corretamente tipado
    const contextValue: ChatContextType = {
        chatSessions,
        loadingSessions,
// src/hooks/useChat.tsx (Apenas Contexto e Provider)
import React, { createContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuthHook';
import { 
    getChatSessionsApi, 
    sendMessageApi, 
    startOrGetChatSessionApi,
    getMessagesForSessionApi
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

    const getMessagesForSession = (sessionId: string): Promise<ChatMessage[]> => {
        return getMessagesForSessionApi(sessionId);
    };

    const contextValue: ChatContextType = {
        chatSessions,
        loadingSessions,
        getMessagesForSession,
        sendMessage: sendMessageMutation.mutateAsync,
        startOrGetChatSession: startChatMutation.mutateAsync,
        isLoadingMessages: (sessionId: string) => false, 
        markSessionAsRead: (sessionId: string) => {},
    };

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};
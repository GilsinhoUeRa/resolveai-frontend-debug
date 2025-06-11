
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ChatSession, ChatMessage, ChatContextType, User, ProviderDetails, UserType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { CHAT_SESSIONS_STORAGE_KEY, CHAT_MESSAGES_STORAGE_KEY_PREFIX } from '@/constants';

// MOCK_INITIAL_USERS_FOR_CHAT continua relevante para obter detalhes de participantes que podem não estar no `allUsers`
// TODO: Em produção, os detalhes do usuário viriam de uma API de usuários.
const MOCK_INITIAL_USERS_FOR_CHAT: (User | ProviderDetails)[] = [
    { id: 'currentUserClient1', name: 'João Fulano (Você)', email: 'joao@client.com', userType: UserType.CLIENT, photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    { id: 'provider1', name: 'Ana Silva', email: 'ana@example.com', userType: UserType.PROVIDER, photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
    { id: 'provider2', name: 'Carlos Pereira', email: 'carlos@example.com', userType: UserType.PROVIDER, photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// TODO: Estas funções getStored... serão substituídas por chamadas de API.
const getStoredChatSessions = (): ChatSession[] => {
  const stored = localStorage.getItem(CHAT_SESSIONS_STORAGE_KEY);
  if (stored) {
    const sessions = JSON.parse(stored) as ChatSession[];
    return sessions.map(s => ({ ...s, unreadCountByParticipant: s.unreadCountByParticipant || {} }));
  }
  return [];
};

const getStoredChatMessages = (sessionId: string): ChatMessage[] => {
  const stored = localStorage.getItem(`${CHAT_MESSAGES_STORAGE_KEY_PREFIX}${sessionId}`);
  return stored ? JSON.parse(stored) : [];
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: currentUser, allUsers } = useAuth(); // Adicionado allUsers
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]); // Inicializado vazio, carregado no useEffect
  const [loadingSessions, setLoadingSessions] = useState<boolean>(true);
  const [cachedMessages, setCachedMessages] = useState<{ [sessionId:string]: ChatMessage[] }>({});
  const [loadingMessages, setLoadingMessages] = useState<{ [sessionId: string]: boolean }>({});

  // TODO: Este useEffect de persistência será obsoleto. O backend cuidará disso.
  useEffect(() => {
    localStorage.setItem(CHAT_SESSIONS_STORAGE_KEY, JSON.stringify(chatSessions));
  }, [chatSessions]);

  // TODO: Este useEffect de persistência será obsoleto. O backend cuidará disso.
  useEffect(() => {
    Object.keys(cachedMessages).forEach(sessionId => {
      localStorage.setItem(`${CHAT_MESSAGES_STORAGE_KEY_PREFIX}${sessionId}`, JSON.stringify(cachedMessages[sessionId]));
    });
  }, [cachedMessages]);
  
  useEffect(() => {
    if (currentUser) {
      setLoadingSessions(true);
      // TODO: Substituir por chamada à API: fetch('/api/chat/sessions')
      // A API retornaria as sessões do usuário logado.
      const userSessionsFromStorage = getStoredChatSessions()
        .filter(session => session.participantIds.includes(currentUser.id))
        .map(s => ({ ...s, unreadCountByParticipant: s.unreadCountByParticipant || {} }))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setChatSessions(userSessionsFromStorage);
      setLoadingSessions(false);
    } else {
      setChatSessions([]);
      setLoadingSessions(false);
    }
  }, [currentUser]);


  const getMessagesForSession = useCallback(async (sessionId: string): Promise<ChatMessage[]> => {
    // TODO: Substituir por chamada à API: fetch(`/api/chat/sessions/${sessionId}/messages`)
    // O cache local pode ser mantido para otimização, mas a fonte da verdade é a API.
    if (cachedMessages[sessionId]) {
      return cachedMessages[sessionId];
    }
    setLoadingMessages(prev => ({ ...prev, [sessionId]: true }));
    return new Promise(resolve => {
      setTimeout(() => { // Simula delay da API
        const messagesFromStorage = getStoredChatMessages(sessionId)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setCachedMessages(prev => ({ ...prev, [sessionId]: messagesFromStorage }));
        setLoadingMessages(prev => ({ ...prev, [sessionId]: false }));
        resolve(messagesFromStorage);
      }, 500);
    });
  }, [cachedMessages]);

  const startOrGetChatSession = useCallback(async (targetUserId: string): Promise<string | null> => {
    if (!currentUser) return null;
    // TODO: Substituir por chamada à API: fetch('/api/chat/sessions', { method: 'POST', body: { targetUserId } })
    // A API criaria ou retornaria a sessão existente.

    const existingSession = chatSessions.find(session =>
      session.participantIds.includes(currentUser.id) && session.participantIds.includes(targetUserId)
    );

    if (existingSession) {
      return existingSession.id;
    }

    const newSessionId = `session_${Date.now()}_${Math.random().toString(16).slice(2)}`; // ID gerado no frontend (temporário)
    const newSession: ChatSession = {
      id: newSessionId,
      participantIds: [currentUser.id, targetUserId],
      updatedAt: new Date().toISOString(),
      unreadCountByParticipant: { [currentUser.id]: 0, [targetUserId]: 0 },
    };
    
    setChatSessions(prevSessions => [newSession, ...prevSessions]
        .sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    return newSessionId;
  }, [currentUser, chatSessions]);


  const sendMessage = useCallback(async (sessionId: string, content: string): Promise<ChatMessage | null> => {
    if (!currentUser) return null;
    // TODO: Substituir por chamada à API: fetch(`/api/chat/sessions/${sessionId}/messages`, { method: 'POST', body: { content } })
    // A API persistiria a mensagem e a retornaria, e possivelmente enviaria via WebSockets para o outro participante.

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`, // ID gerado no frontend (temporário)
      sessionId,
      senderId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      read: false, 
    };

    setCachedMessages(prev => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] || []), newMessage],
    }));
    
    const currentSession = chatSessions.find(s => s.id === sessionId);
    const otherParticipantId = currentSession?.participantIds.find(pid => pid !== currentUser.id);

    setChatSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === sessionId) {
          const newUnreadCounts = { ...(session.unreadCountByParticipant || {}) };
          if (otherParticipantId) {
            // Esta lógica de unread DEVE ser do backend ou via WebSockets.
            newUnreadCounts[otherParticipantId] = (newUnreadCounts[otherParticipantId] || 0) + 1;
          }
          return { 
            ...session, 
            lastMessage: newMessage, 
            updatedAt: newMessage.timestamp,
            unreadCountByParticipant: newUnreadCounts
          };
        }
        return session;
      }).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
    
    // TODO: A simulação de auto-reply deve ser removida. O backend lidaria com respostas reais.
    if (currentSession && otherParticipantId) {
        setTimeout(() => {
            const replyMessage: ChatMessage = {
                id: `msg_reply_${Date.now()}`,
                sessionId,
                senderId: otherParticipantId,
                content: `(Simulado) Recebido: "${content.substring(0,20)}"...`,
                timestamp: new Date().toISOString(),
                read: false,
            };
            setCachedMessages(prev => ({
                ...prev,
                [sessionId]: [...(prev[sessionId] || []), replyMessage],
            }));
            setChatSessions(prevReplySessions =>
                prevReplySessions.map(session => {
                    if (session.id === sessionId) {
                        const newUnreadCounts = { ...(session.unreadCountByParticipant || {}) };
                        newUnreadCounts[currentUser.id] = (newUnreadCounts[currentUser.id] || 0) + 1;
                        return { 
                            ...session, 
                            lastMessage: replyMessage, 
                            updatedAt: replyMessage.timestamp,
                            unreadCountByParticipant: newUnreadCounts
                        };
                    }
                    return session;
                }).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            );
        }, 1500 + Math.random() * 1000);
    }

    return newMessage;
  }, [currentUser, chatSessions]);
  
  const markSessionAsRead = useCallback((sessionId: string) => {
    if (!currentUser) return;
    // TODO: Esta operação também pode ser uma chamada de API, ex: POST /api/chat/sessions/:sessionId/read
    setChatSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === sessionId) {
          const newUnreadCounts = { ...(session.unreadCountByParticipant || {}) };
          newUnreadCounts[currentUser.id] = 0;
          return { ...session, unreadCountByParticipant: newUnreadCounts };
        }
        return session;
      })
    );
  }, [currentUser]);

  const isLoadingMessages = useCallback((sessionId: string): boolean => {
    return !!loadingMessages[sessionId];
  }, [loadingMessages]);

  // Função getMockUserDetails agora usa `allUsers` do `useAuth` como fonte primária.
  const getParticipantDetails = useCallback((userId: string): User | ProviderDetails | undefined => {
    const userFromAuth = allUsers.find(u => u.id === userId);
    if (userFromAuth) return userFromAuth;
    
    // Fallback para o MOCK_INITIAL_USERS_FOR_CHAT se não encontrado em allUsers
    // (útil se `allUsers` ainda não estiver totalmente populado ou para usuários não registrados)
    const mockUser = MOCK_INITIAL_USERS_FOR_CHAT.find(u => u.id === userId);
    if (mockUser) {
        const { hashedPassword, ...userWithoutHash } = mockUser as any; // Remove mock hashedPassword se existir
        return userWithoutHash;
    }
    return undefined;
  }, [allUsers]);


  return (
    <ChatContext.Provider value={{ 
        chatSessions, 
        loadingSessions, 
        getMessagesForSession, 
        sendMessage,
        startOrGetChatSession,
        isLoadingMessages,
        markSessionAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Helper para obter detalhes do usuário, agora exportado do ChatContext para uso em outros componentes
export const getMockUserDetails = (userId: string): User | ProviderDetails | undefined => {
    // Esta função agora é uma fachada. O ideal é que o ChatProvider exporte uma função que use
    // o `allUsers` do seu próprio escopo, ou que os componentes obtenham `allUsers` do `useAuth`.
    // Para manter a compatibilidade com o uso existente, vamos tentar pegar do localStorage.
    // Esta é uma solução temporária para a transição.
    const storedAuthUsers = localStorage.getItem('resolveai_users');
    if (storedAuthUsers) {
        const users: (User | ProviderDetails)[] = JSON.parse(storedAuthUsers);
        const foundUser = users.find(u => u.id === userId);
        if (foundUser) {
            const { hashedPassword, ...userWithoutHash } = foundUser as any;
            return userWithoutHash;
        }
    }
    
    const mockUser = MOCK_INITIAL_USERS_FOR_CHAT.find(u => u.id === userId);
    if (mockUser) {
        const { hashedPassword, ...userWithoutHash } = mockUser as any;
        return userWithoutHash;
    }
    console.warn(`[getMockUserDetails] User ${userId} not found in localStorage or MOCK_INITIAL_USERS_FOR_CHAT.`);
    return undefined;
};

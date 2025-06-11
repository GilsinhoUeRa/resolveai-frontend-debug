
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppNotification, AppNotificationContextType, ChatSession } from '@/types';
import { useAuth } from '@/hooks/useAuth';
// import { useChat } from './useChat'; // Temporariamente comentado, pois notificações virão da API
// import { getMockUserDetails } from './useChat'; // Temporariamente comentado

const APP_NOTIFICATIONS_STORAGE_KEY = 'resolveai_app_notifications_v2'; // Mudado para evitar conflito

const AppNotificationContext = createContext<AppNotificationContextType | undefined>(undefined);

// TODO: Esta função será obsoleta. Notificações virão da API.
const getStoredAppNotifications = (): AppNotification[] => {
  const stored = localStorage.getItem(APP_NOTIFICATIONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const AppNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: currentUser } = useAuth();
  // const { chatSessions } = useChat(); // Não mais usado para derivar notificações aqui
  const [notifications, setNotifications] = useState<AppNotification[]>([]); // Inicializado vazio
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // TODO: Este useEffect de persistência será obsoleto.
  useEffect(() => {
    localStorage.setItem(APP_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoadingNotifications(false);
      return;
    }
    setLoadingNotifications(true);
    // TODO: Substituir por chamada à API para buscar notificações: fetch('/api/notifications')
    // A API retornaria as notificações do usuário, incluindo as não lidas.
    // Por agora, vamos carregar do localStorage para manter alguma funcionalidade.
    const storedUserNotifications = getStoredAppNotifications().filter(n => {
        // Em um cenário real, a API filtraria isso. Aqui, é um mock grosseiro.
        // Este filtro assumiria que o ID do usuário está em algum lugar na notificação.
        // Ou que as notificações armazenadas já são específicas do usuário.
        return true; 
    });

    // Simulação de notificações de chat (MANTIDO TEMPORARIAMENTE PARA UX, mas idealmente do backend)
    // Esta parte será removida quando o backend prover as notificações de chat.
    const chatSessionsFromStorage = localStorage.getItem('resolveai_chat_sessions');
    const localChatSessions: ChatSession[] = chatSessionsFromStorage ? JSON.parse(chatSessionsFromStorage) : [];
    const derivedChatNotifications: AppNotification[] = [];

    localChatSessions.forEach(session => {
      if (session.participantIds.includes(currentUser.id)) {
        const unreadCountForCurrentUser = session.unreadCountByParticipant?.[currentUser.id] || 0;
        if (unreadCountForCurrentUser > 0 && session.lastMessage) {
          // const otherParticipantId = session.participantIds.find(id => id !== currentUser.id);
          // const otherParticipant = otherParticipantId ? getMockUserDetails(otherParticipantId) : null; // getMockUserDetails precisaria ser importado
          const senderName = 'Alguém (Chat)'; // Simplificado

          derivedChatNotifications.push({
            id: `chat_${session.id}_${new Date(session.lastMessage.timestamp).getTime()}`, // ID mais único para evitar colisões
            type: 'chat_message',
            title: `Nova${unreadCountForCurrentUser > 1 ? 's' : ''} mensagem${unreadCountForCurrentUser > 1 ? 'ns' : ''} de ${senderName}`,
            message: session.lastMessage.content.substring(0, 50) + (session.lastMessage.content.length > 50 ? '...' : ''),
            link: `/chat/${session.id}`,
            timestamp: session.lastMessage.timestamp,
            isRead: false, 
            sourceId: session.id,
          });
        }
      }
    });
    
    // Combinar e remover duplicatas (baseado em ID, se possível, ou lógica mais complexa)
    const combinedNotifications = [...storedUserNotifications];
    derivedChatNotifications.forEach(dcn => {
        if (!combinedNotifications.some(cn => cn.id === dcn.id || (cn.sourceId === dcn.sourceId && cn.type === 'chat_message'))) {
            combinedNotifications.push(dcn);
        }
    });
    
    setNotifications(combinedNotifications.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    setLoadingNotifications(false);

  }, [currentUser]);

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = useCallback((notificationId: string) => {
    // TODO: Enviar para API: fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    // TODO: Enviar para API: fetch(`/api/notifications/mark-all-read`, { method: 'POST' })
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  return (
    <AppNotificationContext.Provider
      value={{
        notifications,
        unreadNotificationCount,
        markAsRead,
        markAllAsRead,
        // loadingNotifications, // Poderia ser exposto se necessário
      }}
    >
      {children}
    </AppNotificationContext.Provider>
  );
};

export const useAppNotifications = (): AppNotificationContextType => {
  const context = useContext(AppNotificationContext);
  if (context === undefined) {
    throw new Error('useAppNotifications must be used within an AppNotificationProvider');
  }
  return context;
};

// src/components/ChatListItem.tsx (Refatorado)
import React from 'react';
import { Link } from 'react-router-dom';
import { ChatSession } from '@/types';
import { APP_ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

interface ChatListItemProps {
  session: ChatSession;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ session }) => {
  const { user: currentUser } = useAuth();

  if (!currentUser || !session.otherParticipant) return null;

  // 1. DADOS VÊM DIRETAMENTE DA API, SEM FUNÇÃO MOCK
  const { otherParticipant } = session;
  const participantName = otherParticipant.name || 'Usuário Desconhecido';
  const participantPhotoUrl = otherParticipant.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(participantName)}&background=9e9e9e&color=fff&size=96`;

  // ... sua lógica de formatDate ...

  const lastMessageText = session.lastMessage?.content 
    ? (session.lastMessage.senderId === currentUser.id ? "Você: " : "") + session.lastMessage.content 
    : "Nenhuma mensagem ainda.";

  const hasUnread = (session.unreadCountByParticipant?.[currentUser.id] || 0) > 0;

  return (
    <Link
      to={`${APP_ROUTES.CHAT_CONVERSATION}/${session.id}`}
      className="block p-4 bg-white hover:bg-light-bg rounded-lg shadow-md ..."
    >
      <div className="flex items-center space-x-4">
        <div className="relative flex-shrink-0">
          <img
            src={participantPhotoUrl}
            alt={participantName}
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-semibold ...`}>
              {participantName}
            </h3>
            {/* ... */}
          </div>
          <p className={`text-sm truncate ...`}>
            {lastMessageText}
          </p>
        </div>
        {/* ... */}
      </div>
    </Link>
  );
};

export default ChatListItem;
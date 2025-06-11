import React from 'react';
import { Link } from 'react-router-dom';
import { ChatSession, User, ProviderDetails } from '@/types';
import { APP_ROUTES, COLORS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { getMockUserDetails } from '@/hooks/useChat'; // Helper to get user details

interface ChatListItemProps {
  session: ChatSession;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ session }) => {
  const { user: currentUser } = useAuth();

  if (!currentUser) return null;

  const otherParticipantId = session.participantIds.find(id => id !== currentUser.id);
  if (!otherParticipantId) return null; 

  const otherParticipant = getMockUserDetails(otherParticipantId);
  
  const participantName = otherParticipant?.name || 'Usuário Desconhecido';
  const participantPhotoUrl = otherParticipant?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(participantName)}&background=9e9e9e&color=fff&size=96`;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1 && date.getDate() === now.getDate()) { 
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1 || (diffDays <=1 && date.getDate() !== now.getDate())) { 
        if(now.getDate() - date.getDate() === 1 || (now.getDate() === 1 && date.getDate() >= 28)) return 'Ontem'; // Handle month change
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };
  
  const lastMessageText = session.lastMessage?.content ? 
    (session.lastMessage.senderId === currentUser.id ? "Você: " : "") + session.lastMessage.content 
    : "Nenhuma mensagem ainda.";

  const unreadCountForCurrentUser = session.unreadCountByParticipant?.[currentUser.id] || 0;
  const hasUnread = unreadCountForCurrentUser > 0;


  return (
    <Link
      to={`${APP_ROUTES.CHAT_CONVERSATION}/${session.id}`}
      className="block p-4 bg-white hover:bg-light-bg rounded-lg shadow-md transition-colors duration-150 border border-cinza-neutro/20"
    >
      <div className="flex items-center space-x-4">
        <div className="relative flex-shrink-0">
          <img
            src={participantPhotoUrl}
            alt={participantName}
            className="w-14 h-14 rounded-full object-cover"
            onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participantName)}&background=9e9e9e&color=fff&size=96`)}
          />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-semibold text-grafite-profundo truncate ${hasUnread ? 'font-bold' : ''}`}>
              {participantName}
            </h3>
            <span className={`text-xs ${hasUnread ? 'text-orange-energia font-semibold' : 'text-cinza-neutro'}`}>
              {formatDate(session.lastMessage?.timestamp || session.updatedAt)}
            </span>
          </div>
          <p className={`text-sm truncate ${hasUnread ? 'text-grafite-profundo font-medium' : 'text-cinza-neutro'}`}>
            {lastMessageText}
          </p>
        </div>
        {hasUnread && (
            <div className="flex-shrink-0 ml-2">
                <span className="block h-3 w-3 rounded-full bg-orange-energia" title={`${unreadCountForCurrentUser} nova${unreadCountForCurrentUser > 1 ? 's': ''} mensagem${unreadCountForCurrentUser > 1 ? 'ns': ''}`}></span>
            </div>
        )}
      </div>
    </Link>
  );
};

export default ChatListItem;
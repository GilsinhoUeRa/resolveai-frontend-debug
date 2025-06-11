
import React, { useState, useEffect, useRef, FormEvent, CSSProperties } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useAuth } from '@/hooks/useAuth';
import { useChat, getMockUserDetails } from '@/hooks/useChat';
import { ChatMessage as ChatMessageType, User, ProviderDetails } from '@/types';
import ChatMessageBubble from '@/components/ChatMessageBubble';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { APP_ROUTES, COLORS } from '@/constants';
import MessageSquareIcon from '@/components/icons/MessageSquareIcon';

const ROW_HEIGHT = 100; // Estimativa de altura para cada mensagem, ajuste conforme necessário

const MessageRow: React.FC<ListChildComponentProps> = ({ index, style, data }) => {
  const { messages, currentUser } = data;
  const msg = messages[index];
  if (!currentUser || !msg) return null;
  return (
    <div style={style}>
      <ChatMessageBubble message={msg} isSender={msg.senderId === currentUser.id} />
    </div>
  );
};


const ChatConversationPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user: currentUser } = useAuth();
  const { getMessagesForSession, sendMessage, chatSessions, isLoadingMessages: isChatContextLoadingMessages, markSessionAsRead } = useChat();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [otherParticipant, setOtherParticipant] = useState<User | ProviderDetails | null>(null);
  const [isSending, setIsSending] = useState(false);

  const listRef = useRef<List | null>(null);
  const messagesRef = useRef<ChatMessageType[]>(messages); // Ref para 'messages'

  // Efeito para manter messagesRef sincronizado com o estado messages
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages]); 

  useEffect(() => {
    if (!chatId || !currentUser) {
      navigate(APP_ROUTES.CHAT_LIST);
      return;
    }

    markSessionAsRead(chatId); 

    const currentSession = chatSessions.find(s => s.id === chatId);
    if (currentSession) {
      const otherId = currentSession.participantIds.find(id => id !== currentUser.id);
      if (otherId) {
        const participantDetails = getMockUserDetails(otherId);
        setOtherParticipant(participantDetails || null);
      }
    } else {
      console.warn("Session not found in current list, might be new or error.")
    }

    const fetchMessages = async () => {
      const fetchedMessages = await getMessagesForSession(chatId);
      setMessages(fetchedMessages);
    };
    fetchMessages();
  }, [chatId, currentUser, chatSessions, getMessagesForSession, navigate, markSessionAsRead]);
  
  // Efeito de polling para novas mensagens
  useEffect(() => {
    if (!chatId || !currentUser) return;
    const interval = setInterval(async () => {
        const updatedMessages = await getMessagesForSession(chatId);
        // Compara com messagesRef.current em vez de 'messages' do estado
        if (JSON.stringify(updatedMessages) !== JSON.stringify(messagesRef.current)) {
            setMessages(updatedMessages);
        }
    }, 2000); 
    return () => clearInterval(interval);
  }, [chatId, getMessagesForSession, currentUser]); // 'messages' removido do array de dependências


  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessageContent.trim() || !chatId || !currentUser) return;

    setIsSending(true);
    await sendMessage(chatId, newMessageContent.trim());
    setNewMessageContent('');
    setIsSending(false);
    markSessionAsRead(chatId);
  };

  const pageLoading = isChatContextLoadingMessages(chatId || '') && messages.length === 0;

  if (!currentUser) return <div className="text-center p-8">Carregando...</div>; 

  if (pageLoading && !otherParticipant) {
     return (
        <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
            {/* Header Skeleton */}
            <header className="sticky top-0 z-10 flex items-center p-3 bg-white border-b border-cinza-neutro/30 animate-pulse">
                <div className="h-6 w-6 bg-cinza-neutro/30 rounded mr-3"></div>
                <div className="w-10 h-10 bg-cinza-neutro/30 rounded-full mr-3"></div>
                <div className="h-6 bg-cinza-neutro/30 rounded w-1/3"></div>
            </header>
            {/* Message Area Skeleton */}
            <div className="flex-grow p-4 space-y-3 overflow-y-auto">
                {[1,2,3,4].map(i => (
                    <div key={i} className={`flex ${i%2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`h-12 w-1/2 bg-cinza-neutro/20 rounded-lg ${i%2 === 0 ? 'bg-orange-energia/20' : ''}`}></div>
                    </div>
                ))}
            </div>
        </div>
     );
  }

  if (!otherParticipant && !pageLoading) {
    return <div className="text-center p-8">Participante da conversa não encontrado.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] bg-white rounded-lg shadow-md overflow-hidden">
      <header className="sticky top-0 z-10 flex items-center p-3 bg-white border-b border-cinza-neutro/30">
        <button onClick={() => navigate(APP_ROUTES.CHAT_LIST)} className="p-2 mr-2 text-grafite-profundo hover:text-orange-energia">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {otherParticipant && (
            <Link to={`${APP_ROUTES.PROVIDER_PROFILE}/${otherParticipant.id}`} className="flex items-center">
                 <img 
                    src={otherParticipant.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=f57c00&color=fff&size=40`}
                    alt={otherParticipant.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <h2 className="text-lg font-semibold text-grafite-profundo">{otherParticipant.name}</h2>
            </Link>
        )}
      </header>

      <div className="flex-grow overflow-y-auto bg-light-bg/50 p-4">
        {messages.length === 0 && !isChatContextLoadingMessages(chatId || '') ? (
            <div className="text-center text-cinza-neutro py-10 flex flex-col items-center justify-center h-full">
                <MessageSquareIcon size={48} className="mx-auto mb-2"/>
                Nenhuma mensagem nesta conversa ainda. <br/> Envie uma mensagem para começar!
            </div>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={listRef}
                height={height}
                itemCount={messages.length}
                itemSize={ROW_HEIGHT} 
                itemData={{ messages, currentUser }}
                width={width}
              >
                {MessageRow}
              </List>
            )}
          </AutoSizer>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-cinza-neutro/30 bg-white">
        <div className="flex items-center space-x-2">
          <Input
            name="newMessageContent"
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            className="flex-grow !mb-0" 
            containerClassName="flex-grow !mb-0"
            autoComplete="off"
            disabled={isSending}
          />
          <Button type="submit" variant="primary" isLoading={isSending} disabled={!newMessageContent.trim() || isSending}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11.5a1 1 0 011-1h2a1 1 0 011 1v5.071a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatConversationPage;

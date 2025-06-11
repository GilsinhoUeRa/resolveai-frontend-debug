import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import ChatListItem from '@/components/ChatListItem';
import Button from '@/components/Button';
import { APP_ROUTES } from '@/constants';
import ProfilePageSkeleton from '@/components/skeletons/ProfilePageSkeleton'; // Re-using for loading state

const ChatListPage: React.FC = () => {
  const { user } = useAuth();
  const { chatSessions, loadingSessions } = useChat();

  if (loadingSessions) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-grafite-profundo">Minhas Conversas</h1>
        </header>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-cinza-neutro/30"></div>
                <div className="flex-grow">
                  <div className="h-5 bg-cinza-neutro/30 rounded w-1/2 mb-1.5"></div>
                  <div className="h-4 bg-cinza-neutro/30 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-grafite-profundo">Minhas Conversas</h1>
        {/* Optional: Button to start a new chat if there was a contact list */}
      </header>

      {chatSessions.length > 0 ? (
        <div className="space-y-4">
          {chatSessions.map(session => (
            <ChatListItem key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white p-8 rounded-lg shadow-md">
           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-cinza-neutro mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25S3.75 16.556 3.75 12C3.75 7.444 7.612 3.75 12.375 3.75S21 7.444 21 12z" />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-grafite-profundo">Nenhuma conversa encontrada.</h3>
          <p className="mt-2 text-md text-cinza-neutro">
            Inicie uma conversa com um prestador de serviço para vê-la aqui.
          </p>
          <div className="mt-6">
            <Link to={APP_ROUTES.PROVIDERS}>
              <Button variant="primary" size="lg">
                Encontrar Prestadores
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatListPage;
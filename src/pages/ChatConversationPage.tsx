// src/pages/ChatConversationPage.tsx (Versão com Partilha de Localização Corrigida)
import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

// Nossos hooks customizados
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useGeolocation } from '@/hooks/useGeolocation';

// Funções de API e Tipos
import { getMessagesForSessionApi, getChatSessionByIdApi } from '@/services/chat.api';
import { ChatMessage as ChatMessageType, ChatSession, ProviderDetails, User } from '@/types';

// Componentes de UI
import ChatMessageBubble from '@/components/ChatMessageBubble';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { APP_ROUTES } from '@/constants';
import LocationIcon from '@/components/icons/LocationIcon';

const socket: Socket = io(String(import.meta.env.VITE_API_BASE_URL).replace('/api', ''));

const ChatConversationPage: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const { loading: loadingLocation, error: locationError, getLocation } = useGeolocation();

    const [newMessageContent, setNewMessageContent] = useState('');

    // ... (sua lógica de useQuery e useEffect para socket permanece a mesma) ...

    useEffect(() => {
        if (locationError) {
            if (locationError.code === locationError.PERMISSION_DENIED) {
                addToast('Você negou a permissão para aceder à sua localização.', 'error');
            } else {
                addToast('Não foi possível obter a sua localização.', 'error');
            }
        }
    }, [locationError, addToast]);

    const handleSendMessage = (content: string) => {
        if (!content.trim() || !chatId || !currentUser) return;
        
        socket.emit('sendMessage', {
            content: content.trim(),
            sessionId: chatId,
            senderId: currentUser.id,
        });
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSendMessage(newMessageContent);
        setNewMessageContent('');
    };

    const handleShareLocation = () => {
        getLocation((location) => {
            if (location) {
                const { latitude, longitude } = location;
                // --- CORREÇÃO APLICADA AQUI ---
                // Usamos o formato de URL padrão do Google Maps para abrir coordenadas.
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                
                handleSendMessage(`Aqui está a minha localização atual: ${googleMapsUrl}`);
                
                addToast('Localização partilhada com sucesso!', 'success');
            }
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
            {/* ... Seu Header aqui ... */}
            
            <div className="flex-grow overflow-y-auto p-4">
                {/* Sua lógica para renderizar as mensagens */}
            </div>

            <form onSubmit={handleFormSubmit} className="p-3 border-t bg-white">
                 <div className="flex items-center space-x-2">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={handleShareLocation} 
                        isLoading={loadingLocation}
                        title="Partilhar localização"
                        className="!p-2"
                    >
                        <LocationIcon size={20} />
                    </Button>

                    <Input
                        name="newMessageContent"
                        type="text"
                        placeholder="Digite a sua mensagem..."
                        value={newMessageContent}
                        onChange={(e) => setNewMessageContent(e.target.value)}
                        className="flex-grow !mb-0" 
                        autoComplete="off"
                    />
                    <Button type="submit" variant="primary" disabled={!newMessageContent.trim()}>
                        Enviar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChatConversationPage;
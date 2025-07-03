// src/hooks/useChatHook.ts
import { useContext } from 'react';
import { ChatContext } from './useChat'; // Importa o CONTEXTO
import { ChatContextType } from '@/types';

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
};
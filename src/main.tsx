// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. IMPORTAÇÕES DO TANSTACK QUERY
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Importações dos seus Providers de Contexto
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';
import { ChatProvider } from '@/hooks/useChat';
import { AppNotificationProvider } from '@/hooks/useAppNotifications';
import { FavoritesProvider } from '@/hooks/useFavorites';

// Importação do Componente Principal da Aplicação
import App from '@/App'; 

// A ÚNICA importação de CSS necessária para o Tailwind
import '@/index.css';

// 2. CRIE UMA INSTÂNCIA DO CLIENTE
const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Elemento 'root' não foi encontrado no seu index.html");
}

const root = ReactDOM.createRoot(rootElement);

// Renderiza a aplicação envolvendo o componente App com todos os providers
root.render(
  <React.StrictMode>
   <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ChatProvider>
            <AppNotificationProvider>
              <App />
            </AppNotificationProvider>
          </ChatProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ToastProvider>
   </QueryClientProvider>
  </React.StrictMode>
);
// src/main.tsx (Versão Final com Todos os Providers)

import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. IMPORTAÇÕES DO TANSTACK QUERY
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Seus outros providers
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { ChatProvider } from './hooks/useChat';
import { AppNotificationProvider } from './hooks/useAppNotifications';
import { FavoritesProvider } from './hooks/useFavorites';

import App from './App';
import './index.css';

// 2. CRIE UMA INSTÂNCIA DO CLIENTE
const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Elemento 'root' não foi encontrado");
}

const root = ReactDOM.createRoot(rootElement);

// 3. ENVOLVA TUDO COM OS PROVIDERS
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
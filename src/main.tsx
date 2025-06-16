// src/main.tsx (Versão Final Corrigida)

import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. IMPORTAÇÕES DO TANSTACK QUERY
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Importações dos seus Providers e do componente App
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
  throw new Error("Elemento 'root' não foi encontrado no seu index.html");
}

const root = ReactDOM.createRoot(rootElement);

// 3. Renderiza a aplicação envolvendo o <App /> com TODOS os providers necessários
root.render(
  <React.StrictMode>
    {/* O QueryClientProvider deve ser um dos providers mais externos */}
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
// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';

// Context Providers
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';
import { ChatProvider } from '@/hooks/useChat';
import { AppNotificationProvider } from '@/hooks/useAppNotifications';
import { FavoritesProvider } from '@/hooks/useFavorites';

// Importação Global de Estilos (para o Tailwind funcionar)
import '@/index.css';

// Componente Principal
import App from '@/App.tsx';



const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Elemento 'root' não encontrado no index.html");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
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
  </React.StrictMode>
);
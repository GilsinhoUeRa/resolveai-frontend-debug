
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import './src/index.css';
import { AuthProvider } from './src/hooks/useAuth';
import { ToastProvider } from './src/hooks/useToast';
import { ChatProvider } from './src/hooks/useChat';
import { AppNotificationProvider } from './src/hooks/useAppNotifications';
import { FavoritesProvider } from './src/hooks/useFavorites'; // Import FavoritesProvider

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <FavoritesProvider> {/* Add FavoritesProvider here */}
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
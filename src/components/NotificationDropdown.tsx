
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppNotification } from '@/types';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import Button from '@/components/Button';
import { COLORS, APP_ROUTES } from '@/constants'; // Importar APP_ROUTES

interface NotificationDropdownProps {
  onClose: () => void; // Callback to close the dropdown
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, unreadNotificationCount, markAsRead, markAllAsRead } = useAppNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: AppNotification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    onClose();
  };

  const handleMarkAllReadClick = () => {
    markAllAsRead();
    // Optionally, keep the dropdown open or close it
    // onClose(); 
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffMinutes < 1) return "Agora";
    if (diffMinutes < 60) return `${diffMinutes}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div 
        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-xl z-50 border border-cinza-neutro/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <div className="p-3 border-b border-cinza-neutro/20 flex justify-between items-center">
        <h3 className="text-md font-semibold text-grafite-profundo">Notificações</h3>
        {unreadNotificationCount > 0 && (
          <Button onClick={handleMarkAllReadClick} variant="ghost" size="sm" className="!text-xs !py-0.5 !px-1.5">
            Marcar todas como lidas
          </Button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-cinza-neutro text-center py-8 px-4">Nenhuma notificação nova.</p>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-3 border-b border-cinza-neutro/10 hover:bg-light-bg cursor-pointer ${!notification.isRead ? 'bg-orange-energia/5' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className={`block text-sm font-semibold ${!notification.isRead ? 'text-orange-energia' : 'text-grafite-profundo'}`}>
                  {notification.title}
                </span>
                {!notification.isRead && (
                    <span className="w-2 h-2 bg-orange-energia rounded-full flex-shrink-0 ml-2 mt-1.5" title="Não lida"></span>
                )}
              </div>
              <p className="text-xs text-grafite-profundo/80 truncate">{notification.message}</p>
              <p className="text-xs text-cinza-neutro mt-1 text-right">{formatDate(notification.timestamp)}</p>
            </div>
          ))
        )}
      </div>
       {notifications.length > 0 && (
        <div className="p-2 bg-light-bg/50 border-t border-cinza-neutro/20 text-center">
            <Link to={APP_ROUTES.NOTIFICATIONS_HISTORY} onClick={onClose} className="text-sm text-orange-energia hover:underline">
                Ver todas as notificações
            </Link>
        </div>
       )}
    </div>
  );
};

export default NotificationDropdown;
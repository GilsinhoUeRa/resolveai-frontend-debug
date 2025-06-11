
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import { AppNotification } from '@/types';
import NotificationHistoryItem from '@/components/NotificationHistoryItem';
import Button from '@/components/Button';
import Card from '@/components/Card';
import BellIcon from '@/components/icons/BellIcon'; // For empty state

const NotificationHistoryPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, unreadNotificationCount } = useAppNotifications();
  const navigate = useNavigate();

  const handleNotificationItemClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    // Navigation is handled by NotificationHistoryItem after marking as read
  };

  // Sort notifications by timestamp, newest first
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center">
        <h1 className="text-3xl font-bold text-grafite-profundo mb-2 sm:mb-0">Histórico de Notificações</h1>
        {notifications.length > 0 && unreadNotificationCount > 0 && (
          <Button onClick={markAllAsRead} variant="primary" size="sm">
            Marcar todas como lidas ({unreadNotificationCount})
          </Button>
        )}
      </header>

      {sortedNotifications.length > 0 ? (
        <div className="space-y-3">
          {sortedNotifications.map(notification => (
            <NotificationHistoryItem 
              key={notification.id} 
              notification={notification} 
              onNotificationClick={handleNotificationItemClick} 
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <BellIcon size={60} className="mx-auto text-cinza-neutro mb-4" isActive={false} />
          <h2 className="text-xl font-semibold text-grafite-profundo">Nenhuma notificação por aqui.</h2>
          <p className="text-cinza-neutro mt-2">Seu histórico de notificações está vazio no momento.</p>
        </Card>
      )}
    </div>
  );
};

export default NotificationHistoryPage;
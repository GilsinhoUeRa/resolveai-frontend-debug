
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNotification } from '@/types';
import Card from '@/components/Card';
import MessageSquareIcon from '@/components/icons/MessageSquareIcon';
import ListChecksIcon from '@/components/icons/ListChecksIcon';
import BellIcon from '@/components/icons/BellIcon';
import { COLORS } from '@/constants';

interface NotificationHistoryItemProps {
  notification: AppNotification;
  onNotificationClick: (notification: AppNotification) => void;
}

const NotificationHistoryItem: React.FC<NotificationHistoryItemProps> = ({ notification, onNotificationClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onNotificationClick(notification); // Marks as read via context
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getIcon = () => {
    const iconProps = { 
      size: 20, 
      className: `mr-3 flex-shrink-0 ${notification.isRead ? 'text-cinza-neutro' : 'text-orange-energia'}`,
      isActive: !notification.isRead, // Use isActive to potentially color the icon if unread
    };
    switch (notification.type) {
      case 'chat_message':
        return <MessageSquareIcon {...iconProps} />;
      case 'new_review':
        return <ListChecksIcon {...iconProps} />;
      case 'system_update':
      default:
        return <BellIcon {...iconProps} hasNotifications={!notification.isRead} />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Card 
      className={`mb-4 transition-all duration-300 ${!notification.isRead ? 'bg-orange-50 border-orange-energia/50' : 'bg-white border-cinza-neutro/20'} hover:shadow-md`}
      onClick={handleClick}
    >
      <div className="flex items-start">
        {getIcon()}
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h3 className={`text-md font-semibold ${!notification.isRead ? 'text-orange-energia' : 'text-grafite-profundo'}`}>
              {notification.title}
            </h3>
            {!notification.isRead && (
              <span 
                className="w-2.5 h-2.5 bg-orange-energia rounded-full ml-2 flex-shrink-0" 
                aria-label="Não lida"
                title="Não lida"
              ></span>
            )}
          </div>
          <p className="text-sm text-grafite-profundo/90 mt-1">{notification.message}</p>
          <p className="text-xs text-cinza-neutro mt-2">{formatDate(notification.timestamp)}</p>
        </div>
      </div>
    </Card>
  );
};

export default NotificationHistoryItem;
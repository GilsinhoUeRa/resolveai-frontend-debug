// components/ActivityCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityItem } from '@/types';
import Card from '@/components/Card';
import MessageSquareIcon from '@/components/icons/MessageSquareIcon';
import ListChecksIcon from '@/components/icons/ListChecksIcon';
import { COLORS } from '@/constants';

interface ActivityCardProps {
  activity: ActivityItem;
}

// Função auxiliar para formatar o timestamp de forma amigável
const formatActivityTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSeconds < 60) return `agora`;
  if (diffMinutes < 60) return `${diffMinutes} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return `Ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(activity.linkTo);
  };

  // Define o ícone com base no tipo de atividade
  const renderIcon = () => {
    const iconProps = {
      size: 20,
      className: "text-orange-energia flex-shrink-0",
      isActive: true, // Para manter a cor laranja
    };
    if (activity.iconType === 'chat') {
      return <MessageSquareIcon {...iconProps} />;
    }
    if (activity.iconType === 'review') {
      return <ListChecksIcon {...iconProps} />;
    }
    return null; 
  };

  const placeholderPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.relatedEntityName || 'A')}&background=9e9e9e&color=fff&size=40`;

  return (
    <Card 
      className="mb-3 hover:shadow-orange-energia/20 transition-shadow duration-200" 
      onClick={handleCardClick}
    >
      <div className="flex items-start space-x-3">
        {/* Coluna do Ícone e Foto */}
        <div className="flex flex-col items-center space-y-2 flex-shrink-0">
          {renderIcon()}
          {activity.relatedEntityPhotoUrl || activity.relatedEntityName ? (
            <img
              src={activity.relatedEntityPhotoUrl || placeholderPhoto}
              alt={activity.relatedEntityName || 'Entidade relacionada'}
              className="w-8 h-8 rounded-full object-cover border border-cinza-neutro/30"
              onError={(e) => { e.currentTarget.src = placeholderPhoto; }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-cinza-neutro/20 flex items-center justify-center">
              {/* Fallback se não houver foto nem nome */}
            </div>
          )}
        </div>

        {/* Conteúdo Principal da Atividade */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold text-grafite-profundo truncate pr-2" title={activity.title}>
              {activity.title}
            </h4>
            <span className="text-xs text-cinza-neutro flex-shrink-0 whitespace-nowrap">
              {formatActivityTimestamp(activity.timestamp)}
            </span>
          </div>
          {activity.description && (
            <p className="text-xs text-cinza-neutro mt-0.5 truncate" title={activity.description}>
              {activity.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
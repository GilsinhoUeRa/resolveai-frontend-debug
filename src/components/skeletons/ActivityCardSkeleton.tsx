// components/skeletons/ActivityCardSkeleton.tsx
import React from 'react';
import Card from '../Card';

const ActivityCardSkeleton: React.FC = () => {
  return (
    <Card className="mb-3 animate-pulse">
      <div className="flex items-start space-x-3">
        {/* Coluna do Ícone e Foto */}
        <div className="flex flex-col items-center space-y-2 flex-shrink-0">
          <div className="w-5 h-5 bg-cinza-neutro/30 rounded"></div> {/* Ícone */}
          <div className="w-8 h-8 bg-cinza-neutro/30 rounded-full"></div> {/* Foto */}
        </div>

        {/* Conteúdo Principal da Atividade */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <div className="h-4 bg-cinza-neutro/30 rounded w-3/5 mb-1.5"></div> {/* Título */}
            <div className="h-3 bg-cinza-neutro/30 rounded w-1/5"></div> {/* Timestamp */}
          </div>
          <div className="h-3 bg-cinza-neutro/30 rounded w-4/5"></div> {/* Descrição */}
        </div>
      </div>
    </Card>
  );
};

export default ActivityCardSkeleton;
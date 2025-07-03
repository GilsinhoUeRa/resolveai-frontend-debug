import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/Card';
import { ProfessionCategory } from '@/types';
import { APP_ROUTES } from '@/constants';

interface ProfessionCardProps {
  profession: ProfessionCategory;
}

const ProfessionCard: React.FC<ProfessionCardProps> = ({ profession }) => {
  // Placeholder image if imageUrl is not available
  const defaultImageUrl = "https://placehold.co/300x200";

  return (
    <Link to={`${APP_ROUTES.PROVIDERS}?profession=${profession.id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col">
        <img
          src={profession.imageUrl || defaultImageUrl}
          alt={profession.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-semibold text-grafite-profundo mb-2">{profession.name}</h3>
          {profession.description && (
            <p className="text-sm text-cinza-neutro flex-grow">{profession.description}</p>
          )}
          <p className="text-sm text-orange-energia font-medium mt-3 self-start group-hover:underline">
            Ver prestadores
          </p>
        </div>
      </Card>
    </Link>
  );
};

export default ProfessionCard;

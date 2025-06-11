import React from 'react';
import Card from '../Card'; 

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string; 
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>; 
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  iconBgColor = 'bg-orange-energia', 
  className = '',
  onClick
}) => {
  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-lg ${onClick ? 'cursor-pointer hover:border-orange-energia/50 !ring-1 !ring-orange-energia/30' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${iconBgColor} text-white shadow-md`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-cinza-neutro uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-grafite-profundo">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
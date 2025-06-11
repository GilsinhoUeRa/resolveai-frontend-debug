import React from 'react';
import { COLORS } from '@/constants';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  isActive?: boolean;
  size?: number | string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

const HeartIcon: React.FC<IconProps> = ({ 
  isActive = false, 
  size = 24, 
  className = '', 
  onClick, 
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isActive ? COLORS.ORANGE_ENERGIA : 'none'}
      stroke={isActive ? COLORS.ORANGE_ENERGIA : COLORS.CINZA_NEUTRO}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-all duration-200 ease-in-out transform ${isActive ? 'scale-110' : 'scale-100'} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
};

export default HeartIcon;
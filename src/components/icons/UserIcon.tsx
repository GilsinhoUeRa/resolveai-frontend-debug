import React from 'react';
import { COLORS } from '@/constants';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  isActive?: boolean;
  size?: number | string;
}

const UserIcon: React.FC<IconProps> = ({ isActive, size = 24, className = '', ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={isActive ? COLORS.ORANGE_ENERGIA : COLORS.CINZA_NEUTRO}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-colors duration-200 ${className}`}
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
};

export default UserIcon;
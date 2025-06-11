import React from 'react';
import { COLORS } from '@/constants';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  isActive?: boolean; // Can be used if the dropdown is open, for example
  size?: number | string;
  hasNotifications?: boolean; // To slightly change appearance if there are unread notifications
}

const BellIcon: React.FC<IconProps> = ({ 
  isActive, 
  size = 24, 
  className = '', 
  hasNotifications, 
  ...props 
}) => {
  const strokeColor = isActive || hasNotifications ? COLORS.ORANGE_ENERGIA : COLORS.CINZA_NEUTRO;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-colors duration-200 ${className}`}
      {...props}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      {hasNotifications && !isActive && ( // Small dot for unread, if not active (dropdown open)
         <circle cx="18.5" cy="5.5" r="2.5" fill={COLORS.ORANGE_ENERGIA} stroke={COLORS.WHITE} strokeWidth="1"/>
      )}
    </svg>
  );
};

export default BellIcon;
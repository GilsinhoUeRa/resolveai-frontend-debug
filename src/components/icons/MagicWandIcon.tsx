
import React from 'react';
import { COLORS } from '@/constants';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

const MagicWandIcon: React.FC<IconProps> = ({ 
  size = 20, 
  className = '', 
  color = 'currentColor', 
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-colors duration-200 ${className}`}
      {...props}
    >
      <path d="M15 4V2" />
      <path d="M15 10V8" />
      <path d="M11.5 6.5L10 5" />
      <path d="M11.5 14.5L10 13" />
      <path d="M6.5 11.5L5 10" />
      <path d="M14.5 11.5L13 10" />
      <path d="M19.5 15.5L21 17" />
      <path d="M4.5 15.5L3 17" />
      <path d="M12 12L3 21" />
      <path d="M9 4v2" />
      <path d="M4.5 6.5L3 5" />
      <path d="M19.5 6.5L21 5" />
    </svg>
  );
};

export default MagicWandIcon;

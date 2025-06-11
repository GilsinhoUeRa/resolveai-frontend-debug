
import React from 'react';
import { COLORS } from '@/constants';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  isActive?: boolean;
  size?: number | string;
}

const LayoutGridIcon: React.FC<IconProps> = ({ isActive, size = 24, className = '', ...props }) => {
  const strokeColor = isActive ? COLORS.ORANGE_ENERGIA : 'currentColor'; 
  // Em AdminSidebarLink, a cor é gerenciada pelo text-white (ativo) ou text-grafite-profundo (inativo)
  // Portanto, 'currentColor' aqui herdará essas cores corretamente.
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
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
};

export default LayoutGridIcon;

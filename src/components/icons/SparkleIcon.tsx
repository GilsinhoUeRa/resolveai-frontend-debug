import React from 'react';
import { COLORS } from '@/constants';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

const SparkleIcon: React.FC<IconProps> = ({ size = 16, className = '', color = COLORS.ORANGE_ENERGIA, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2L9.88 7.13L4 8l4.94 4.25L7.76 18L12 15.27L16.24 18l-1.18-5.75L20 8l-5.88-.87L12 2zM20 16l-1.76 1.04L19 19l-2-1.24L15 19l.76-1.96L14 16l2 .3L16.5 14l.5 2L19.5 14l.5 2.3L20 16zM8 16l-1.76 1.04L7 19l-2-1.24L3 19l.76-1.96L2 16l2 .3L4.5 14l.5 2L7.5 14l.5 2.3L8 16z"/>
    </svg>
  );
};

export default SparkleIcon;
import React from 'react';
import { COLORS } from '@/constants';

interface StarRatingProps {
  rating: number; // Current rating (0-5)
  onRate?: (rating: number) => void; // Callback for when a star is clicked
  size?: number; // Size of the stars in pixels
  className?: string;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRate,
  size = 24,
  className = '',
  readOnly = false,
}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Simple half star logic, can be more complex
  const emptyStars = 5 - fullStars - halfStar;

  const StarIcon: React.FC<{ filled?: boolean; half?: boolean; onClick?: () => void }> = ({
    filled = false,
    half = false,
    onClick,
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled || half ? COLORS.ORANGE_ENERGIA : COLORS.CINZA_NEUTRO}
      stroke={COLORS.ORANGE_ENERGIA}
      strokeWidth="1"
      className={`inline-block ${onClick && !readOnly ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {half ? (
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2V17.27z" />
      ) : (
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      )}
      {!filled && !half && <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.4-.38L12 6.1l1.68 4.03 4.4.38-3.32 2.88 1 4.28L12 15.4z" fill={COLORS.CINZA_NEUTRO} stroke="none"/>}
    </svg>
  );

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={starValue}
            filled={starValue <= rating}
            // half={starValue - 0.5 === rating} // For more precise half stars
            onClick={onRate && !readOnly ? () => onRate(starValue) : undefined}
          />
        );
      })}
    </div>
  );
};

export default StarRating;

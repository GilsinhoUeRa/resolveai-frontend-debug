import React from 'react';
import Card from '@/components/Card';
import StarRating from '@/components/StarRating';
import { Review } from '@/types';
import { COLORS } from '@/constants';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const placeholderAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.clientName)}&background=9e9e9e&color=fff&size=48`;


  return (
    <Card className="mb-4 border border-cinza-neutro/30">
      <div className="flex items-start space-x-4">
        <img 
          src={placeholderAvatar} // Replace with actual client photo if available
          alt={review.clientName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
            <h4 className="text-md font-semibold text-grafite-profundo">{review.clientName}</h4>
            <span className="text-xs text-cinza-neutro">{formatDate(review.date)}</span>
          </div>
          <StarRating rating={review.rating} readOnly size={18} />
          <p className="text-sm text-grafite-profundo mt-2">{review.comment}</p>
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;

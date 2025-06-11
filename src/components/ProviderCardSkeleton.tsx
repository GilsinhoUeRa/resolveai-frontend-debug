
import React from 'react';
import Card from '@/components/Card';

const ProviderCardSkeleton: React.FC = () => {
  return (
    <Card className="animate-pulse w-full">
      <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-cinza-neutro/30"></div>
        </div>
        <div className="flex-grow w-full">
          <div className="h-7 bg-cinza-neutro/30 rounded w-3/4 md:w-1/2 mb-2"></div>
          <div className="h-5 bg-cinza-neutro/30 rounded w-1/2 md:w-1/3 mb-3"></div>
          <div className="h-4 bg-cinza-neutro/30 rounded w-1/3 md:w-1/4 mb-4"></div>
          
          <div className="flex flex-wrap gap-1 mt-1 mb-3">
            <div className="h-4 bg-cinza-neutro/20 rounded-full w-20"></div>
            <div className="h-4 bg-cinza-neutro/20 rounded-full w-24"></div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <div className="h-5 w-28 bg-cinza-neutro/30 rounded"></div>
            <div className="h-4 w-20 bg-cinza-neutro/30 rounded"></div>
          </div>
          
          <div className="h-4 bg-cinza-neutro/30 rounded w-full mb-1"></div>
          <div className="h-4 bg-cinza-neutro/30 rounded w-5/6"></div>
        </div>
      </div>
       <div className="mt-4 pt-4 border-t border-cinza-neutro/20 flex justify-end">
          <div className="h-9 bg-cinza-neutro/30 rounded-lg w-36"></div>
        </div>
    </Card>
  );
};

export default ProviderCardSkeleton;

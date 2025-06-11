import React from 'react';

const ProfilePageSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-2 py-8 animate-pulse">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 p-6 md:p-8 flex flex-col items-center md:items-start">
            <div className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-cinza-neutro/30 mb-4"></div>
            <div className="h-8 w-3/4 bg-cinza-neutro/30 rounded mb-2"></div>
            <div className="h-6 w-1/2 bg-cinza-neutro/30 rounded mb-2"></div>
            <div className="h-5 w-1/3 bg-cinza-neutro/30 rounded mb-4"></div>
            <div className="h-6 w-3/5 bg-cinza-neutro/30 rounded mb-6"></div>
            <div className="h-12 w-full md:w-60 bg-cinza-neutro/30 rounded-lg"></div>
          </div>

          <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-cinza-neutro/10 flex-grow">
            <div className="h-7 w-1/3 bg-cinza-neutro/30 rounded mb-3"></div>
            <div className="h-4 w-full bg-cinza-neutro/30 rounded mb-2"></div>
            <div className="h-4 w-full bg-cinza-neutro/30 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-cinza-neutro/30 rounded mb-6"></div>

            <div className="h-7 w-1/4 bg-cinza-neutro/30 rounded mb-3"></div>
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-6 w-24 bg-cinza-neutro/20 rounded-full"></div>
              <div className="h-6 w-20 bg-cinza-neutro/20 rounded-full"></div>
              <div className="h-6 w-28 bg-cinza-neutro/20 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="h-6 w-1/2 bg-cinza-neutro/30 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-cinza-neutro/30 rounded"></div>
              </div>
              <div>
                <div className="h-6 w-1/2 bg-cinza-neutro/30 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-cinza-neutro/30 rounded mb-1"></div>
                <div className="h-4 w-2/3 bg-cinza-neutro/30 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <section className="p-6 md:p-8 border-t border-cinza-neutro/10">
          <div className="h-8 w-1/2 bg-cinza-neutro/30 rounded mb-6"></div>
          {/* Skeleton for review form or list */}
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-cinza-neutro/10 p-4 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-cinza-neutro/30"></div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <div className="h-5 w-1/3 bg-cinza-neutro/30 rounded"></div>
                      <div className="h-3 w-1/4 bg-cinza-neutro/30 rounded"></div>
                    </div>
                    <div className="h-5 w-1/2 bg-cinza-neutro/30 rounded mb-2"></div>
                    <div className="h-4 w-full bg-cinza-neutro/30 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
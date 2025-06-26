import React from 'react';

export default function PromotionsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="w-40 h-8 bg-gray-200 rounded mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="w-full h-48 bg-gray-200 relative">
              <div className="absolute top-4 right-4 w-16 h-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="p-4 space-y-3">
              <div className="w-32 h-5 bg-gray-200 rounded"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="w-full h-3 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
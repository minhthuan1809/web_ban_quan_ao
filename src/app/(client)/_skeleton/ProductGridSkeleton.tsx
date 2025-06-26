import React from 'react';

export default function ProductGridSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Header with Search and Sort */}
      <div className="bg-background/60 backdrop-blur-md border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="w-full h-10 bg-gray-200 rounded-md"></div>
            </div>
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-4 bg-gray-200 rounded hidden sm:block"></div>
              <div className="w-[140px] sm:w-[180px] h-10 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <div className="w-48 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
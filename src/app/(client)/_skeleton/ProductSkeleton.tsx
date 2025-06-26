import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
      
      {/* Product Info */}
      <div className="space-y-2">
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
        <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
} 
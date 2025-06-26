import React from 'react';

export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="w-3/4 h-8 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="w-32 h-8 bg-gray-200 rounded"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <div className="w-20 h-5 bg-gray-200 rounded"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-16 h-10 bg-gray-200 rounded border"></div>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <div className="w-20 h-5 bg-gray-200 rounded"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded-full border"></div>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <div className="w-20 h-5 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-10 bg-gray-200 rounded border"></div>
              <div className="w-32 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="w-full h-12 bg-gray-200 rounded-lg"></div>

          {/* Description */}
          <div className="space-y-3">
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';

export default function OrderHistorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="w-40 h-8 bg-gray-200 rounded mb-6"></div>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-24 h-10 bg-gray-200 rounded"></div>
        ))}
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-2">
                <div className="w-32 h-5 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="flex gap-4 p-3 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="space-y-1">
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-32 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
import React from 'react';

export default function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="w-32 h-6 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
            
            <div className="mt-8 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-32 h-8 bg-gray-200 rounded mb-6"></div>
            
            <div className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <div className="w-40 h-6 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-full h-10 bg-gray-200 rounded border"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-full h-10 bg-gray-200 rounded border"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-full h-10 bg-gray-200 rounded border"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-full h-10 bg-gray-200 rounded border"></div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="w-32 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
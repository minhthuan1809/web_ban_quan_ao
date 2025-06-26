import React from 'react';

export default function ContactSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="w-40 h-8 bg-gray-200 rounded"></div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-48 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-48 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-48 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-full h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="w-32 h-8 bg-gray-200 rounded mb-6"></div>
          
          <div className="space-y-4">
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
              <div className="w-full h-24 bg-gray-200 rounded border"></div>
            </div>
            
            <div className="w-32 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 
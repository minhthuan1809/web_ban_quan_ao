import React from 'react';

export default function OrderLoader() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-blue-600"></div>
        <p className="text-gray-500">Đang tải...</p>
      </div>
    </div>
  );
} 
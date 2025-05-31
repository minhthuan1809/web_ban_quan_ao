import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      <p className="mt-6 text-lg font-medium text-gray-700">Đang tải ...</p>
    </div>
  </div>
  )
}
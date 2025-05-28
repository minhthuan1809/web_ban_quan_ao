"use client";
import React from 'react';
import Link from 'next/link';

export default function No_found() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-4xl font-semibold text-gray-800 mt-4">Trang không tồn tại</h2>
        <p className="text-gray-600 mt-4 mb-8">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
        >
          Trở về trang chủ
        </Link>
      </div>
    </div>
  )
}

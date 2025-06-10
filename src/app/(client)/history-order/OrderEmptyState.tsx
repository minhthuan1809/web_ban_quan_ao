import Link from 'next/link';
import React from 'react';

export default function OrderEmptyState() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
      <p className="text-gray-500 mb-6">Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi!</p>
      <Link href="/shop" className="inline-flex items-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 font-medium">
        Bắt đầu mua sắm
      </Link>
    </div>
  );
} 
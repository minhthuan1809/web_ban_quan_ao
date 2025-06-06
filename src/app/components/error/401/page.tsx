import React from 'react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-500">401</h1>
        <h2 className="text-4xl font-semibold text-gray-800 mt-8">Không có quyền truy cập</h2>
        <p className="text-gray-600 mt-4 text-lg">
          Xin lỗi, bạn không có quyền truy cập vào trang này.
        </p>
        <Link 
          href="/"
          className="inline-block mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Trở về trang chủ
        </Link>
      </div>
    </div>
  )
}

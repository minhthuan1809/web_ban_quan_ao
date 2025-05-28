import React from "react";
import Link from "next/link";

export default function Error() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </h1>
          <h2 className="text-4xl font-semibold text-gray-800 mt-6">
            Trang không tồn tại
          </h2>
          <p className="text-gray-600 mt-4 mb-8 max-w-lg mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc bạn không đủ
            quyền truy cập.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Trở về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

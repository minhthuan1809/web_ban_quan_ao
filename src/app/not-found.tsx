"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomNotFoundPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <div className="w-16 h-1 mx-auto my-6 bg-blue-500 rounded-full"></div>
        
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Không tìm thấy trang
        </h2>
        
        <p className="mb-8 text-gray-600">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Tự động chuyển hướng về trang chủ sau {countdown} giây
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Về trang chủ
            </Link>
            
            <button 
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Quay lại trang trước
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

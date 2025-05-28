"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authVerifyEmail_API } from '@/app/_service/authClient';
import { toast } from 'react-toastify';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenFromParams = params.get("token");
    setToken(tokenFromParams);
  }, [params]);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Không tìm thấy token xác thực");
        setLoading(false);
        return;
      }

      try {
        const response = await authVerifyEmail_API(token);
        if (response.status === 200) {
          setSuccess(true);
          toast.success("Xác thực email thành công!");
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      } catch (err) {
        setError("Xác thực email thất bại. Token không hợp lệ hoặc đã hết hạn.");
        toast.error("Xác thực email thất bại!");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang xác thực email</h2>
              <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
            </>
          ) : success ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác thực thành công!</h2>
              <p className="text-gray-600">Bạn sẽ được chuyển hướng đến trang đăng nhập...</p>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác thực thất bại</h2>
              <p className="text-gray-600">{error}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang tải...</h2>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

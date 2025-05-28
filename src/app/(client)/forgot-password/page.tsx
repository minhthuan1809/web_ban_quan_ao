"use client";
import Link from "next/link";
import React, { useState } from "react";
import InputGmail from "@/app/components/ui/InputGmail";
import { authForgotPassword_API } from "@/app/_service/authClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loading from "@/app/_util/Loading";

export default function PageForgotPassword() {
  const [gmail, setGmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authForgotPassword_API(gmail);
      if (response.status === 200) {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          router.push("/");
        }, 2000);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Email đã được gửi!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Vui lòng kiểm tra email của bạn để đặt lại mật khẩu
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Illustration */}
        <div className="hidden md:flex items-center justify-center bg-blue-100 p-8">
          <div
            className="w-full h-full bg-cover bg-center rounded-2xl"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1507679799987-c6e8cd9c85f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Right side - Forgot Password form */}
        <div className="flex flex-col justify-center px-8 py-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-4xl font-bold text-gray-800 mb-6 tracking-tight">
              Quên Mật Khẩu
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Vui lòng nhập email của bạn để đặt lại mật khẩu
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* gmail */}
            <InputGmail
              placeholder="xxx@gmail.com"
              label="Email"
              value={gmail}
              onChange={(value) => setGmail(value)}
            />

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </div>
                ) : (
                  "Gửi Yêu Cầu"
                )}
              </button>
            </div>

            <div className="text-sm text-center mt-6">
              <p className="text-gray-600">
                Quay lại trang{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-500"
                >
                  Đăng Nhập
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

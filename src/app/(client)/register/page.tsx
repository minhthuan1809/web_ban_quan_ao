"use client";
import Link from "next/link";
import React, { useState } from "react";
import { User, Mail, Lock, Phone } from "lucide-react";
import InputPassword from "@/app/components/ui/InputPassword";
import InputGmail from "@/app/components/ui/InputGmail";
import InputInformation from "@/app/components/ui/InputInformation";

export default function PageRegister() {
  const [showConfirmPassword, setShowConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [gmail, setGmail] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Illustration */}
        <div className="hidden md:flex items-center justify-center bg-blue-100 p-8">
          <div
            className="w-full h-full bg-cover bg-center rounded-2xl"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Right side - Register form */}
        <div className="flex flex-col justify-center px-8 py-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-4xl font-bold text-gray-800 mb-6 tracking-tight">
              Đăng Ký
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Tạo tài khoản mới của bạn
            </p>
          </div>

          <form className="space-y-6">
            <InputInformation
              placeholder="Nguyễn Văn A"
              label="Tên người dùng"
              icon="User"
              value={username}
              onChange={(value) => setUsername(value)}
            />
            {/* gmail */}
            <InputGmail
              placeholder="xxx@gmail.com"
              label="Nhập Gmail"
              value={gmail}
              onChange={(value) => setGmail(value)}
            />
            {/* Mật khẩu */}
            <InputPassword
              placeholder="Nhập mật khẩu"
              label="Mật khẩu"
              value={password}
              onChange={(value) => setPassword(value)}
            />
            <InputPassword
              placeholder="Nhập lại mật khẩu"
              label="Nhập lại Mật khẩu"
              value={showConfirmPassword}
              onChange={(value) => setShowConfirmPassword(value)}
            />
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900"
              >
                Tôi đồng ý với{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Điều khoản dịch vụ
                </Link>
              </label>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
              >
                Đăng Ký
              </button>
            </div>
            <div className="text-sm text-center mt-4">
              <p className="text-gray-600">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-500"
                >
                  Đăng Nhập Ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

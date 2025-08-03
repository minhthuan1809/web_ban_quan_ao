"use client";
import Link from "next/link";
import React, { useState } from "react";
import InputGmail from "@/app/components/ui/InputGmail";
import InputPassword from "@/app/components/ui/InputPassword";
import { authLogin_API } from "@/app/_service/authClient";
import { toast } from "react-toastify";
import Loading from "@/app/_util/Loading";
import { Checkbox } from "@nextui-org/react";
import useAuthInfor from "@/app/customHooks/AuthInfor";

export default function PageLogin() {
  const [password, setPassword] = useState("");
  const [gmail, setGmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Auth hook để cập nhật state sau khi login
  const { setAccessToken, setUser, syncFromLocalStorage } = useAuthInfor();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authLogin_API({
        email: gmail,
        password: password,
      });

      console.log("response", response);
      
      if (!response.accessToken || !response.userInfo) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }
      setAccessToken(response.accessToken);
      setUser(response.userInfo);
      toast.success("Đăng nhập thành công");
      setTimeout(() => {
        window.location.reload(); // Reload để đồng bộ toàn bộ state
      }, 200);
    } catch (error) {
      toast.error("Đăng nhập thất bại");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-card rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Illustration */}
        <div className="hidden md:flex items-center justify-center bg-muted p-8">
          <div
            className="w-full h-full bg-cover bg-center rounded-2xl"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1507679799987-c6e8cd9c85f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Right side - Login form */}
        <div className="flex flex-col justify-center px-8 py-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-4xl font-bold text-card-foreground mb-6 tracking-tight">
              Đăng Nhập
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Chào mừng bạn quay trở lại
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <InputGmail
                label="Email"
                placeholder="Nhập email của bạn"
                value={gmail}
                onChange={setGmail}
              />

              <InputPassword
                label="Mật khẩu"
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={setPassword}
              />
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                isSelected={rememberMe}
                onValueChange={setRememberMe}
                color="primary"
                size="sm">
                <span className="text-sm text-muted-foreground">
                  Ghi nhớ đăng nhập
                </span>
              </Checkbox>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-semibold text-primary hover:text-primary/80">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </div>
                ) : (
                  "Đăng Nhập"
                )}
              </button>
            </div>

            <div className="text-sm text-center">
              <p className="text-muted-foreground">
                Bạn chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-primary hover:text-primary/80">
                  Đăng Ký Ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

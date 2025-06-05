"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import InputPassword from "@/app/components/ui/InputPassword";
import InputGmail from "@/app/components/ui/InputGmail";
import InputInformation from "@/app/components/ui/InputInformation";
import InputPhone from "@/app/components/ui/InputPhone";
import InputGender from "@/app/components/ui/InputGender";
import InputAddress from "@/app/components/ui/InputAddress";
import { authRegister_API } from "@/app/_service/authClient";
import { toast } from "react-toastify";
import Loading from "@/app/_util/Loading";
import { useRouter } from "next/navigation";

export default function PageRegister() {
  const [showConfirmPassword, setShowConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [gmail, setGmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const [IsCheck, setIsCheck] = useState(false);

  useEffect(() => {
    if (password.length > 0 && password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
    } else if (showConfirmPassword && password !== showConfirmPassword) {
      setPasswordError("Mật khẩu không khớp");
    } else {
      setPasswordError("");
    }
  }, [password, showConfirmPassword]);

  const IsSubmit =
    !IsCheck ||
    !gender ||
    !address ||
    !password ||
    !showConfirmPassword ||
    !gmail ||
    !phone ||
    !username ||
    passwordError !== "";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (IsSubmit) return;
    setLoading(true);
    try {
      const res = await authRegister_API({
        fullName: username,
        email: gmail,
        password: password,
        phone: phone,
        address: address?.city?.cityName,
        district: address?.district?.districtName,
        ward: address?.ward?.wardName,
        gender: gender.toUpperCase(),
      });
      
      if (res.status === 200) {
        toast.success(res.data);
        router.push("/login");
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("Email đã được đăng ký");
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full   bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Illustration */}
        <div className="hidden md:flex items-center justify-center bg-blue-100 p-4">
          <div
            className="w-[300px] h-[300px] bg-cover bg-center rounded-2xl"
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
            <p className="text-center text-gray-500 mb-2">
              Tạo tài khoản mới của bạn
            </p>
          </div>

          <form className="space-y-6" onSubmit={submit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            {/* phone */}
            <InputPhone
              placeholder="Nhập số điện thoại"
              label="Số điện thoại"
              value={phone}
              onChange={(value) => setPhone(value)}
            />
            {/* address */}
            <InputAddress
              onChange={(value) => setAddress(value)}
              className="w-full"
            />
            <div className="flex flex-col gap-4">
              {/* Mật khẩu */}
              <div className="flex gap-4">
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
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
            {/* gender*/}
            <InputGender
              placeholder="Chọn giới tính"
              label="Giới tính"
              value={gender}
              onChange={(value) => setGender(value)}
            />

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                onChange={(e) => setIsCheck(e.target.checked)}
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900">
                Tôi đồng ý với
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-500">
                  Điều khoản dịch vụ
                </Link>
              </label>
            </div>
            <div>
              <button
                type="submit"
                disabled={IsSubmit || loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                  IsSubmit || loading ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  "Đăng Ký"
                )}
              </button>
            </div>
            <div className="text-sm text-center mt-4">
              <p className="text-gray-600">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-500">
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

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
import { Button, Checkbox } from "@nextui-org/react";
import { UserPlus } from "lucide-react";

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
    <div className="min-h-screen w-full bg-background/40 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-background rounded-2xl shadow-large overflow-hidden">
        {/* Left side - Illustration */}
        <div className="hidden md:flex items-center justify-center bg-primary/5 p-4">
          <div
            className="w-[300px] h-[300px] bg-cover bg-center rounded-2xl shadow-medium"
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
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-foreground tracking-tight">
                Đăng Ký
              </h2>
            </div>
            <p className="text-center text-default-500 mb-6">
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
              <InputGmail
                placeholder="xxx@gmail.com"
                label="Nhập Gmail"
                value={gmail}
                onChange={(value) => setGmail(value)}
              />
            </div>
            <InputPhone
              placeholder="Nhập số điện thoại"
              label="Số điện thoại"
              value={phone}
              onChange={(value) => setPhone(value)}
            />
            <InputAddress
              onChange={(value) => setAddress(value)}
              className="w-full"
            />
            <div className="flex flex-col gap-4">
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
                <p className="text-danger text-sm">{passwordError}</p>
              )}
            </div>
            <InputGender
              placeholder="Chọn giới tính"
              label="Giới tính"
              value={gender}
              onChange={(value) => setGender(value)}
            />

            <div className="flex items-center gap-2">
              <Checkbox
                size="sm"
                onChange={(e) => setIsCheck(e.target.checked)}
              >
                <span className="text-default-700">
                  Tôi đồng ý với{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary-500 font-medium"
                  >
                    Điều khoản dịch vụ
                  </Link>
                </span>
              </Checkbox>
            </div>

            <Button
              type="submit"
              disabled={IsSubmit || loading}
              isLoading={loading}
              color="primary"
              className="w-full font-medium"
              size="lg"
            >
              {loading ? "Đang xử lý..." : "Đăng Ký"}
            </Button>

            <div className="text-sm text-center">
              <p className="text-default-500">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:text-primary-500"
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

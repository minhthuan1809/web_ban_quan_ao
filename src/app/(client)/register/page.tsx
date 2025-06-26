"use client";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
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

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  gender: string;
  address: {
    city: { cityName: string };
    district: { districtName: string };
    ward: { wardName: string };
  } | null;
  agreeToTerms: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  gender: "",
  address: null,
  agreeToTerms: false,
};

const VALIDATION_RULES = {
  fullName: { required: true, minLength: 2, message: "Tên phải có ít nhất 2 ký tự" },
  email: { required: true, pattern: /\S+@\S+\.\S+/, message: "Email không hợp lệ" },
  password: { required: true, minLength: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
  phone: { required: true, pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" },
  gender: { required: true, message: "Vui lòng chọn giới tính" },
  address: { required: true, message: "Vui lòng chọn địa chỉ" },
  agreeToTerms: { required: true, message: "Vui lòng đồng ý với điều khoản dịch vụ" },
};

export default function PageRegister() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // Validation functions
  const validateField = useCallback((field: keyof FormData, value: any) => {
    const rule = VALIDATION_RULES[field as keyof typeof VALIDATION_RULES];
    if (!rule) return "";

    if (rule.required) {
      if (field === "address" && !value) return rule.message;
      if (field === "agreeToTerms" && !value) return rule.message;
      if (typeof value === "string" && !value.trim()) return rule.message;
    }

    if (field === "email" && value && !VALIDATION_RULES.email.pattern.test(value)) {
      return VALIDATION_RULES.email.message;
    }

    if (field === "phone" && value && !VALIDATION_RULES.phone.pattern.test(value)) {
      return VALIDATION_RULES.phone.message;
    }

    if (field === "password" && value && value.length < VALIDATION_RULES.password.minLength) {
      return VALIDATION_RULES.password.message;
    }

    if (field === "fullName" && value && value.length < VALIDATION_RULES.fullName.minLength) {
      return VALIDATION_RULES.fullName.message;
    }

    return "";
  }, []);

  // Password validation
  const passwordError = useMemo(() => {
    if (!formData.password) return "";
    if (formData.password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      return "Mật khẩu không khớp";
    }
    return "";
  }, [formData.password, formData.confirmPassword]);

  // Form validation
  const isFormValid = useMemo(() => {
    const requiredFields: (keyof FormData)[] = [
      "fullName", "email", "password", "confirmPassword", 
      "phone", "gender", "address", "agreeToTerms"
    ];
    
    const validation = requiredFields.every(field => {
      if (field === "address") return formData.address !== null;
      if (field === "agreeToTerms") return formData.agreeToTerms;
      return formData[field as keyof FormData] && validateField(field, formData[field]) === "";
    }) && passwordError === "";

    // Debug in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Form validation debug:', {
        fullName: !!formData.fullName,
        email: !!formData.email,
        password: !!formData.password,
        confirmPassword: !!formData.confirmPassword,
        phone: !!formData.phone,
        gender: !!formData.gender,
        address: !!formData.address,
        agreeToTerms: formData.agreeToTerms,
        passwordError,
        isValid: validation
      });
    }

    return validation;
  }, [formData, validateField, passwordError]);

  // Form field update handler
  const updateField = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  // Address change handler
  const handleAddressChange = useCallback((addressData: any) => {
    updateField("address", addressData);
  }, [updateField]);

  // Submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address?.city?.cityName || "",
        district: formData.address?.district?.districtName || "",
        ward: formData.address?.ward?.wardName || "",
        gender: formData.gender.toUpperCase(),
        isAdmin: false,
      };

      const res = await authRegister_API(submitData);
      
      if (res.status === 200) {
        toast.success("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
        router.push("/login");
      }
    } catch (err: any) {
      const errorMessage = err.response?.status === 409 
        ? "Email đã được đăng ký" 
        : "Đã có lỗi xảy ra, vui lòng thử lại sau";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [formData, isFormValid, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-8">
          <div className="text-center text-white">
            <div className="w-64 h-64 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <UserPlus className="w-24 h-24 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Chào mừng đến với KICKSTYLE</h3>
            <p className="text-blue-100">
              Tạo tài khoản để khám phá những sản phẩm thời trang tuyệt vời
            </p>
          </div>
        </div>

        {/* Right side - Register form */}
        <div className="flex flex-col justify-center px-8 py-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Đăng Ký
              </h2>
            </div>
            <p className="text-center text-gray-600 mb-8">
              Tạo tài khoản mới của bạn
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Tiến độ hoàn thành</span>
                <span>{Math.round((
                  (formData.fullName ? 1 : 0) +
                  (formData.email ? 1 : 0) +
                  (formData.password ? 1 : 0) +
                  (formData.confirmPassword ? 1 : 0) +
                  (formData.phone ? 1 : 0) +
                  (formData.gender ? 1 : 0) +
                  (formData.address ? 1 : 0) +
                  (formData.agreeToTerms ? 1 : 0)
                ) / 8 * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((
                      (formData.fullName ? 1 : 0) +
                      (formData.email ? 1 : 0) +
                      (formData.password ? 1 : 0) +
                      (formData.confirmPassword ? 1 : 0) +
                      (formData.phone ? 1 : 0) +
                      (formData.gender ? 1 : 0) +
                      (formData.address ? 1 : 0) +
                      (formData.agreeToTerms ? 1 : 0)
                    ) / 8 * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputInformation
                placeholder="Nguyễn Văn A"
                label="Tên người dùng"
                icon="User"
                value={formData.fullName}
                onChange={(value) => updateField("fullName", value)}
              />
              <InputGmail
                placeholder="xxx@gmail.com"
                label="Email"
                value={formData.email}
                onChange={(value) => updateField("email", value)}
              />
            </div>

            {/* Phone */}
            <InputPhone
              placeholder="Nhập số điện thoại"
              label="Số điện thoại"
              value={formData.phone}
              onChange={(value) => updateField("phone", value)}
            />

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <InputAddress
                onChange={handleAddressChange}
                className="w-full"
              />
            </div>

            {/* Passwords */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputPassword
                  placeholder="Nhập mật khẩu"
                  label="Mật khẩu"
                  value={formData.password}
                  onChange={(value) => updateField("password", value)}
                />
                <InputPassword
                  placeholder="Nhập lại mật khẩu"
                  label="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(value) => updateField("confirmPassword", value)}
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>

            {/* Gender */}
            <InputGender
              placeholder="Chọn giới tính"
              label="Giới tính"
              value={formData.gender}
              onChange={(value) => updateField("gender", value)}
            />

            {/* Terms checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                size="sm"
                isSelected={formData.agreeToTerms}
                onValueChange={(checked) => updateField("agreeToTerms", checked)}
                className="mt-1"
              >
                <span className="text-sm text-gray-700">
                  Tôi đồng ý với{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-500 font-medium underline"
                  >
                    Điều khoản dịch vụ
                  </Link>
                  {" "}và{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-500 font-medium underline"
                  >
                    Chính sách bảo mật
                  </Link>
                </span>
              </Checkbox>
            </div>

            {/* Form validation status */}
            {!isFormValid && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-orange-800 text-sm font-medium mb-2">Vui lòng hoàn thành:</p>
                <ul className="text-orange-700 text-sm space-y-1">
                  {!formData.fullName && <li>• Tên người dùng</li>}
                  {!formData.email && <li>• Email</li>}
                  {!formData.password && <li>• Mật khẩu</li>}
                  {!formData.confirmPassword && <li>• Xác nhận mật khẩu</li>}
                  {!formData.phone && <li>• Số điện thoại</li>}
                  {!formData.gender && <li>• Giới tính</li>}
                  {!formData.address && <li>• Địa chỉ</li>}
                  {!formData.agreeToTerms && <li>• Đồng ý điều khoản</li>}
                  {passwordError && <li>• {passwordError}</li>}
                </ul>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              isLoading={loading}
              color="primary"
              className={`w-full font-semibold text-white transition-all duration-300 ${
                isFormValid 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              size="lg"
            >
              {loading ? "Đang xử lý..." : "Đăng Ký"}
            </Button>

            {/* Login link */}
            <div className="text-center">
              <p className="text-gray-600">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
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

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
import { Checkbox } from "@nextui-org/react";

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-card rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Illustration */}
        <div className="hidden md:flex items-center justify-center bg-muted p-8">
          <div
            className="w-full h-full bg-cover bg-center rounded-2xl"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Right side - Register form */}
        <div className="flex flex-col justify-center px-8 py-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-4xl font-bold text-card-foreground mb-6 tracking-tight">
              Đăng Ký
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Tạo tài khoản mới của bạn
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name and Email */}
            <div className="space-y-4">
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
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <InputAddress
                onChange={handleAddressChange}
                className="w-full"
              />
            </div>

            {/* Passwords */}
            <div className="space-y-4">
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
                color="primary"
              >
                <span className="text-sm text-muted-foreground">
                  Tôi đồng ý với{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-primary hover:text-primary/80"
                  >
                    Điều khoản dịch vụ
                  </Link>
                  {" "}và{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-primary hover:text-primary/80"
                  >
                    Chính sách bảo mật
                  </Link>
                </span>
              </Checkbox>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="btn-primary w-full py-3"
              >
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
                  "Đăng Ký"
                )}
              </button>
            </div>

            {/* Login link */}
            <div className="text-sm text-center">
              <p className="text-muted-foreground">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:text-primary/80"
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

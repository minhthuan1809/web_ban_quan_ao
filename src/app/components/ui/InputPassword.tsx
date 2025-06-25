"use client";
import { Input } from "@nextui-org/react";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useCallback, useMemo } from "react";

interface InputPasswordProps {
  placeholder: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  showStrengthIndicator?: boolean;
  minLength?: number;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

interface PasswordStrength {
  score: number;
  text: string;
  color: string;
  bgColor: string;
}

const PASSWORD_STRENGTH_RULES = [
  { test: (pwd: string) => pwd.length >= 6, message: "Ít nhất 6 ký tự" },
  { test: (pwd: string) => /[A-Z]/.test(pwd), message: "Có chữ hoa" },
  { test: (pwd: string) => /[a-z]/.test(pwd), message: "Có chữ thường" },
  { test: (pwd: string) => /[0-9]/.test(pwd), message: "Có số" },
  { test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd), message: "Có ký tự đặc biệt" },
];

export default function InputPassword({
  placeholder,
  label,
  value,
  onChange,
  showStrengthIndicator = false,
  minLength = 6,
  autoComplete = "current-password",
  disabled = false,
  className = "",
}: InputPasswordProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  }, [onChange]);

  // Password validation
  const passwordValidation = useMemo(() => {
    if (!value) return { isValid: true, error: "" };
    
    if (value.length < minLength) {
      return {
        isValid: false,
        error: `Mật khẩu phải có ít nhất ${minLength} ký tự`
      };
    }

    return { isValid: true, error: "" };
  }, [value, minLength]);

  // Password strength calculation
  const passwordStrength = useMemo((): PasswordStrength => {
    if (!value) return { score: 0, text: "", color: "", bgColor: "" };

    const passedRules = PASSWORD_STRENGTH_RULES.filter(rule => rule.test(value));
    const score = passedRules.length;

    if (score <= 1) {
      return {
        score: 1,
        text: "Yếu",
        color: "text-red-500",
        bgColor: "bg-red-500"
      };
    }
    if (score <= 2) {
      return {
        score: 2,
        text: "Trung bình",
        color: "text-orange-500",
        bgColor: "bg-orange-500"
      };
    }
    if (score <= 3) {
      return {
        score: 3,
        text: "Tốt",
        color: "text-blue-500",
        bgColor: "bg-blue-500"
      };
    }
    return {
      score: 4,
      text: "Mạnh",
      color: "text-green-500",
      bgColor: "bg-green-500"
    };
  }, [value]);

  const validatedRules = useMemo(() => {
    return PASSWORD_STRENGTH_RULES.map(rule => ({
      ...rule,
      passed: rule.test(value)
    }));
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      <Input
        isRequired
        isDisabled={disabled}
        classNames={{
          inputWrapper: [
            "w-full transition-all duration-200",
            isFocused && !passwordValidation.error ? "ring-2 ring-blue-500/20" : "",
            passwordValidation.error ? "border-red-500" : ""
          ].join(" "),
          input: "text-sm",
          label: "text-sm font-medium",
        }}
        endContent={
          <div className="flex items-center gap-2">
            {value && passwordValidation.isValid && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {value && !passwordValidation.isValid && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <button
              aria-label={isVisible ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
              className="focus:outline-none hover:opacity-80 transition-opacity rounded-md p-1"
              type="button"
              onClick={toggleVisibility}
              tabIndex={-1}
            >
              {isVisible ? (
                <EyeOff className="w-4 h-4 text-default-400" />
              ) : (
                <Eye className="w-4 h-4 text-default-400" />
              )}
            </button>
          </div>
        }
        startContent={
          <Lock className="w-4 h-4 text-default-400 flex-shrink-0" />
        }
        label={label}
        labelPlacement="outside"
        maxLength={100}
        placeholder={placeholder}
        type={isVisible ? "text" : "password"}
        variant="bordered"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isInvalid={!!passwordValidation.error}
        errorMessage={passwordValidation.error}
        autoComplete={autoComplete}
        spellCheck={false}
      />

      {/* Password Strength Indicator */}
      {showStrengthIndicator && value && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Độ mạnh mật khẩu:</span>
            <span className={`text-xs font-medium ${passwordStrength.color}`}>
              {passwordStrength.text}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
              style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
            />
          </div>

          {isFocused && (
            <div className="grid grid-cols-2 gap-1 text-xs">
              {validatedRules.map((rule, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-1 transition-colors duration-200 ${
                    rule.passed ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {rule.passed ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-current" />
                  )}
                  <span>{rule.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

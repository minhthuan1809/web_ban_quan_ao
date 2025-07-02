"use client";
import { Input } from "@nextui-org/react";
import { Phone, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";

interface InputPhoneProps {
  placeholder: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
  onValidationChange?: (isValid: boolean) => void;
}

interface PhoneValidation {
  isValid: boolean;
  error: string;
  formatted?: string;
}

const VIETNAM_PHONE_PATTERNS = [
  { pattern: /^(032|033|034|035|036|037|038|039)/, name: "Viettel" },
  { pattern: /^(070|079|077|076|078)/, name: "Mobifone" },
  { pattern: /^(083|084|085|081|082)/, name: "Vinaphone" },
  { pattern: /^(056|058)/, name: "Vietnamobile" },
  { pattern: /^(059)/, name: "Gmobile" },
  { pattern: /^(09)/, name: "Vietnamobile" },
];

export default function InputPhone({
  placeholder,
  label,
  value,
  onChange,
  countryCode = "+84",
  autoComplete = "tel",
  disabled = false,
  className = "",
  onValidationChange,
}: InputPhoneProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  // Format phone number as user types
  const formatPhoneNumber = useCallback((phone: string): string => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format: 0xxx xxx xxx
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limited formatting
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    
    // Limit to 10 digits
    if (numericValue.length <= 10) {
      onChange(numericValue);
    }
  }, [onChange]);

  // Phone validation
  const phoneValidation = useMemo((): PhoneValidation => {
    if (!value) return { isValid: true, error: "" };

    // Must start with 0
    if (!value.startsWith('0')) {
      return {
        isValid: false,
        error: "Số điện thoại phải bắt đầu bằng số 0"
      };
    }

    // Must be exactly 10 digits
    if (value.length < 10) {
      return {
        isValid: false,
        error: `Cần thêm ${10 - value.length} số nữa`
      };
    }

    if (value.length > 10) {
      return {
        isValid: false,
        error: "Số điện thoại chỉ được 10 số"
      };
    }

    // Check against Vietnam phone patterns
    const isValidPattern = VIETNAM_PHONE_PATTERNS.some(
      provider => provider.pattern.test(value)
    );

    if (!isValidPattern) {
      return {
        isValid: false,
        error: "Đầu số không hợp lệ"
      };
    }

    return {
      isValid: true,
      error: "",
      formatted: formatPhoneNumber(value)
    };
  }, [value, formatPhoneNumber]);

  // Get carrier info
  const carrierInfo = useMemo(() => {
    if (value.length >= 3) {
      const carrier = VIETNAM_PHONE_PATTERNS.find(
        provider => provider.pattern.test(value)
      );
      return carrier?.name || null;
    }
    return null;
  }, [value]);

  // Notify parent about validation changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(phoneValidation.isValid);
    }
  }, [phoneValidation.isValid, onValidationChange]);

  const displayValue = useMemo(() => {
    return isFocused || !phoneValidation.formatted ? value : phoneValidation.formatted;
  }, [isFocused, phoneValidation.formatted, value]);

  const endContent = useMemo(() => {
    if (value) {
      if (phoneValidation.isValid) {
        return (
          <div className="flex items-center gap-2">
            {carrierInfo && (
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                {carrierInfo}
              </span>
            )}
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        );
      }
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  }, [value, phoneValidation.isValid, carrierInfo]);

  return (
    <div className={`w-full ${className}`}>
      <Input
        isRequired
        isDisabled={disabled}
        classNames={{
          inputWrapper: [
            "w-full transition-all duration-200",
            isFocused && !phoneValidation.error ? "ring-2 ring-blue-500/20" : "",
            phoneValidation.error && value ? "border-red-500" : ""
          ].join(" "),
          input: "text-sm font-mono",
          label: "text-sm font-medium",
        }}
        startContent={
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-default-400 flex-shrink-0" />
            <span className="text-sm text-gray-500 select-none">
              {countryCode}
            </span>
          </div>
        }
        endContent={endContent}
        label={label}
        labelPlacement="outside"
        maxLength={10}
        placeholder={placeholder}
        type="tel"
        variant="bordered"
        value={isFocused ? value : displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isInvalid={!!phoneValidation.error && !!value}
        errorMessage={phoneValidation.error && value ? phoneValidation.error : ""}
        autoComplete={autoComplete}
      />

      {/* Helper text */}
      {isFocused && !value && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Ví dụ: 0987654321</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {VIETNAM_PHONE_PATTERNS.slice(0, 3).map((provider, index) => (
              <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {provider.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

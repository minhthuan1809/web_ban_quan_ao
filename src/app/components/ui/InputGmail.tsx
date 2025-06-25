"use client";
import { Input } from "@nextui-org/react";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";

interface InputGmailProps {
  placeholder: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  allowAllDomains?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
  onValidationChange?: (isValid: boolean) => void;
}

interface EmailValidation {
  isValid: boolean;
  error: string;
  suggestion?: string;
}

const COMMON_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InputGmail({
  placeholder,
  label,
  value,
  onChange,
  allowAllDomains = false,
  autoComplete = "email",
  disabled = false,
  className = "",
  onValidationChange,
}: InputGmailProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    
    // Auto-suggest gmail.com if no domain is provided
    if (value && !value.includes("@") && !allowAllDomains) {
      const newValue = `${value}@gmail.com`;
      onChange(newValue);
    }
  }, [value, onChange, allowAllDomains]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toLowerCase().trim();
    onChange(newValue);
  }, [onChange]);

  // Email validation with suggestions
  const emailValidation = useMemo((): EmailValidation => {
    if (!value) return { isValid: true, error: "" };

    // Check basic email format
    if (!EMAIL_REGEX.test(value)) {
      if (!value.includes("@")) {
        return {
          isValid: false,
          error: "Email chưa đầy đủ",
          suggestion: allowAllDomains ? "" : "@gmail.com"
        };
      }
      return {
        isValid: false,
        error: "Định dạng email không hợp lệ"
      };
    }

    // If only gmail is allowed, check domain
    if (!allowAllDomains && !value.endsWith("@gmail.com")) {
      return {
        isValid: false,
        error: "Chỉ chấp nhận email Gmail"
      };
    }

    // Check for common typos
    const domain = value.split("@")[1];
    if (domain) {
      const typoSuggestion = suggestDomainCorrection(domain);
      if (typoSuggestion && typoSuggestion !== domain) {
        return {
          isValid: false,
          error: "Có thể bạn muốn dùng",
          suggestion: `@${typoSuggestion}`
        };
      }
    }

    return { isValid: true, error: "" };
  }, [value, allowAllDomains]);

  // Domain typo correction
  const suggestDomainCorrection = useCallback((domain: string): string | null => {
    const typoMap: Record<string, string> = {
      'gmai.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gmall.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
    };

    return typoMap[domain] || null;
  }, []);

  // Apply suggestion
  const applySuggestion = useCallback(() => {
    if (emailValidation.suggestion) {
      if (value.includes("@")) {
        const username = value.split("@")[0];
        onChange(`${username}${emailValidation.suggestion}`);
      } else {
        onChange(`${value}${emailValidation.suggestion}`);
      }
    }
  }, [value, emailValidation.suggestion, onChange]);

  // Notify parent about validation changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(emailValidation.isValid);
    }
  }, [emailValidation.isValid, onValidationChange]);

  const endContent = useMemo(() => {
    if (isCheckingEmail) {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }

    if (value) {
      if (emailValidation.isValid) {
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      }
      
      if (emailValidation.suggestion) {
        return (
          <button
            type="button"
            onClick={applySuggestion}
            className="text-xs text-blue-500 hover:text-blue-600 font-medium px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            {emailValidation.suggestion}
          </button>
        );
      }
      
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }

    if (!allowAllDomains && isFocused && !value.includes("@")) {
      return (
        <span className="text-xs text-gray-400 select-none">
          @gmail.com
        </span>
      );
    }

    return null;
  }, [isCheckingEmail, value, emailValidation, applySuggestion, allowAllDomains, isFocused]);

  return (
    <div className={`w-full ${className}`}>
      <Input
        isRequired
        isDisabled={disabled}
        classNames={{
          inputWrapper: [
            "w-full transition-all duration-200",
            isFocused && !emailValidation.error ? "ring-2 ring-blue-500/20" : "",
            emailValidation.error && value ? "border-red-500" : ""
          ].join(" "),
          input: "text-sm",
          label: "text-sm font-medium",
        }}
        startContent={
          <Mail className="w-4 h-4 text-default-400 flex-shrink-0" />
        }
        endContent={endContent}
        type="email"
        label={label}
        labelPlacement="outside"
        maxLength={50}
        placeholder={placeholder}
        variant="bordered"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isInvalid={!!emailValidation.error && !!value}
        errorMessage={emailValidation.error && value ? emailValidation.error : ""}
        autoComplete={autoComplete}
        spellCheck={false as any}
      />

      {/* Domain suggestions for focused state */}
      {allowAllDomains && isFocused && value && !value.includes("@") && (
        <div className="mt-2 flex flex-wrap gap-1">
          {COMMON_DOMAINS.map((domain) => (
            <button
              key={domain}
              type="button"
              onClick={() => onChange(`${value}@${domain}`)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded transition-colors"
            >
              @{domain}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

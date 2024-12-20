"use client";
import { Input } from "@nextui-org/react";
import { Mail } from "lucide-react";
import { useState } from "react";
//thuan
export default function InputGmail({
  placeholder,
  label,
  value,
  onChange,
}: {
  placeholder: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleBlur = () => {
    // Nếu không có @, tự động thêm @gmail.com
    if (value && !value.includes("@")) {
      onChange(`${value}@gmail.com`);
    }
    setError(null);
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);

    if (!newValue.includes("@")) {
      setError("Email cần chứa nhập đúng định dạng gmail");
    } else {
      setError(null);
    }
  };

  return (
    <div className="w-full">
      <Input
        isRequired
        classNames={{
          inputWrapper: "w-full mt-[1rem]",
        }}
        validationState={error ? "invalid" : "valid"}
        errorMessage={""}
        startContent={
          <Mail
            size={20}
            className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
          />
        }
        endContent={
          value ? (
            !value.includes("@") ? (
              <p className="text-gray-500 text-sm">@gmail.com</p>
            ) : (
              ""
            )
          ) : (
            ""
          )
        }
        type="email"
        label={label}
        labelPlacement={"outside"}
        maxLength={30}
        placeholder={placeholder}
        variant="bordered"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

"use client";
import { Input } from "@nextui-org/react";
import { Phone } from "lucide-react";
import { useState } from "react";

export default function InputPhone({
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
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    
    // Validate phone number format
    if (numericValue.length > 0) {
      if (!numericValue.startsWith('0')) {
        setIsInvalid(true);
        setErrorMessage("Số điện thoại phải bắt đầu bằng số 0");
        onChange(numericValue);
        return;
      }
      
      if (numericValue.length < 10) {
        setIsInvalid(true);
        setErrorMessage("Số điện thoại phải đủ 10 số");
      } else {
        setIsInvalid(false);
        setErrorMessage("");
      }
    } else {
      setIsInvalid(false);
      setErrorMessage("");
    }

    onChange(numericValue);
  };

  return (
    <Input
      isRequired
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      classNames={{
        inputWrapper: " w-full",
      }}
      startContent={
        <Phone
          size={20}
          className="text-default-400 pointer-events-none flex-shrink-0"
        />
      }
      label={label}
      labelPlacement={"outside"}
      maxLength={10}
      placeholder={placeholder}
      type={"tel"}
      variant="bordered"
      value={value}
      onChange={handleChange}
    />
  );
}

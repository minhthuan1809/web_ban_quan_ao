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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(numericValue);
    
    // Check if length is less than 10 when user has entered something
    setIsInvalid(numericValue.length > 0 && numericValue.length < 10);
  };

  return (
    <Input
      isRequired
      isInvalid={isInvalid}
      errorMessage={isInvalid && "Số điện thoại phải đủ 10 số"}
      classNames={{
        inputWrapper: " w-full mt-[1rem]",
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

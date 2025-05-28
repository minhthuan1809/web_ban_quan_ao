"use client";
import { Input } from "@nextui-org/react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

export default function InputPassword({
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
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      isRequired
      classNames={{
        inputWrapper: " w-full",
      }}
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <Eye size={20} className="text-default-400 pointer-events-none" />
          ) : (
            <EyeOff
              size={20}
              className=" text-default-400 pointer-events-none"
            />
          )}
        </button>
      }
      startContent={
        <Lock
          size={20}
          className=" text-default-400 pointer-events-none flex-shrink-0"
        />
      }
      label={label}
      labelPlacement={"outside"}
      maxLength={30}
      placeholder={placeholder}
      type={isVisible ? "text" : "password"}
      variant="bordered"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

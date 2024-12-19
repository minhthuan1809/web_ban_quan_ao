"use client";
import { Input } from "@nextui-org/react";
import { Mail } from "lucide-react";

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
  return (
    <Input
      isRequired
      classNames={{
        inputWrapper: " w-full mt-[1rem]",
      }}
      startContent={
        <Mail
          size={20}
          className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
        />
      }
      label={label}
      labelPlacement={"outside"}
      maxLength={30}
      placeholder={placeholder}
      variant="bordered"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

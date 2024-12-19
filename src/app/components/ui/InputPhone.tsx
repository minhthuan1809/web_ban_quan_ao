"use client";
import { Input } from "@nextui-org/react";
import { Phone } from "lucide-react";

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
  return (
    <Input
      isRequired
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
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

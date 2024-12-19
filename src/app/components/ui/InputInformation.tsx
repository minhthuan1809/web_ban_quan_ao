"use client";
import { Input } from "@nextui-org/react";
import * as Icon from "lucide-react";

// Hàm lấy Icon Component từ `lucide-react`
function getIconComponent(icon?: keyof typeof Icon): React.ElementType | null {
  return icon ? (Icon[icon] as React.ElementType) : null;
}

export default function InputGmail({
  placeholder,
  label,
  value,
  onChange,
  icon,
}: {
  placeholder: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: keyof typeof Icon;
}) {
  const IconComponent = getIconComponent(icon);

  return (
    <Input
      isRequired
      classNames={{
        inputWrapper: "w-full mt-[1rem]",
      }}
      startContent={
        IconComponent ? (
          <IconComponent
            size={20}
            className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
          />
        ) : null
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

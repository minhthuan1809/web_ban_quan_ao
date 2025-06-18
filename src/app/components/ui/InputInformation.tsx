"use client";
import GetIconComponent from "@/app/_util/Icon";
import { Input } from "@nextui-org/react";
import * as Icon from "lucide-react";

export default function InputInformation({
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
  return (
    <Input
      isRequired
      type="text"
      classNames={{
        inputWrapper: "w-full ",
      }}
      startContent={
        <GetIconComponent
          icon={icon}
          size={20}
          className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
        />
      }
      label={label}
      labelPlacement={"outside"}
      maxLength={70}
      autoFocus
      placeholder={placeholder}
      variant="bordered"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

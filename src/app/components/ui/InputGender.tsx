"use client";
import { RadioGroup, Radio } from "@nextui-org/react";
import { User, Users, UserCircle } from "lucide-react";
import { useCallback } from "react";

interface InputGenderProps {
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  isRequired?: boolean;
  orientation?: "horizontal" | "vertical";
}

interface GenderOption {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  description?: string;
}

const GENDER_OPTIONS: GenderOption[] = [
  {
    value: "MALE",
    label: "Nam",
    icon: User,
    description: "Nam giới"
  },
  {
    value: "FEMALE", 
    label: "Nữ",
    icon: UserCircle,
    description: "Nữ giới"
  },
  {
    value: "OTHER",
    label: "Khác",
    icon: Users,
    description: "Giới tính khác"
  }
];

export default function InputGender({ 
  placeholder, 
  label = "Giới tính", 
  value, 
  onChange,
  disabled = false,
  className = "",
  isRequired = false,
  orientation = "horizontal"
}: InputGenderProps) {
  
  const handleValueChange = useCallback((selectedValue: string) => {
    onChange(selectedValue);
  }, [onChange]);

  return (
    <div className={`w-full ${className}`}>
      <RadioGroup
        label={label}
        value={value}
        onValueChange={handleValueChange}
        orientation={orientation}
        isRequired={isRequired}
        isDisabled={disabled}
        classNames={{
          base: "w-full",
          label: "text-sm font-medium text-gray-700 mb-2",
          wrapper: orientation === "horizontal" ? "flex-row gap-6" : "flex-col gap-3",
        }}
        description={placeholder}
      >
        {GENDER_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <Radio 
              key={option.value} 
              value={option.value}
              classNames={{
                base: [
                  "inline-flex items-center hover:bg-gray-50 rounded-lg p-3 transition-all duration-200",
                  "border border-gray-200 hover:border-blue-300",
                  "cursor-pointer w-full max-w-none",
                  value === option.value ? "border-blue-500 bg-blue-50" : ""
                ].join(" "),
                wrapper: "hidden",
                labelWrapper: "ml-0 flex-1",
                label: "flex items-center gap-3 w-full text-sm font-medium",
                control: "flex-shrink-0"
              }}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-2 rounded-lg transition-colors ${
                  value === option.value 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-100 text-gray-500"
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                
                <div className="flex-1">
                  <div className={`font-medium ${
                    value === option.value ? "text-blue-700" : "text-gray-700"
                  }`}>
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </div>
                  )}
                </div>

                {/* Custom radio indicator */}
                <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                  value === option.value
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}>
                  {value === option.value && (
                    <div className="w-full h-full rounded-full bg-white scale-50 transition-transform" />
                  )}
                </div>
              </div>
            </Radio>
          );
        })}
      </RadioGroup>
    </div>
  );
}
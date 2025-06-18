"use client";

interface InputGenderProps {
  placeholder: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function InputGender({ placeholder, label, value, onChange }: InputGenderProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="MALE"
            checked={value === "MALE"}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Nam</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="FEMALE"
            checked={value === "FEMALE"}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Nữ</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="OTHER"
            checked={value === "OTHER"}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Khác</span>
        </label>
      </div>
    </div>
  );
}
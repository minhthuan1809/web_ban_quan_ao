import React, { useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';
import { RefreshCw, Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
  className?: string;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
  className = ""
}: DateRangeFilterProps) {
  // Mặc định lấy ngày hôm nay
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Nếu startDate và endDate đều rỗng, set mặc định là hôm nay
    if (!startDate && !endDate) {
      onStartDateChange(today);
      onEndDateChange(today);
    }
  }, []); // Chỉ chạy một lần khi component mount

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    onStartDateChange(newStartDate);
    
    // Nếu endDate nhỏ hơn startDate, tự động cập nhật endDate
    if (endDate && newStartDate > endDate) {
      onEndDateChange(newStartDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    onEndDateChange(newEndDate);
    
    // Nếu startDate lớn hơn endDate, tự động cập nhật startDate
    if (startDate && newEndDate < startDate) {
      onStartDateChange(newEndDate);
    }
  };

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    onStartDateChange(today);
    onEndDateChange(today);
    onReset();
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 items-start sm:items-end ${className}`}>
      <div className="flex-1">
        <Input
          type="date"
          label="Từ ngày"
          placeholder="Chọn ngày bắt đầu"
          value={startDate}
          onChange={handleStartDateChange}
          className="w-full"
          size="sm"
          radius="md"
          startContent={<Calendar className="w-4 h-4 text-default-400" />}
          classNames={{
            input: "text-gray-900 dark:text-gray-100",
            inputWrapper: "border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-600 dark:focus-within:border-blue-400 bg-white dark:bg-gray-800"
          }}
        />
      </div>
      
      <div className="flex-1">
        <Input
          type="date"
          label="Đến ngày"
          placeholder="Chọn ngày kết thúc"
          value={endDate}
          onChange={handleEndDateChange}
          className="w-full"
          size="sm"
          radius="md"
          startContent={<Calendar className="w-4 h-4 text-default-400" />}
          classNames={{
            input: "text-gray-900 dark:text-gray-100",
            inputWrapper: "border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-600 dark:focus-within:border-blue-400 bg-white dark:bg-gray-800"
          }}
        />
      </div>
      
      <Button
        size="sm"
        variant="bordered"
        onClick={handleReset}
        className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        startContent={<RefreshCw size={16} />}
      >
        Làm mới
      </Button>
    </div>
  );
} 
"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Select, SelectItem, Chip } from '@nextui-org/react';
import { GetAllColor_API } from '@/app/_service/color';
import useAuthInfor from '@/app/customHooks/AuthInfor';

interface Color {
  id: number;
  name: string;
  hexColor: string;
  isDeleted?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export default function InputColor({ setColor, color }: { setColor: (color: string[]) => void, color: string[] }) {
  const [loading, setLoading] = useState(false);
  const [colorList, setColorList] = useState<Color[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');   
  const [currentPage, setCurrentPage] = useState(0);
  const { accessToken } = useAuthInfor();
  const [mounted, setMounted] = useState(false);
  const [validSelectedKey, setValidSelectedKey] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    // Fetch data ngay khi component mount
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await GetAllColor_API(searchQuery, currentPage, accessToken || "")
      setColorList(res.data)
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, currentPage, accessToken])

  // Xác thực key đã chọn
  useEffect(() => {
    if (mounted && color && Array.isArray(color) && color.length > 0) {      
      // Nếu có color nhưng không có trong colorList, fetch lại data
      if (colorList.length === 0) {
        fetchData();
        return;
      }

      // Lấy giá trị đầu tiên trong mảng color
      const selectedKey = color[0];
      
      // Kiểm tra xem key có hợp lệ không
      if (selectedKey && 
          selectedKey.toString().trim() !== '' && 
          colorList.some(item => item.id.toString() === selectedKey.toString())) {
        setValidSelectedKey(selectedKey);
      } else if (colorList.length > 0) {
        // Nếu key không hợp lệ và đã có colorList, fetch lại data
        fetchData();
      }
    } else {
      setValidSelectedKey("");
    }
  }, [color, colorList, mounted, fetchData]);

  // Thêm useEffect để fetch color list khi component mount hoặc khi color thay đổi
  useEffect(() => {
    if (mounted && color && color.length > 0 && colorList.length === 0) {
      fetchData();
    }
  }, [mounted, color, colorList.length, fetchData]);

  if (!mounted) {
    return null;
  }

  return (
    <Select
      classNames={{
        base: "w-full",
        trigger: "min-h-12 py-2",
        label: "font-medium text-foreground",
      }}
      items={colorList}
      label="Màu sắc"
      labelPlacement="outside"
      placeholder="Chọn màu sắc"
      selectionMode="single"
      variant="bordered"
      size="lg"
      isLoading={loading}
      onSelectionChange={(keys) => {
        const selectedValue = Array.from(keys)[0]?.toString() || "";
        setColor(selectedValue ? [selectedValue] : []);
      }}
      selectedKeys={validSelectedKey ? new Set([validSelectedKey]) : new Set()}
      renderValue={(items) => {
        const item = items[0];
        return item ? (
          <div className="flex flex-wrap gap-2">
            <Chip 
              key={item.key} 
              startContent={
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: item.data?.hexColor || '#000000' }}
                />
              }
            >
              {item.data?.name}
            </Chip>
          </div>
        ) : null;
      }}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          fetchData();
        }
      }}
    >
      {(colorItem) => (
        <SelectItem key={colorItem.id.toString()} textValue={colorItem.name}>
          <div className="flex gap-2 items-center">
            <div 
              className="w-5 h-5 rounded-full flex-shrink-0" 
              style={{ backgroundColor: colorItem.hexColor }}
            />
            <div className="flex flex-col">
              <span className="text-small">{colorItem.name}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  )
}

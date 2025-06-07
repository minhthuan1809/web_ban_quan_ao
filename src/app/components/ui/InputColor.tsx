"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Select, SelectItem, Chip, Avatar } from '@nextui-org/react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const { accessToken } = useAuthInfor();
  const [mounted, setMounted] = useState(false);
  const [validSelectedKeys, setValidSelectedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await GetAllColor_API(searchQuery, currentPage, accessToken)
      setColorList(res.data)
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, currentPage, accessToken])

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        fetchData()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [fetchData, mounted])

  // Lọc và xác thực các key đã chọn
  useEffect(() => {
    if (mounted && colorList.length > 0 && color && Array.isArray(color)) {
      // Lọc bỏ các giá trị rỗng và không hợp lệ
      const validKeys = color.filter(key => 
        key && 
        key.toString().trim() !== '' && 
        colorList.some(item => item.id.toString() === key.toString())
      );
      
      setValidSelectedKeys(new Set(validKeys));
    }
  }, [color, colorList, mounted]);

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
      
      isMultiline={true}
      items={colorList}
      label="Màu sắc"
   
      labelPlacement="outside"
      placeholder="Chọn màu sắc"
      selectionMode="multiple"
      variant="bordered"
      size="lg"
      isLoading={loading}
      onSelectionChange={(keys) => {
        const selectedValues = Array.from(keys).map(key => key.toString());
        setColor(selectedValues);
      }}
      selectedKeys={validSelectedKeys}
      renderValue={(items) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
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
            ))}
          </div>
        );
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

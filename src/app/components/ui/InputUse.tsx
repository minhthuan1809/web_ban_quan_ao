"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Select, SelectItem, Chip, Avatar } from '@nextui-org/react';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { getUserById_API } from '@/app/_service/user';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  ward: string;
  role?: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  };
  avatarUrl: string;
  gender: string;
  cartId?: number;
  isVerify?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function InputUse({ setUse, use }: any) {
  const [loading, setLoading] = useState(false);
  const [useList, setUseList] = useState<User[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');   
  const [currentPage, setCurrentPage] = useState(1);
  const { accessToken } = useAuthInfor();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getUserById_API(accessToken)
      console.log(res)
      
      setUseList(res.data.data)
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

  // Lọc và xác thực các key đã chọn - chỉ chạy khi useList thay đổi
  useEffect(() => {
    if (mounted && useList.length > 0 && use && Array.isArray(use)) {
      // Lọc bỏ các giá trị rỗng và không hợp lệ
      const validKeys = use.filter(key => 
        key && 
        key.toString().trim() !== '' && 
        useList.some(item => item.id.toString() === key.toString())
      );
      
      // Chỉ cập nhật khi validKeys khác với use
      if (JSON.stringify(validKeys) !== JSON.stringify(use)) {
        setUse(validKeys);
      }                 
    }
  }, [useList, mounted]); // Đã loại bỏ use khỏi dependencies

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
      items={useList}
      label="Người dùng"
      labelPlacement="outside"
      placeholder="Chọn người dùng"
      selectionMode="multiple"
      variant="bordered"
      size="lg"
      isLoading={loading}
      onSelectionChange={(keys) => {
        const selectedValues = Array.from(keys).map(key => key.toString());
        setUse(selectedValues);
      }}
      selectedKeys={new Set(Array.isArray(use) ? use : [])}    
      renderValue={(items) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip 
                key={item.key} 
                startContent={
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: "#000000" }}
                  />
                }
              >
                {item.data?.fullName}
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
      {(useItem) => (
        <SelectItem key={useItem.id.toString()} textValue={useItem.fullName}>
          <div className="flex gap-2 items-center">
            <Avatar 
              src={useItem.avatarUrl || "https://i.pravatar.cc/150"}
              size="sm"
              className="flex-shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-small">{useItem.fullName}</span>
              <span className="text-tiny text-default-400">{useItem.email}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  )
}

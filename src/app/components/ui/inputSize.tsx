"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Input } from '@nextui-org/react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { GetAllSize_API } from '@/app/_service/size';
import useAuthInfor from '@/app/customHooks/AuthInfor';

interface Material {
  id: number;
  name: string;
  slug: string;
  createdAt: number;
  updatedAt: number;
}

export default function InputSize({ setSize, size }: { setSize: (size: string) => void, size: string }) {
  const [loading, setLoading] = useState(false);
  const [sizeList, setSizeList] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { accessToken } = useAuthInfor();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchSize = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GetAllSize_API(
        searchTerm,
        1,
        accessToken
      );
      setSizeList(response.data.reverse());
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, accessToken]);

  useEffect(() => {
    if (mounted) {
      const debounceTimer = setTimeout(() => {
        fetchSize();
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [fetchSize, mounted]);

  useEffect(() => {
    if (mounted && size) {
      const selectedSize = sizeList.find(item => item.id.toString() === size);
      if (selectedSize) {
        setSearchTerm(selectedSize.name);
      } else {
        setSearchTerm('');
        setSize('');
      }
    }
  }, [size, sizeList, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          label="Kích thước"
          labelPlacement="outside"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSize("");
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => {
            setTimeout(() => {
              if (!size) {
                setSearchTerm("");
              }
              setShowDropdown(false)
            }, 200)
          }}
          endContent={mounted ? (!showDropdown ? <ChevronDownIcon className='w-4 h-4 text-default-400' /> : <ChevronUpIcon className='w-4 h-4 text-default-400' />) : null}
          placeholder="Chọn kích thước"
          variant="bordered"
          size='lg'
          classNames={{
            label: "font-medium text-foreground",
            input: "text-foreground",
            inputWrapper: "bg-background"
          }}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {sizeList.map((item) => (
            <div
              key={item.id}
              className="px-4 py-2 cursor-pointer hover:bg-default-100 text-foreground"
              onClick={() => {
                setSize(item.id.toString());
                setSearchTerm(item.name);
                setShowDropdown(false);
              }}
            >
              {item.name}
            </div>
          ))}
          {sizeList.length === 0 && !loading && (
            <div className="px-4 py-2 text-default-500">
              Không tìm thấy kết quả
            </div>
          )}
        </div>
      )}
    </div>
  )
}


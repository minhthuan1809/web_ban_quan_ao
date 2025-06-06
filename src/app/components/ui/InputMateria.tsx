"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { getmaterial_API } from '@/app/_service/category'
import { toast } from 'react-toastify'
import { Input } from '@nextui-org/react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface Material {
  id: number;
  name: string;
  slug: string;
  createdAt: number;
  updatedAt: number;
}

export default function InputMateria({ setMaterial, material }: { setMaterial: (c: string) => void, material: string }) {
  const [loading, setLoading] = useState(false);
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchMaterial = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getmaterial_API(
        searchTerm,
        1,
        10,
        "",
        ""
      );
      setMaterialList(response.data.reverse());
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchMaterial();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [fetchMaterial, searchTerm]);

  useEffect(() => {
    if (material) {
      const selectedmaterial = materialList.find(item => item.id.toString() === material);
      if (selectedmaterial) {
        setSearchTerm(selectedmaterial.name);
      }
    }
  }, [material, materialList]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          label="Vật liệu"
          labelPlacement="outside"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setMaterial("");
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowDropdown(false)
            }, 200)
          }}
          endContent={!showDropdown ? <ChevronDownIcon className='w-4 h-4' /> : <ChevronUpIcon className='w-4 h-4' />}
          placeholder="Chọn vật liệu"
          variant="bordered"
          size='lg'
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {materialList.map((item) => (
            <div
              key={item.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setMaterial(item.id.toString());
                setSearchTerm(item.name);
                setShowDropdown(false);
              }}
            >
              {item.name}
            </div>
          ))}
          {materialList.length === 0 && !loading && (
            <div className="px-4 py-2 text-gray-500">
              Không tìm thấy kết quả
            </div>
          )}
        </div>
      )}
    </div>
  )
}

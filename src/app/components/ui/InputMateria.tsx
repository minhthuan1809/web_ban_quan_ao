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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (mounted) {
      const debounceTimer = setTimeout(() => {
        fetchMaterial();
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [fetchMaterial, mounted]);

  useEffect(() => {
    if (mounted && material) {
      const selectedMaterial = materialList.find(item => item.id.toString() === material);
      if (selectedMaterial) {
        setSearchTerm(selectedMaterial.name);
      } else {
        setSearchTerm('');
        setMaterial('');
      }
    }
  }, [material, materialList, mounted]);

  if (!mounted) {
    return null;
  }

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
              if (!material) {
                setSearchTerm("");
              }
              setShowDropdown(false)
            }, 200)
          }}
          endContent={mounted ? (!showDropdown ? <ChevronDownIcon className='w-4 h-4 text-default-400' /> : <ChevronUpIcon className='w-4 h-4 text-default-400' />) : null}
          placeholder="Chọn vật liệu"
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
          {materialList.map((item) => (
            <div
              key={item.id}
              className="px-4 py-2 cursor-pointer hover:bg-default-100 text-foreground"
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
            <div className="px-4 py-2 text-default-500">
              Không tìm thấy kết quả
            </div>
          )}
        </div>
      )}
    </div>
  )
}


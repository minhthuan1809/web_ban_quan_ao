"use client"
import { getmaterial_API } from '@/app/_service/category';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';

interface Material {
  id: number;
  name: string;
  slug: string;
  createdAt: number;
  updatedAt: number;
}

export default function InputMateria({setMaterial, material}: {setMaterial: (material: string) => void, material: string}) {
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [materialList, setMaterialList] = useState<Material[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCategory = useCallback(async () => {
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
          setTotalPage(response.metadata.total_page);
        } catch (err: any) {
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      }, [searchTerm]);        

      useEffect(() => {
        const debounceTimer = setTimeout(() => {
          fetchCategory();
        }, 500);

        return () => clearTimeout(debounceTimer);
      }, [fetchCategory, searchTerm]);

  return (
    <div className="relative">
      <Autocomplete
        label="Chọn vật liệu" 
        placeholder="Tìm kiếm vật liệu..."
        defaultItems={materialList}
        value={material}
        onInputChange={setSearchTerm}
        onSelectionChange={(value) => setMaterial(value as string)}
        isLoading={loading}
        className="w-full"
        variant="bordered"
        classNames={{
          base: "max-w-full",
          listbox: "bg-white w-full min-w-[200px] border border-gray-200 shadow-lg",
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.id} value={item.id.toString()}>
            {item.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  )
}

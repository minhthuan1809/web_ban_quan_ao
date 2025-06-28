"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Slider,
  Divider,
} from "@nextui-org/react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { getCategory_API } from "@/app/_service/category"
import { GetAllSize_API } from "@/app/_service/size"
import { useRouter, useSearchParams } from "next/navigation"

export default function FilterProduct({filter, setFilter} : {filter: any, setFilter: any}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 4905500])
  const [isFilterExpanded, setIsFilterExpanded] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [sizes, setSizes] = useState([])

  // Parse categories từ URL khi component mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const urlCategories = categoryParam.split(',').filter(id => id.trim() !== '').map(id => id.trim());
      setSelectedCategories(urlCategories);
    }
  }, []);

  // Cập nhật URL khi categories thay đổi
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    } else {
      params.delete('category');
    }
    
    const newUrl = `/products?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [selectedCategories]);

//debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter({
        categories: selectedCategories,
        sizes: selectedSizes,
        priceRange: priceRange,
      })
    }, 1000)
    return () => clearTimeout(timeout)
  }, [selectedCategories, selectedSizes, priceRange])

  //fetch sizes
  useEffect(() => {
    const fetchSizes = async () => {
      const res = await GetAllSize_API("", 1)
      if(res.data) {
        setSizes(res.data)
      }
    }
    fetchSizes()
  }, [])  

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ"
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategory_API({
        search: "",
        page: 1,
        pageSize: 100,
        sort: "createdAt:desc",
        filter: ""
      })
        setCategories(res.data)
 
    }
    fetchCategories()
  }, [])

  return (
    <Card className="w-full lg:w-[300px] h-fit shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardBody className="p-0 overflow-hidden">
        {/* Header - Collapsible on mobile */}
        <div 
          className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer lg:cursor-default flex items-center justify-between"
          onClick={() => {
            // Only toggle on mobile/tablet (screen width < 1024px)
            if (window.innerWidth < 1024) {
              setIsFilterExpanded(!isFilterExpanded)
            }
          }}
        >
          <h2 className="text-base font-bold">BỘ LỌC SẢN PHẨM</h2>
          <ChevronDown 
            className={`text-white/80 transition-transform lg:hidden ${
              isFilterExpanded ? 'rotate-180' : ''
            }`} 
            size={18} 
          />
        </div>

        {/* Filter Content */}
        <div className={`transition-all duration-300 ease-in-out ${
          isFilterExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'
        } overflow-hidden lg:overflow-visible`}>
          {/* Product Categories */}
          <div className="px-6 py-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              DANH MỤC SẢN PHẨM
            </h3>
            <CheckboxGroup
              value={selectedCategories}
              onValueChange={(value : string[]) => setSelectedCategories(value)}
              classNames={{
                wrapper: "gap-3",
              }}
            >
              {categories.map((category : any) => (
                <Checkbox
                  key={category.id}
                  value={category.id.toString()}
                  classNames={{
                    base: "hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors",
                    label: "text-sm text-gray-700 dark:text-gray-300 font-medium",
                  }}
                >
                  {category.name}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>

          <Divider className="bg-gray-200 dark:bg-gray-700" />

          {/* Size Selection */}
          <div className="px-6 py-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              SIZE
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size : any) => (
                <div
                  key={size.id}
                  className={`cursor-pointer h-10 flex items-center justify-center rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    selectedSizes.includes(size.id)
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-md"
                      : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                  onClick={() => {
                    if (selectedSizes.includes(size.id)) {
                      setSelectedSizes(selectedSizes.filter((s : any) => s !== size.id))
                    } else {
                      setSelectedSizes([...selectedSizes, size.id])
                    }
                  }}
                >
                  {size.name}
                </div>
              ))}
            </div>
          </div>

          <Divider className="bg-gray-200 dark:bg-gray-700" />

          {/* Price Range */}
          <div className="px-6 py-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
              KHOẢNG GIÁ
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 text-center border border-blue-100 dark:border-gray-600">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </div>
              </div>
              <Slider
                step={50000}
                minValue={0}
                maxValue={5000000}
                value={priceRange}
                onChange={(value) => setPriceRange(value as number[])}
                size="md"
                classNames={{
                  track: "bg-gray-200 dark:bg-gray-700",
                  filler: "bg-gradient-to-r from-blue-600 to-purple-600",
                  thumb: "bg-white border-4 border-blue-600 shadow-lg hover:scale-110 transition-transform",
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>0đ</span>
                <span>5,000,000đ</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
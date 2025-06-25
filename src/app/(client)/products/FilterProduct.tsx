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
    <Card className="w-full lg:w-[280px] h-fit shadow-sm overflow-hidden border border-border rounded-lg bg-background">
      <CardBody className="p-0 overflow-hidden">
        {/* Header - Collapsible on mobile */}
        <div 
          className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border cursor-pointer lg:cursor-default flex items-center justify-between"
          onClick={() => {
            // Only toggle on mobile/tablet (screen width < 1024px)
            if (window.innerWidth < 1024) {
              setIsFilterExpanded(!isFilterExpanded)
            }
          }}
        >
          <h2 className="text-sm sm:text-base font-semibold text-foreground">BỘ LỌC</h2>
          <ChevronDown 
            className={`text-default-500 transition-transform lg:hidden ${
              isFilterExpanded ? 'rotate-180' : ''
            }`} 
            size={16} 
          />
        </div>

        {/* Filter Content */}
        <div className={`transition-all duration-300 ease-in-out ${
          isFilterExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'
        } overflow-hidden lg:overflow-visible`}>
          {/* Product Categories */}
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <h3 className="text-xs sm:text-sm font-medium text-foreground mb-3">DANH MỤC SẢN PHẨM</h3>
            <CheckboxGroup
              value={selectedCategories}
              onValueChange={(value : string[]) => setSelectedCategories(value)}
              classNames={{
                wrapper: "gap-2 sm:gap-3",
              }}
            >
              {categories.map((category : any) => (
                <Checkbox
                  key={category.id}
                  value={category.id.toString()}
                  classNames={{
                    label: "text-xs sm:text-sm text-default-700",
                  }}
                >
                  {category.name}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>

          <Divider />

          {/* Size Selection */}
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <h3 className="text-xs sm:text-sm font-medium text-foreground mb-3">SIZE</h3>
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {sizes.map((size : any) => (
                <div
                  key={size.id}
                  className={`cursor-pointer h-7 sm:h-9 flex items-center justify-center rounded border transition-colors text-xs sm:text-sm ${
                    selectedSizes.includes(size.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-default-700 hover:border-primary/50"
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

          <Divider />

          {/* Price Range */}
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <h3 className="text-xs sm:text-sm font-medium text-foreground mb-3 sm:mb-4">KHOẢNG GIÁ</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center text-xs sm:text-sm text-default-700 font-medium">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </div>
              <Slider
                step={50000}
                minValue={0}
                maxValue={5000000}
                value={priceRange}
                onChange={(value) => setPriceRange(value as number[])}
                size="sm"
                classNames={{
                  track: "bg-default-200",
                  thumb: "bg-primary border-2 border-white shadow-md hover:scale-110 transition-transform",
                }}
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
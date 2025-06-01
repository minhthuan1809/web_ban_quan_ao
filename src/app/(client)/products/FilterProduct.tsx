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

export default function FilterProduct({filter, setFilter} : {filter: any, setFilter: any}) {

  const [selectedCategories, setSelectedCategories] = useState(["sports-clothing"])
  const [selectedSizes, setSelectedSizes] = useState(["L"])
  const [priceRange, setPriceRange] = useState([0, 4905500])
  const [isFilterExpanded, setIsFilterExpanded] = useState(true)
  const [categories, setCategories] = useState([])
 


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


  const sizes = [
    { key: "S", label: "S" },
    { key: "XS", label: "XS" },
    { key: "M", label: "M" },
    { key: "L", label: "L" },
    { key: "XL", label: "XL" },
    { key: "XXL", label: "XXL" },
    { key: "29", label: "29" },
    { key: "30", label: "30" },
    { key: "31", label: "31" },
    { key: "34", label: "34" },
  ]

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ"
  }


  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategory_API("", 1, 100, "createdAt", "desc")
      setCategories(res.data)
    }
    fetchCategories()
  }, [selectedCategories])


  return (
    <Card className="w-full lg:w-[280px] h-fit shadow-sm overflow-hidden border border-gray-200 rounded-lg">
      <CardBody className="p-0 overflow-hidden">
        {/* Header - Collapsible on mobile */}
        <div 
          className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 cursor-pointer lg:cursor-default flex items-center justify-between"
          onClick={() => {
            // Only toggle on mobile/tablet (screen width < 1024px)
            if (window.innerWidth < 1024) {
              setIsFilterExpanded(!isFilterExpanded)
            }
          }}
        >
          <h2 className="text-sm sm:text-base font-semibold text-gray-900">BỘ LỌC</h2>
          <ChevronDown 
            className={`text-gray-500 transition-transform lg:hidden ${
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
            <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-3">DANH MỤC SẢN PHẨM</h3>
            <CheckboxGroup
              value={selectedCategories}
              onValueChange={setSelectedCategories}
              classNames={{
                wrapper: "gap-2 sm:gap-3",
              }}
            >
              {categories.map((category : any) => (
                <Checkbox
                  key={category.slug}
                  value={category.name}
                  classNames={{
                    label: "text-xs sm:text-sm text-gray-700",
                    wrapper: "before:border-gray-300",
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
            <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-3">SIZE</h3>
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {sizes.map((size) => (
                <div
                  key={size.key}
                  className={`cursor-pointer h-7 sm:h-9 flex items-center justify-center rounded border transition-colors text-xs sm:text-sm ${
                    selectedSizes.includes(size.key)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                  onClick={() => {
                    if (selectedSizes.includes(size.key)) {
                      setSelectedSizes(selectedSizes.filter((s) => s !== size.key))
                    } else {
                      setSelectedSizes([...selectedSizes, size.key])
                    }
                  }}
                >
                  {size.label}
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* Price Range */}
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-3 sm:mb-4">KHOẢNG GIÁ</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center text-xs sm:text-sm text-gray-700 font-medium">
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
                  track: "bg-gray-200",
                  filler: "bg-gray-800",
                  thumb: "bg-gray-800 border-2 border-white shadow-md hover:scale-110 transition-transform",
                }}
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
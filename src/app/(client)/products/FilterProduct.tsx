"use client"

import { useState } from "react"
import {
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Chip,
  Accordion,
  AccordionItem,
  Slider,
  Divider,
} from "@nextui-org/react"
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react"

export default function FilterProduct() {
  const [selectedCategories, setSelectedCategories] = useState(["sports-clothing"])
  const [selectedSizes, setSelectedSizes] = useState(["L"])
  const [priceRange, setPriceRange] = useState([0, 4905500])

  const categories = [
    { key: "sports-clothing", label: "QUẦN ÁO THỂ THAO" },
    { key: "shoes", label: "GIÀY" }, 
    { key: "sandals", label: "SANDAL - DÉP - TÔNG" },
    { key: "bentoni", label: "THƯƠNG HIỆU BENTONI" },
  ]

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

  return (
    <Card className="w-full max-w-[280px] h-fit">
      <CardBody className="p-0 max-h-screen overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">BỘ LỌC</h2>
        </div>

        {/* Product Categories */}
        <Accordion defaultExpandedKeys={["categories"]} className="px-0" selectionMode="multiple">
          <AccordionItem
            key="categories"
            aria-label="Danh mục sản phẩm"
            title={<span className="text-blue-600 font-medium text-sm">DANH MỤC SẢN PHẨM</span>}
            indicator={({ isOpen }) => (isOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />)}
            classNames={{
              title: "text-blue-600",
              content: "px-4 py-2",
              base: "border-none",
            }}
          >
            <CheckboxGroup
              value={selectedCategories}
              onValueChange={setSelectedCategories}
              classNames={{
                wrapper: "gap-2",
              }}
            >
              {categories.map((category) => (
                <Checkbox
                  key={category.key}
                  value={category.key}
                  classNames={{
                    label: "text-sm text-gray-700",
                    wrapper: "before:border-gray-300",
                  }}
                >
                  {category.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </AccordionItem>
        </Accordion>

        <Divider className="my-1" />

        {/* Size Selection */}
        <Accordion defaultExpandedKeys={["sizes"]} className="px-0" selectionMode="multiple">
          <AccordionItem
            key="sizes"
            aria-label="Size"
            title={<span className="text-gray-800 font-medium text-sm">SIZE</span>}
            indicator={({ isOpen }) => (isOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />)}
            classNames={{
              content: "px-4 py-2",
              base: "border-none",
            }}
          >
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <Chip
                  key={size.key}
                  variant={selectedSizes.includes(size.key) ? "solid" : "bordered"}
                  classNames={{
                    base: `cursor-pointer justify-center h-9 transition-colors ${
                      selectedSizes.includes(size.key)
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`,
                  }}
                  onClick={() => {
                    if (selectedSizes.includes(size.key)) {
                      setSelectedSizes(selectedSizes.filter((s) => s !== size.key))
                    } else {
                      setSelectedSizes([...selectedSizes, size.key])
                    }
                  }}
                >
                  {size.label}
                </Chip>
              ))}
            </div>
          </AccordionItem>
        </Accordion>

        <Divider className="my-1" />

        <div className="space-y-4 px-4 py-2">
          <div className="text-center text-sm text-blue-600 font-medium">
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </div>
          <Slider
            step={50000}
            minValue={0}
            maxValue={5000000}
            value={priceRange}
            onChange={(value) => setPriceRange(value as number[])}
            className="w-full"
            classNames={{
              track: "bg-gray-200",
              thumb: "bg-gray-800 border-2 border-white shadow-lg hover:scale-110 transition-transform",
            }}
          />
        </div>
      </CardBody>
    </Card>
  )
}

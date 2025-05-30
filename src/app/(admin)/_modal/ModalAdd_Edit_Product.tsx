import React, { useState } from 'react'
import { Input, Select, SelectItem, Textarea, Button, Checkbox, Divider } from "@nextui-org/react"
import InputMateria from '../_conponents/category/InputMateria';
import InputCategory from '../_conponents/category/InputCategory';
import Variants from '../_conponents/Variants';

export default function ModalAdd_Edit_Product({
    isOpen,
    onClose,
    title,
    handleFinish,
    loadingBtn,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    handleFinish: () => void;
    loadingBtn: boolean;
  }) {

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    imageUrls: [''],
    teamId: '',
    materialId: '',
    season: '',
    jerseyType: '',
    isFeatured: false,
    description: '',
    price: 0,
    salePrice: 0,
    variants: [{
      size: '',
      priceAdjustment: 0,
      code: '',
      stockQuantity: 0
    }],
    materialList: [],
  });

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-xl p-8 z-10 w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <Divider className="my-4"/>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
          <Input
            label="Tên sản phẩm"
            placeholder="Nhập tên sản phẩm..."
            labelPlacement="outside"
            type="text" 
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            variant="bordered"
            size="lg"
            classNames={{
              label: "font-medium"
            }}
          />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Giá"
                labelPlacement="outside"
                type="number" 
                value={form.price.toString()}
                onChange={(e) => setForm({...form, price: Number(e.target.value)})}
                variant="bordered"
                size="lg"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-gray-500">₫</span>
                  </div>
                }
                classNames={{
                  label: "font-medium"
                }}
              />

              <Input
                label="Giá khuyến mãi"
                labelPlacement="outside"
                type="number"
                value={form.salePrice.toString()}
                onChange={(e) => setForm({...form, salePrice: Number(e.target.value)})}
                variant="bordered"
                size="lg"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-gray-500">₫</span>
                  </div>
                }
                classNames={{
                  label: "font-medium"
                }}
              />
            </div>

            <InputCategory setCategory={(value) => setForm({...form, categoryId: value})} category={form.categoryId}/>

            <Input
              label="Mùa giải"
              placeholder="Nhập mùa giải..."
              labelPlacement="outside"
              value={form.season}
              onChange={(e) => setForm({...form, season: e.target.value})}
              variant="bordered"
              size="lg"
              classNames={{
                label: "font-medium"
              }}
            />
            <Input
              label="Loại áo"
              placeholder="Nhập loại áo..."
              labelPlacement="outside"
              value={form.jerseyType}
              onChange={(e) => setForm({...form, jerseyType: e.target.value})}
              variant="bordered"
              size="lg"
              classNames={{
                label: "font-medium"
              }}
            />
            <InputMateria 
              setMaterial={(value) => setForm({...form, materialId: value})}
              material={form.materialId}
            />
            </div>
            <Variants />

          <div>
            <Textarea
              label="Mô tả sản phẩm"
              labelPlacement="outside"
              placeholder="Nhập mô tả sản phẩm..."
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              variant="bordered"
              size="lg"
              minRows={4}
              classNames={{
                label: "font-medium"
              }}
            />
          </div>

          <div>
            <Checkbox
              isSelected={form.isFeatured}
              onChange={(e) => setForm({...form, isFeatured: e.target.checked})}
              color="primary"
              size="lg"
              className="text-sm"
            >
              Đánh dấu là sản phẩm nổi bật
            </Checkbox>
          </div>
        </div>

        <Divider className="my-6"/>

        <div className="flex justify-end gap-3">
          <Button
            onPress={onClose}
            variant="bordered"
            size="lg"
            className="min-w-[120px]"
          >
            Hủy
          </Button>
          <Button
            onPress={handleFinish}
            isLoading={loadingBtn}
            color="primary"
            size="lg"
            className="min-w-[120px]"
          >
            {loadingBtn ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        </div>
      </div>
    </div>
  )
}

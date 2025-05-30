import React, { useState } from 'react'
import { Input, Select, SelectItem, Textarea, Button, Checkbox } from "@nextui-org/react"
import InputMateria from '../_conponents/category/InputMateria';

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
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 z-10 w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="Tên sản phẩm"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            variant="bordered"
          />

          <Input
            label="Giá"
            type="number" 
            value={form.price.toString()}
            onChange={(e) => setForm({...form, price: Number(e.target.value)})}
            variant="bordered"
          />

          <Input
            label="Giá khuyến mãi"
            type="number"
            value={form.salePrice.toString()}
            onChange={(e) => setForm({...form, salePrice: Number(e.target.value)})}
            variant="bordered"
          />

          <Select
            label="Phân loại"
            variant="bordered"
            value={form.categoryId}
            onChange={(e) => setForm({...form, categoryId: e.target.value})}
          >
            <SelectItem key="1" value="1">Phân loại 1</SelectItem>
          </Select>

          <Select
            label="Đội"
            variant="bordered"
            value={form.teamId}
            onChange={(e) => setForm({...form, teamId: e.target.value})}
          >
            <SelectItem key="1" value="1">Đội 1</SelectItem>
          </Select>

          <InputMateria 
            setMaterial={(value) => setForm({...form, materialId: value})}
            material={form.materialId}
          />

          <Input
            label="Mùa giải"
            value={form.season}
            onChange={(e) => setForm({...form, season: e.target.value})}
            variant="bordered"
          />

          <Input
            label="Loại áo"
            value={form.jerseyType}
            onChange={(e) => setForm({...form, jerseyType: e.target.value})}
            variant="bordered"
          />
        </div>

        <div className="mb-4">
          <Textarea
            label="Mô tả"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            variant="bordered"
          />
        </div>

        <div className="mb-4">
          <Checkbox
            isSelected={form.isFeatured}
            onChange={(e) => setForm({...form, isFeatured: e.target.checked})}
          >
            Sản phẩm nổi bật
          </Checkbox>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onPress={onClose}
            variant="bordered"
          >
            Hủy
          </Button>
          <Button
            onPress={handleFinish}
            isLoading={loadingBtn}
            color="primary"
          >
            {loadingBtn ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        </div>
      </div>
    </div>
  )
}

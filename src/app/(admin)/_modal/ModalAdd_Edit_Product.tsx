'use client';

import React, { useEffect, useState } from 'react'
import { Input, Textarea, Button, Checkbox, Divider, Spinner } from "@nextui-org/react"
import InputMateria from '../_conponents/category/InputMateria';
import InputCategory from '../_conponents/category/InputCategory';
import Variants from '../_conponents/Variants';
import InputTakeImg from '@/app/_util/ui/InputTakeImg';
import { uploadToCloudinary } from '@/app/_util/upload_img_cloudinary';
import { CreateProduct_API, UpdateProduct_API } from '@/app/_service/products';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { toast } from 'react-toastify';
import InputTextEditor from '@/app/_util/ui/InputTextEditer';
import { validateForm } from './js/validateFormAddProduct';

interface FormData {
  name: string;
  categoryId: string | number;
  imageUrls: any[];
  teamId: string | number;
  materialId: string | number;
  season: string;
  jerseyType: string;
  isFeatured: boolean;
  description: string;
  price: number;
  salePrice: number;
  variants: any[];
  materialList: any[];
}

const initialFormState: FormData = {
  name: '',
  categoryId: '',
  imageUrls: [],
  teamId: '1',
  materialId: '',
  season: '',
  jerseyType: '',
  isFeatured: false,
  description: '',
  price: 0,
  salePrice: 0,
  variants: [],
  materialList: [],
};

export default function ModalAdd_Edit_Product({
  isOpen,
  onClose,
  refetch,
  edit,
  setEdit
}: {
  isOpen: boolean;
  onClose: () => void;
  edit: any
  setEdit: (edit: any) => void;
  refetch: () => void;
}) {
  const { accessToken } = useAuthInfor()
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [form, setForm] = useState<FormData>(initialFormState);

  useEffect(() => {
    if (!isOpen) {
      setForm(initialFormState);
      setErrors({});
    } else if (edit) {
      setForm({
        name: edit.name || '',
        categoryId: edit.category?.id || '',
        imageUrls: edit.imageUrls || [],
        teamId: edit.team?.id || '1',
        materialId: edit.material?.id || '',
        season: edit.season || '',
        jerseyType: edit.jerseyType || '',
        isFeatured: edit.isFeatured || false,
        description: edit.description || '',
        price: edit.price || 0,
        salePrice: edit.salePrice || 0,
        variants: edit.variants || [],
        materialList: [],
      });
    }
  }, [edit, isOpen]);

  const handleClose = () => {
    if (loadingBtn) {
      toast.error("Vui lòng đợi xử lý xong!");
      return;
    }
    setForm(initialFormState);
    setErrors({});
    setEdit(null);
    onClose();
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const callApiCloudinary = async () => {
    try {
      let uploadedImages = form.imageUrls;
      const newImages = form.imageUrls.filter(img => typeof img !== 'string');
      
      if (newImages.length > 0) {
        try {
          const newUploadedImages = await uploadToCloudinary(newImages, "kick-style");
          uploadedImages = [...form.imageUrls.filter(img => typeof img === 'string'), ...newUploadedImages];
        } catch (error) {
          toast.error("Có lỗi khi tải lên hình ảnh. Vui lòng kiểm tra định dạng file.");
          throw error;
        }
      }

      return {
        "name": form.name,
        "categoryId": Number(form.categoryId),
        "imageUrls": uploadedImages,
        "teamId": Number(form.teamId),
        "materialId": Number(form.materialId),
        "season": form.season,
        "jerseyType": form.jerseyType,
        "isFeatured": form.isFeatured,
        "description": form.description,
        "price": form.price,
        "salePrice": form.salePrice,
        "variants": form.variants
      };
    } catch (error) {
      console.error("Error in callApiCloudinary:", error);
      throw error;
    }
  };

  // handle finish
  const handleFinish = async () => {
    if (!validateForm(form, setErrors)) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    try {
      setLoadingBtn(true)
      const data = await callApiCloudinary();
      const response = await CreateProduct_API(data, accessToken);
      
      if (response.status === 200) {
        toast.success("Thêm sản phẩm thành công");
        handleClose();
        refetch();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(edit ? "Có lỗi xảy ra khi cập nhật sản phẩm" : "Có lỗi xảy ra khi thêm sản phẩm");
      console.error(error);
    } finally {
      setLoadingBtn(false);
    }
  }

  // edit
  const handleEdit = async () => {
    try {
      setLoadingBtn(true)
    const data = await callApiCloudinary();
    const response = await UpdateProduct_API(edit.id, data, accessToken);
    if (response.status === 200) {
      toast.success("Cập nhật sản phẩm thành công");
      handleClose();
      refetch();
    } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(edit ? "Có lỗi xảy ra khi cập nhật sản phẩm" : "Có lỗi xảy ra khi thêm sản phẩm");
      console.error(error);
    } finally {
      setLoadingBtn(false);
    }
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="bg-white rounded-xl p-8 z-10 w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{edit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
          <button
            disabled={loadingBtn}
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="font-medium mb-2">Hình ảnh sản phẩm</p>
          <InputTakeImg
            images={form.imageUrls || []}
            setImages={(value) => handleInputChange('imageUrls', value)}
            onChange={(value) => handleInputChange('imageUrls', value)}
            numberImg={10}
          />
          {errors.imageUrls && <p className="text-red-500 text-sm mt-1">{errors.imageUrls}</p>}
        </div>

        <Divider className="my-4" />

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Input
                label="Tên sản phẩm"
                placeholder="Nhập tên sản phẩm..."
                labelPlacement="outside"
                type="text"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                variant="bordered"
                size="lg"
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                classNames={{
                  label: "font-medium"
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Giá"
                  labelPlacement="outside"
                  type="number"
                  value={form.price?.toString() || '0'}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  variant="bordered"
                  size="lg"
                  isInvalid={!!errors.price}
                  errorMessage={errors.price}
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

              <Input
                label="Giá khuyến mãi"
                labelPlacement="outside"
                type="number"
                name="salePrice"
                value={form.salePrice?.toString() || '0'}
                onChange={(e) => handleInputChange('salePrice', Number(e.target.value))}
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

            <div>
              <InputCategory
                setCategory={(value) => handleInputChange('categoryId', value)}
                category={form.categoryId?.toString() || ''}
              />
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <Input
                label="Mùa giải"
                placeholder="Nhập mùa giải..."
                labelPlacement="outside"
                value={form.season}
                onChange={(e) => handleInputChange('season', e.target.value)}
                variant="bordered"
                size="lg"
                isInvalid={!!errors.season}
                errorMessage={errors.season}
                classNames={{
                  label: "font-medium"
                }}
              />
            </div>

            <div>
              <InputMateria
                setMaterial={(value) => handleInputChange('materialId', value)}
                material={form.materialId?.toString() || ''}
              />
              {errors.materialId && <p className="text-red-500 text-sm mt-1">{errors.materialId}</p>}
            </div>

            <div>
              <Input
                label="Loại áo"
                placeholder="Nhập loại áo..."
                labelPlacement="outside"
                value={form.jerseyType}
                onChange={(e) => handleInputChange('jerseyType', e.target.value)}
                variant="bordered"
                size="lg"
                isInvalid={!!errors.jerseyType}
                errorMessage={errors.jerseyType}
                classNames={{
                  label: "font-medium"
                }}
              />
            </div>
          </div>

          <div>
            <Variants
              variants={form.variants}
              setVariants={(value) => handleInputChange('variants', value)}
            />
            {errors.variants && <p className="text-red-500 text-sm mt-1">{errors.variants}</p>}
          </div>

          <div>
            <InputTextEditor
              value={form.description}
              onChange={(value) => handleInputChange('description', value)}
              height={500}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <Checkbox
              isSelected={form.isFeatured}
              onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
              color="primary"
              size="lg"
              className="text-sm"
            >
              Đánh dấu là sản phẩm nổi bật
            </Checkbox>
          </div>
        </div>

        <Divider className="my-6" />
        <div className="flex justify-end gap-3">
          <Button
            onPress={handleClose}
            variant="bordered"
            size="lg"
            className="min-w-[120px]"
          >
            Hủy
          </Button>
          <Button
            onPress={edit ? handleEdit : handleFinish}
            isLoading={loadingBtn}
            color="primary"
            size="lg"
            className="min-w-[120px] bg-blue-500 text-white"
          >
            {loadingBtn ? <Spinner /> : edit ? 'Cập nhật' : 'Xác nhận'}
          </Button>
        </div>
      </div>
    </div>
  )
}
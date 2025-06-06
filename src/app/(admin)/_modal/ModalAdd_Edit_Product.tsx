'use client';

import React, { useEffect, useState } from 'react'
import { Input, Button, Checkbox, Divider, Spinner } from "@nextui-org/react"

import InputTakeImg from '@/app/_util/ui/InputTakeImg';
import { uploadToCloudinary } from '@/app/_util/upload_img_cloudinary';
import { CreateProduct_API, UpdateProduct_API } from '@/app/_service/products';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { toast } from 'react-toastify';
import InputTextEditor from '@/app/_util/ui/InputTextEditer';
import { validateForm } from './js/validateFormAddProduct';
import InputCategoryteam from '../../components/ui/InputCategoryteam';
import { X, Package, DollarSign, Percent } from 'lucide-react';
import InputCategory from '@/app/components/ui/InputCategory';
import InputMateria from '@/app/components/ui/InputMateria';
import InputVariants from '@/app/components/ui/InputVariants';
import InputSize from '@/app/components/ui/inputSize';

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
  size: string;
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
  size: '',
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
        teamId: edit.team?.id || "",
        materialId: edit.material?.id || '',
        season: edit.season || '',
        jerseyType: edit.jerseyType || '',
        isFeatured: edit.isFeatured || false,
        description: edit.description || '',
        price: edit.price || 0,
        salePrice: edit.salePrice || 0,
        variants: edit.variants || [],
        materialList: [],
        size: '',
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
    console.log("value", value)
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
      <div className="bg-card rounded-xl p-8 z-10 w-[800px] max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {edit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
            </h2>
          </div>
          <button
            disabled={loadingBtn}
            onClick={handleClose}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors duration-200 text-muted-foreground hover:text-primary disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="font-medium mb-2 text-foreground">Hình ảnh sản phẩm</p>
          <InputTakeImg
            images={form.imageUrls || []}
            setImages={(value) => handleInputChange('imageUrls', value)}
            onChange={(value) => handleInputChange('imageUrls', value)}
            numberImg={10}
          />
          {errors.imageUrls && <p className="text-red-500 text-sm mt-1">{errors.imageUrls}</p>}
        </div>

        <Divider className="my-6" />

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
                label: "font-medium text-foreground",
                input: "text-foreground",
                inputWrapper: "bg-background"
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
                  <DollarSign className="w-4 h-4 text-default-400" />
                }
                classNames={{
                  label: "font-medium text-foreground",
                  input: "text-foreground",
                  inputWrapper: "bg-background"
                }}
              />
            </div>

            <div>
              <Input
                label="Giá khuyến mãi"
                labelPlacement="outside"
                type="number"
                name="salePrice"
                max={100}
                min={0}
                value={form.salePrice?.toString() || '0'}
                onChange={(e) => handleInputChange('salePrice', Number(e.target.value))}
                variant="bordered"
                startContent={
                  <Percent className="w-4 h-4 text-default-400" />
                }
                classNames={{
                  label: "font-medium text-foreground",
                  input: "text-foreground",
                  inputWrapper: "bg-background"
                }}
              />
            </div>
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
                label: "font-medium text-foreground",
                input: "text-foreground",
                inputWrapper: "bg-background"
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
            <InputCategoryteam
              setTeam={(value) => handleInputChange('teamId', value)}
              team={form.teamId?.toString() || ''}
            />
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
                label: "font-medium text-foreground",
                input: "text-foreground",
                inputWrapper: "bg-background"
              }}
            />
          </div>
          <InputSize
            setSize={(value) => handleInputChange('size', value)}
            size={form.size}
          />
        </div>

        {/* <div className="mt-6">
          <InputVariants
            variants={form.variants}
            setVariants={(value) => handleInputChange('variants', value)}
          />
          {errors.variants && <p className="text-red-500 text-sm mt-1">{errors.variants}</p>}
        </div> */}

        <div className="mt-6">
          <InputTextEditor
            value={form.description}
            onChange={(value) => handleInputChange('description', value)}
            height={500}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
       
        <div className="mt-6">
          <Checkbox
            isSelected={form.isFeatured}
            onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
            color="primary"
            size="lg"
            classNames={{
              label: "text-foreground"
            }}
          >
            Đánh dấu là sản phẩm nổi bật
          </Checkbox>
        </div>

        <Divider className="my-6" />

        <div className="flex justify-end gap-3">
          <Button
            onPress={handleClose}
            variant="bordered"
            size="lg"
            className="min-w-[120px] font-medium"
            isDisabled={loadingBtn}
          >
            Hủy
          </Button>
          <Button
            onPress={edit ? handleEdit : handleFinish}
            isLoading={loadingBtn}
            color="primary"
            size="lg"
            className="min-w-[120px] font-medium"
          >
            {loadingBtn ? <Spinner /> : edit ? 'Cập nhật' : 'Xác nhận'}
          </Button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          @apply bg-background rounded;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          @apply bg-border rounded hover:bg-muted transition-colors;
        }
      `}</style>
    </div>
  )
}
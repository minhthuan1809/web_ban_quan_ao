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

interface FormData {
  name: string;
  categoryId: string | number;
  imageUrls: any[];
  teamId: string | number;
  materialId: string | number;
  status: string;
  season: string;
  jerseyType: string;
  isFeatured: boolean;
  description: string;
  price: number;
  salePrice: number;
  variants: {
    size: string;
    priceAdjustment: number;
    stockQuantity: number;
    color: string[];
    useBasePrice?: boolean;
  }[];
  materialList: any[];
}

interface Variant {
  priceAdjustment: number;
  code: string;
  stockQuantity: number;
  sizeId: number;
  status: string;
  colorId: number;
}

const initialFormState: FormData = {
  name: '',
  categoryId: '',
  imageUrls: [],
  teamId: '1',
  materialId: '',
  status: 'ACTIVE',
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
        categoryId: edit.categoryId?.toString() || edit.category?.id?.toString() || '',
        imageUrls: edit.imageUrls || [],
        teamId: edit.team?.id || "",
        materialId: edit.materialId?.toString() || edit.material?.id?.toString() || '',
        status: edit.status || 'ACTIVE',
        season: edit.season || '',
        jerseyType: edit.jerseyType || '',
        isFeatured: edit.isFeatured || false,
        description: edit.description || '',
        price: edit.price || 0,
        salePrice: edit.salePrice || 0,
        variants: edit.variants ? edit.variants.map((v: any) => ({
          size: v.size?.id?.toString() || '',
          color: [v.color.id.toString()] ,   
          priceAdjustment: v.priceAdjustment || 0,
          stockQuantity: v.stockQuantity || 0,
          useBasePrice: false
        })) : [],
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
          const newUploadedImages = await uploadToCloudinary(newImages, process.env.NEXT_PUBLIC_FOLDER || "");
          uploadedImages = [...form.imageUrls.filter(img => typeof img === 'string'), ...newUploadedImages];
        } catch (error) {
          toast.error("Có lỗi khi tải lên hình ảnh. Vui lòng kiểm tra định dạng file.");
          throw error;
        }
      }

      const variants = [];
      if (form.variants.length > 0) {
        variants.push({
          size: form.variants[0].size,
          color: form.variants[0].color,
          priceAdjustment: 0,
          stockQuantity: 100,
          useBasePrice: true
        });
      }

      return {
        "name": form.name,
        "categoryId": Number(form.categoryId),
        "imageUrls": uploadedImages,
        "teamId": Number(form.teamId),
        "materialId": Number(form.materialId),
        "status": form.status,
        "season": form.season,
        "jerseyType": form.jerseyType,
        "isFeatured": form.isFeatured,
        "description": form.description,
        "price": form.price,
        "salePrice": form.salePrice,
        "variants": form.variants.map(v => ({
          priceAdjustment: v.priceAdjustment,
          code: `${form.name}-${v.size}-${v.color.join('-')}`.replace(/\s+/g, '-').toLowerCase(),
          stockQuantity: v.stockQuantity,
          sizeId: Number(v.size),
          status: form.status,
          colorId: Number(v.color[0])
        }))
      };
    } catch (error) {
      console.error("Error in callApiCloudinary:", error);
      throw error;
    }
  };

  const handleFinish = async () => {
    if (!validateForm(form, setErrors)) {
      const errorFields = Object.keys(errors).map(key => {
        switch(key) {
          case 'name': return 'Tên sản phẩm';
          case 'categoryId': return 'Danh mục';
          case 'imageUrls': return 'Hình ảnh';
          case 'materialId': return 'Chất liệu';
          case 'season': return 'Mùa giải';
          case 'jerseyType': return 'Loại áo';
          case 'description': return 'Mô tả';
          case 'price': return 'Giá';
          case 'variants': return 'Biến thể sản phẩm';
          default: return key;
        }
      });
      toast.error(`Vui lòng điền đầy đủ thông tin: ${errorFields.join(', ')}`);
      return;
    }
    try {
      setLoadingBtn(true)
      const data = await callApiCloudinary();
      
      if (!accessToken) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        return;
      }
      
      const response = await CreateProduct_API(data, accessToken);
      
      if (response.status === 200) {
        toast.success("Thêm sản phẩm thành công");
        handleClose();
        refetch();
      } else {
        toast.error("Có lỗi xảy ra khi thêm sản phẩm");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm sản phẩm");
      console.error(error);
    } finally {
      setLoadingBtn(false);
    }
  }

  const handleEdit = async () => {
    if (!validateForm(form, setErrors)) {
      const errorFields = Object.keys(errors).map(key => {
        switch(key) {
          case 'name': return 'Tên sản phẩm';
          case 'categoryId': return 'Danh mục';
          case 'imageUrls': return 'Hình ảnh';
          case 'materialId': return 'Chất liệu';
          case 'season': return 'Mùa giải';
          case 'jerseyType': return 'Loại áo';
          case 'description': return 'Mô tả';
          case 'price': return 'Giá';
          case 'variants': return 'Biến thể sản phẩm';
          default: return key;
        }
      });
      toast.error(`Vui lòng điền đầy đủ thông tin: ${errorFields.join(', ')}`);
      return;
    }
    try {
      setLoadingBtn(true)
      const data = await callApiCloudinary();
      
      if (!accessToken) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        return;
      }
      
      const response = await UpdateProduct_API(edit.id, data, accessToken);
      if (response.status === 200) {
        toast.success("Cập nhật sản phẩm thành công");
        handleClose();
        refetch();
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật sản phẩm");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
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
                size="lg"
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
        </div>
       <div className='mt-4'>
       <InputVariants
            variants={form.variants}
            setVariants={(value) => handleInputChange('variants', value)}
            basePrice={form.price}
          />
       </div>

      
   
        <div className="mt-6">
          <InputTextEditor
            value={form.description}
            onChange={(value) => handleInputChange('description', value)}
            height={500}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
       
        <div className="mt-4 flex gap-4">
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
            <Checkbox
              isSelected={form.status === 'ACTIVE'}
              onChange={(e) => handleInputChange('status', e.target.checked ? 'ACTIVE' : 'INACTIVE')}
              color="primary"
              size="lg"
              classNames={{
                label: "text-foreground"
              }}
            >
           {form.status === 'ACTIVE' ? 'Kích hoạt' : 'Không kích hoạt'}
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
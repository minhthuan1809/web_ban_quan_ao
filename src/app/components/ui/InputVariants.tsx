import React, { useState, useEffect, useCallback } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import FormatPrice from "@/app/_util/FormatPrice";
import InputSize from "./inputSize";
import { Checkbox, Input } from "@nextui-org/react";
import { NumberInput } from "@tremor/react";
import InputColor from "./InputColor";
import { GetAllColor_API } from "@/app/_service/color";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { toast } from "react-toastify";

interface Variant {
  size: string;
  priceAdjustment: number;
  stockQuantity: number;
  color: string[];
  useBasePrice?: boolean;
}

interface Errors {
  size?: string;
  priceAdjustment?: string;
  stockQuantity?: string;
  color?: string;
}

interface Color {
  id: number;
  name: string;
  hexColor: string;
}

export default function InputVariants({
  variants,
  setVariants,
  basePrice = 0
}: {
  variants: Variant[];
  setVariants: (variants: Variant[]) => void;
  basePrice: number;
}) {

  
  const [showModal, setShowModal] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<Variant>({
    size: "",
    priceAdjustment: 0,
    stockQuantity: 0,
    color: [],
    useBasePrice: false
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [colorList, setColorList] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuthInfor();

  const fetchColors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await GetAllColor_API("", 1, accessToken);
      if (res && res.data) {
        setColorList(res.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể tải danh sách màu sắc");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!currentVariant.size) {
      newErrors.size = "Vui lòng chọn kích cỡ";
    }

    if (currentVariant.stockQuantity <= 0) {
      newErrors.stockQuantity = "Số lượng phải lớn hơn 0";
    }

    if (currentVariant.priceAdjustment <= 0) {
      newErrors.priceAdjustment = "Điều chỉnh giá phải lớn hơn 0";
    }

    if (!currentVariant.color || currentVariant.color.length === 0) {
      newErrors.color = "Vui lòng chọn ít nhất một màu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddVariant = () => {
    if (!validateForm()) {
      return;
    }

    if (editingIndex !== null) {
      const newVariants = [...variants];
      newVariants[editingIndex] = currentVariant;
      setVariants(newVariants);
      setEditingIndex(null);
    } else {
      setVariants([...variants, currentVariant]);
    }
    setCurrentVariant({
      size: "",
      priceAdjustment: 0,
      stockQuantity: 0,
      color: [],
      useBasePrice: false
    });
    setErrors({});
  };

  const handleEdit = (index: number) => {
    const variantToEdit = variants[index];
    setCurrentVariant({
      ...variantToEdit,
      size: variantToEdit.size.toString()
    });
    setEditingIndex(index);
    setShowModal(true);
    setErrors({});
  };

  const handleDelete = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleSelectSize = (size: string) => {
    setCurrentVariant({ ...currentVariant, size: size });
    setErrors({ ...errors, size: undefined });
  };

  const handleSelectColor = (color: string[]) => {
    setCurrentVariant({ ...currentVariant, color: color });
    setErrors({ ...errors, color: undefined });
  };

  // Hàm để lấy thông tin màu từ ID
  const getColorInfo = (colorId: string) => {
    const color = colorList.find(c => c.id.toString() === colorId);
    return color || null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium">Chọn kích cỡ sản phẩm</h3>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            setEditingIndex(null);
            setCurrentVariant({
              size: "",
              priceAdjustment: 0,
              stockQuantity: 0,
              color: [],
              useBasePrice: false
            });
            setErrors({});
            setShowModal(true);
          }}>
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Size
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Màu sắc
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Điều chỉnh giá
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Số lượng
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {variants.map((variant, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">{variant.size}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {variant.color && variant.color.map((colorId, idx) => {
                      const colorInfo = getColorInfo(colorId);
                      return (
                        <div key={idx} className="flex items-center gap-1">
                          {colorInfo ? (
                            <>
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: colorInfo.hexColor }}
                              ></div>
                              <span className="text-xs">{colorInfo.name}</span>
                            </>
                          ) : (
                            <span className="text-xs">{colorId}</span>
                          )}
                        </div>
                      );
                    })}
                    {(!variant.color || variant.color.length === 0) && (
                      <span className="text-gray-400 text-xs">Chưa chọn màu</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <FormatPrice
                    price={variant.priceAdjustment}
                    className="text-red-500 text-sm"
                  />
                </td>
                <td className="px-4 py-3">{variant.stockQuantity}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-500 hover:text-blue-700">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {variants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                  Chưa có kích cỡ nào được thêm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold">
                {editingIndex !== null
                  ? "Sửa kích cỡ"
                  : "Thêm kích cỡ mới và màu "}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingIndex(null);
                  setErrors({});
                }}
                className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col">
                <InputSize
                  setSize={(value) => handleSelectSize(value)}
                  size={currentVariant.size}
                />
                {errors.size && (
                  <span className="text-red-500 text-sm">{errors.size}</span>
                )}
              </div>

              <div className="flex flex-col">
                <Input
                  type="number"
                  label="Điều chỉnh giá"
                  placeholder="Nhập giá điều chỉnh"
                  value={currentVariant.priceAdjustment.toString()}
                  variant="bordered"
                  labelPlacement="outside"
                  size="lg"
                  isInvalid={!!errors.priceAdjustment}
                  errorMessage={errors.priceAdjustment}
                  classNames={{
                    label: "font-medium text-foreground",
                    input: "text-foreground",
                    inputWrapper: "bg-background"
                  }}
                  onChange={(e) => {
                    setCurrentVariant({
                      ...currentVariant,
                      priceAdjustment: Number(e.target.value),
                      useBasePrice: false
                    });
                    setErrors({ ...errors, priceAdjustment: undefined });
                  }}
                />
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    isSelected={currentVariant.useBasePrice}
                    onChange={(e) => {
                      setCurrentVariant({ 
                        ...currentVariant, 
                        useBasePrice: e.target.checked,
                        priceAdjustment: e.target.checked ? basePrice : 0 
                      });
                    }}
                  />
                  <span className="text-sm">Theo giá gốc ({basePrice.toLocaleString('vi-VN')}đ)</span>
                </div>
              </div>

              <div className="flex flex-col">
                <Input
                  type="number"
                  label="Số lượng"
                  placeholder="Nhập số lượng"
                  value={currentVariant.stockQuantity.toString()}
                  variant="bordered"
                  labelPlacement="outside"
                  size="lg"
                  isInvalid={!!errors.stockQuantity}
                  errorMessage={errors.stockQuantity}
                  classNames={{
                    label: "font-medium text-foreground",
                    input: "text-foreground",
                    inputWrapper: "bg-background"
                  }}
                  onChange={(e) => {
                    setCurrentVariant({
                      ...currentVariant,
                      stockQuantity: Number(e.target.value),
                    });
                    setErrors({ ...errors, stockQuantity: undefined });
                  }}
                />
              </div>
              
              <div className="flex flex-col">
                <InputColor
                  setColor={(value) => handleSelectColor(value)}
                  color={currentVariant.color}
                />
                {errors.color && (
                  <span className="text-red-500 text-sm">{errors.color}</span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingIndex(null);
                  setErrors({});
                }}
                className="px-4 py-2 text-red-500 hover:bg-red-50 rounded">
                Hủy
              </button>
              <button
                onClick={() => {
                  if (validateForm()) {
                    handleAddVariant();
                    setShowModal(false);
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                {editingIndex !== null ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

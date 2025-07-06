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
  sizeId?: number | string;
  colorId?: number | string;
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
      const res = await GetAllColor_API("", 1, accessToken || "");
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

    // Kiểm tra trùng size và màu
    const isDuplicate = variants.some((variant, index) => {
      // Bỏ qua variant đang edit
      if (editingIndex === index) return false;
      
      return variant.size === currentVariant.size && 
             variant.color.some(color => currentVariant.color.includes(color));
    });

    if (isDuplicate) {
      newErrors.size = "Biến thể với size và màu này đã tồn tại";
      toast.error("Biến thể với size và màu này đã tồn tại");
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
    
    // Xử lý trường hợp khi edit sản phẩm
    const size = variantToEdit.sizeId ? variantToEdit.sizeId.toString() : variantToEdit.size;
    const colors = variantToEdit.colorId 
      ? [variantToEdit.colorId.toString()]
      : Array.isArray(variantToEdit.color) 
        ? variantToEdit.color.map(c => c.toString())
        : [];

    setCurrentVariant({
      ...variantToEdit,
      size: size,
      color: colors,
      priceAdjustment: variantToEdit.priceAdjustment || 0,
      stockQuantity: variantToEdit.stockQuantity || 0,
      useBasePrice: variantToEdit.useBasePrice || false
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

  // Thêm useEffect để fetch colors khi component mount hoặc khi có variant được edit
  useEffect(() => {
    if (showModal) {
      fetchColors();
    }
  }, [showModal, fetchColors]);

  // Thêm useEffect để kiểm tra và cập nhật color list khi có variant được edit
  useEffect(() => {
    if (editingIndex !== null && variants[editingIndex]) {
      const variant = variants[editingIndex];
      if (variant.color && variant.color.length > 0) {
        // Đảm bảo colorList có đủ các màu cần thiết
        const missingColors = variant.color.filter(colorId => 
          !colorList.some(c => c.id.toString() === colorId.toString())
        );
        if (missingColors.length > 0) {
          fetchColors();
        }
      }
    }
  }, [editingIndex, variants, colorList]);

  

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium text-foreground">Biến thể sản phẩm</h3>
        <button
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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

      <div className="border border-divider rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-content2">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground/80">
                Size
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground/80">
                Màu sắc
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground/80">
                Điều chỉnh giá
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground/80">
                Số lượng
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground/80">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {variants.map((variant, index) => (
              <tr key={index} className="hover:bg-content2 transition-colors">
                <td className="px-4 py-3 text-foreground">{variant.size}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {variant.color && variant.color.map((colorId, idx) => {
                      const colorInfo = getColorInfo(colorId);
                      return (
                        <div key={idx} className="flex items-center gap-1.5 bg-content3 px-2 py-1 rounded-full">
                          {colorInfo ? (
                            <>
                              <div 
                                className="w-3 h-3 rounded-full ring-1 ring-default-200" 
                                style={{ backgroundColor: colorInfo.hexColor }}
                              ></div>
                              <span className="text-xs text-foreground">{colorInfo.name}</span>
                            </>
                          ) : (
                            <span className="text-xs text-foreground/60">{colorId}</span>
                          )}
                        </div>
                      );
                    })}
                    {(!variant.color || variant.color.length === 0) && (
                      <span className="text-foreground/40 text-xs">Chưa chọn màu</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <FormatPrice
                    price={variant.priceAdjustment}
                    className="text-danger text-sm"
                  />
                </td>
                <td className="px-4 py-3 text-foreground">{variant.stockQuantity}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-primary hover:text-primary/80 transition-colors">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-danger hover:text-danger/80 transition-colors">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {variants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center text-foreground/40">
                  Chưa có biến thể nào được thêm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background rounded-xl p-6 w-[800px] shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {editingIndex !== null ? "Sửa biến thể" : "Thêm biến thể mới"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingIndex(null);
                  setErrors({});
                }}
                className="text-foreground/60 hover:text-foreground transition-colors">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <InputSize
                  setSize={(value) => handleSelectSize(value)}
                  size={currentVariant.size}
                />
                {errors.size && (
                  <span className="text-danger text-sm">{errors.size}</span>
                )}
              </div>

              <div className="space-y-2">
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

              </div>

              <div className="space-y-2">
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
              
              <div className="space-y-1">
                <InputColor
                  setColor={(value) => handleSelectColor(value)}
                  color={currentVariant.color}
                />
                {errors.color && (
                  <span className="text-danger text-sm">{errors.color}</span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingIndex(null);
                  setErrors({});
                }}
                className="px-4 py-2 text-danger hover:bg-danger/10 rounded-lg transition-colors">
                Hủy
              </button>
              <button
                onClick={() => {
                  if (validateForm()) {
                    handleAddVariant();
                    setShowModal(false);
                  }
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                {editingIndex !== null ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

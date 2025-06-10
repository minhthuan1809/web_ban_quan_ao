import React, { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import FormatPrice from "@/app/_util/FormatPrice";
import InputSize from "./inputSize";
import { Input } from "@nextui-org/react";
import { NumberInput } from "@tremor/react";
interface Variant {
  size: string;
  priceAdjustment: number;
  stockQuantity: number;
}

interface Errors {
  size?: string;
  priceAdjustment?: string;
  stockQuantity?: string;
}

export default function InputVariants({
  variants,
  setVariants,
}: {
  variants: Variant[];
  setVariants: (variants: Variant[]) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<Variant>({
    size: "",
    priceAdjustment: 0,
    stockQuantity: 0,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Errors>({});

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
    });
    setErrors({});
  };

  const handleEdit = (index: number) => {
    setCurrentVariant(variants[index]);
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
                  placeholder="Nhập giá điều chỉnh"
                  value={currentVariant.priceAdjustment.toString()}
                  variant="bordered"
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
                    });
                    setErrors({ ...errors, priceAdjustment: undefined });
                  }}
                />
                {errors.priceAdjustment && (
                  <span className="text-red-500 text-sm">
                    {errors.priceAdjustment}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-medium">Số lượng</label>
                <input
                  type="number"
                  className={`border rounded px-3 py-2 ${
                    errors.stockQuantity ? "border-red-500" : ""
                  }`}
                  placeholder="Nhập số lượng"
                  value={currentVariant.stockQuantity}
                  onChange={(e) => {
                    setCurrentVariant({
                      ...currentVariant,
                      stockQuantity: Number(e.target.value),
                    });
                    setErrors({ ...errors, stockQuantity: undefined });
                  }}
                />
                {errors.stockQuantity && (
                  <span className="text-red-500 text-sm">
                    {errors.stockQuantity}
                  </span>
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

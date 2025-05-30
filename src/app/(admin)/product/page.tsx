"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Input, 
  Button, 
  Chip, 
  Tooltip,
} from "@nextui-org/react";
import { Eye, Trash2, Search, Plus, Edit, Filter } from 'lucide-react';
import { deleteProduct_API, getProducts_API } from '@/app/_service/products';
import { Product } from './typeProduct';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { toast } from 'react-toastify';
import ModalAdd_Edit_Product from '../_modal/ModalAdd_Edit_Product';

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefetch, setIsRefetch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { accessToken } = useAuthInfor();

  useEffect(() => {
    getProducts_API("", 1, 10, "", "").then((res) => {
      setProducts(res.data);
    });
  }, [isRefetch]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = (product: Product) => {
    deleteProduct_API(product.id, accessToken).then((res) => {
      if(res.status === 204){
        toast.success("Xóa sản phẩm thành công");
        setIsRefetch(prev => !prev);
      }else{
        toast.error("Xóa sản phẩm thất bại");
      }
    });
  }

  return (
    <div className="p-6 max-w-full mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Danh Sách Sản Phẩm
        </h1>
        
        {/* Search and Actions Bar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                startContent={<Search className="w-4 h-4 text-gray-500" />}
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" w-80"
                variant="bordered"
                size="md"
              />
            </div>
          
          </div>
          
          <Button 
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            className="bg-blue-500 font-medium text-white"
            onPress={() => setIsOpen(true)}
          >
            Thêm Mới
          </Button>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-600 mb-4">
          Hiển thị {filteredProducts.length} sản phẩm
        </p>
      </div>

      {/* Table Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
          <div className="col-span-5">Tên Sản Phẩm</div>
          <div className="col-span-2 text-center">Giá</div>
          <div className="col-span-2 text-center">Số Lượng</div>
          <div className="col-span-2 text-center">Trạng Thái</div>
          <div className="col-span-1 text-center">Hành Động</div>
        </div>

        {/* Product Rows */}
        <div className="divide-y divide-gray-100">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors">
                {/* Product Info */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-12 h-12 relative flex-shrink-0">
                    <Image
                      src={product.imageUrls?.[0]?.startsWith('http') ? product.imageUrls[0] : '/images/no-image.png'}
                      alt={product.name}
                      fill
                      className="object-cover rounded-lg"
                      onError={(e: any) => {
                        e.target.src = '/images/no-image.png';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 mb-1 truncate">
                      {product?.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <Chip size="sm" variant="flat" color="default">
                        {product?.category?.name}
                      </Chip>
                      <span className="text-gray-500">ID: {product.id}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {product?.description || "Mô tả sản phẩm..."}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="text-center">
                    {product?.salePrice ? (
                      <div>
                        <div className="line-through text-gray-400 text-sm">
                          {product.price.toLocaleString()} đ
                        </div>
                        <div className="text-red-500 font-semibold">
                          {product.salePrice.toLocaleString()} đ
                        </div>
                      </div>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        {product.price.toLocaleString()} đ
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className="font-medium text-gray-900">
                    {product.variants.reduce((total, variant) => total + variant.stockQuantity, 0)}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center justify-center">
                  <Chip 
                    color={product.isDeleted ? "danger" : "success"} 
                    variant="flat"
                    size="sm"
                    className="text-xs"
                  >
                    {product.isDeleted ? "Ngừng bán" : "Hoạt Động"}
                  </Chip>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="flex gap-1">
                    <Tooltip content="Chỉnh sửa">
                      <Button 
                        isIconOnly 
                        variant="light" 
                        color="primary"
                        size="sm"
                        className="w-8 h-8 text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Xem chi tiết">
                      <Button 
                        isIconOnly 
                        variant="light" 
                        color="default"
                        size="sm"
                        className="w-8 h-8 text-green-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Xóa">
                      <Button 
                        isIconOnly 
                        variant="light" 
                        color="danger"
                        size="sm"
                        className="w-8 h-8 text-red-600"
                        onPress={() => handleDeleteProduct(product)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Không tìm thấy sản phẩm nào
            </div>
          )}
        </div>
        <ModalAdd_Edit_Product
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Thêm sản phẩm"
          handleFinish={() => {}}
          loadingBtn={false}
        />
      </div>
    </div>
  );
}
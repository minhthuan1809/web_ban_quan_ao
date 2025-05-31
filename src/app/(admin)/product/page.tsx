"use client";
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { deleteProduct_API, getProducts_API } from '@/app/_service/products';
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import RenderProductTable from './RenderProductTable';
import ModalAdd_Edit_Product from '../_modal/ModalAdd_Edit_Product';

export default function ProductPage() {
  const { accessToken } = useAuthInfor()
  const [products, setProducts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sort, setSort] = useState("createdAt")
  const [filter, setFilter] = useState("all")
  const [isRefetch, setIsRefetch] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts_API("", page, limit, sort, filter)

        if (response.status === 200) {
          setProducts(response.data.data)
        } else {
          toast.error("Đã có lỗi xảy ra !")
        }
      } catch (error) {
        toast.error("Đã có lỗi xảy ra !")
      } finally {
        setLoading(false);
      }
    }
    const timeout = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => clearTimeout(timeout)
  }, [page, limit, sort, filter, isRefetch])

  const handleDeleteProduct = async (product: any) => {
    try {
      if (!product?.imageUrls?.length) {
        toast.error("Không tìm thấy ảnh sản phẩm");
        return;
      }

      // xóa ảnh trên severs
      for (const imageUrl of product.imageUrls) {
        if (typeof imageUrl === 'string') {
          const matches = imageUrl.match(/\/v\d+\/(.*?)\/([^/]+)$/);
          if (!matches) {
            console.error("Invalid image URL format:", imageUrl);
            continue;
          }
          const folder = matches[1];
          const publicId = matches[2].split('.')[0];
          const response = await fetch("/api/cloudinary", {
            method: "DELETE",
            body: JSON.stringify({ id: publicId, folder: folder }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || 'Failed to delete image');
          }
        }
      }

      const deleteRes = await deleteProduct_API(product.id, accessToken);
      if (deleteRes.status === 204) {
        toast.success("Xóa sản phẩm thành công")
        setIsRefetch(prev => !prev)
      } else {
        toast.error("Xóa sản phẩm thất bại")
      }

    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Danh Sách Sản Phẩm
              </h1>
              <p className="text-gray-600 text-sm">Quản lý sản phẩm của bạn</p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm Mới
            </button>
          </div>
        </div>
      </div>

      <RenderProductTable
        products={products}
        loading={loading}
        handleDeleteProduct={handleDeleteProduct}
        setIsOpen={setIsOpen}
      />

      {/* Modal placeholder */}
      {isOpen && (
        <ModalAdd_Edit_Product isOpen={isOpen} onClose={() => setIsOpen(false)} refetch={() => setIsRefetch(prev => !prev)} />
      )}
    </div>
  );
}
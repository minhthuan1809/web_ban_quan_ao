"use client";
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { deleteProduct_API, getProducts_API } from '@/app/_service/products';
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import RenderProductTable from './RenderProductTable';

export default function ProductPage() {
  const {accessToken} = useAuthInfor()
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
        
        if(response.status === 200){
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

  const handleDeleteProduct = (product: any) => {
    deleteProduct_API(product.id, accessToken).then((res) => {
      if(res.status === 204){
        toast.success(res.message)
        setIsRefetch(prev => !prev)
      } else {
        toast.error(res.message)
      }
    })
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Thêm sản phẩm</h3>
            <p className="text-gray-600 mb-4">Modal thêm sản phẩm sẽ được implement ở đây</p>
            <button 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
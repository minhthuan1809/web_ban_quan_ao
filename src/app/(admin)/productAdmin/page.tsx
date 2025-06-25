"use client";
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { deleteProduct_API, getProducts_API } from '@/app/_service/products';
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import RenderProductTable from './RenderProductTable';
import ModalAdd_Edit_Product from '../_modal/ModalAdd_Edit_Product';
import { ProductSkeleton } from '../_skeleton';

export default function ProductPage() {
  const { accessToken } = useAuthInfor()
  const [products, setProducts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(30)
  const [isRefetch, setIsRefetch] = useState(false)
  const [edit, setEdit] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [totalPage, setTotalPage] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts_API(searchTerm, page, limit, {})
        
        if (response.status === 200) {
          // Đảm bảo dữ liệu được xử lý đúng cách trước khi hiển thị
          const processedData = response.data.data.map((product: any) => {
            // Đảm bảo tất cả các đối tượng phức tạp được chuyển đổi thành chuỗi khi cần hiển thị
            return {
              ...product,
              // Xử lý các trường có thể gây lỗi React khi hiển thị
              categoryName: product.category?.name || 'Không có',
              materialName: product.material?.name || 'Không có',
              teamName: product.team?.name || 'Không có',
              // Đảm bảo biến thể được xử lý đúng
              variants: Array.isArray(product.variants) ? product.variants.map((variant: any) => {
                return {
                  ...variant,
                  size: variant.size || '',
                  color: variant.color || ''
                };
              }) : []
            };
          });
          
          setProducts(processedData.reverse())
          setTotalPage((response.data as any).metadata?.total_page || 1)
        } else {
          toast.error("Đã có lỗi xảy ra !")
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        toast.error("Đã có lỗi xảy ra khi tải dữ liệu!")
      } finally {
        setLoading(false);
      }
    }
    const timeout = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => clearTimeout(timeout)
  }, [page, limit, isRefetch, searchTerm])

  const handleDeleteProduct = async (product: any) => {
    try {
      if (!product?.imageUrls?.length) {
        toast.error("Không tìm thấy ảnh sản phẩm");
        return;
      }
      const deleteRes = await deleteProduct_API(product.id, accessToken || "");
      if (deleteRes.status === 204) {
        toast.success("Xóa sản phẩm thành công")
        setIsRefetch(prev => !prev)
      } else {
        toast.error("Xóa sản phẩm thất bại")
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
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                Danh Sách Sản Phẩm
              </h1>
              <p className="text-muted-foreground text-sm">Quản lý sản phẩm của bạn</p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              Thêm Mới
            </button>
          </div>
        </div>
      </div>

      {/* Render Product Table */}
      <RenderProductTable
        products={products}
        loading={loading}
        handleDeleteProduct={handleDeleteProduct}
        setIsOpen={setIsOpen}
        setEdit={setEdit}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        totalPage={totalPage}
        onChangePage={setPage}
        currentPage={page}
      />

      {/* Modal placeholder */}
      {isOpen && (
        <ModalAdd_Edit_Product isOpen={isOpen} onClose={() => setIsOpen(false)} refetch={() => setIsRefetch(prev => !prev)} edit={edit} setEdit={setEdit}/>
      )}
    </div>
  );
}
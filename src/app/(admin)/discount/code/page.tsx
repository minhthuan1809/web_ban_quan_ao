'use client'
import { deleteCoupon_API, disableCoupon_API, enableCoupon_API, GetAllCode_API } from '@/app/_service/discount';
import React, { useEffect, useState } from 'react'
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination, Spinner, Switch } from "@nextui-org/react";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Pencil, Trash, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import ModalAddEditDiscount from './ModalAddEditDiscount';
import showConfirmDialog from '@/app/_util/Sweetalert2';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { DiscountSkeleton } from '../../_skeleton';
  
interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumAmount: number;
  maximumDiscount: number;
  usageLimit: number;
  maxUsageCount: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  userSpecific: boolean;
  userIds: number[];
  createdAt: string;
  updatedAt: string;
}



export default function Code() {
  const { accessToken } = useAuthInfor();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
<<<<<<< HEAD
  const [total, setTotal] = useState<number>(1);
=======
  const [total, setTotal] = useState<number>(0);
>>>>>>> f0c633c967f0243bc80136c41a5c34cb4db6afa3
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);  
  const [reload, setReload] = useState<boolean>(false);
  useEffect(() => {
    if (editCoupon) {
      setIsOpen(true);
    }
  }, [editCoupon]);

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditCoupon(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!accessToken) return;
        
        setLoading(true);
        const res = await GetAllCode_API(searchQuery, page, accessToken);
        if (res && res.content) {
          setCoupons(res.content);
          setTotal(res.totalPages || 1);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu mã giảm giá:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reload, accessToken, searchQuery, page]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  const formatDiscountValue = (type: string, value: number) => {
    return type === 'PERCENTAGE' ? `${value}%` : `${value.toLocaleString('vi-VN')}đ`;
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    
    const result = await showConfirmDialog({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa mã giảm giá này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })  
    if (result.isConfirmed) {
      try {
        const res = await deleteCoupon_API(id, accessToken);
        if (res.status === 200) {
          toast.success("Xóa mã giảm giá thành công");
          setReload(!reload);
        }
      } catch (error) {
        console.error("Lỗi khi xóa mã giảm giá:", error);
      }
    }
  }

  const handleToggle = async (id: number, isActive: boolean) => {
    if (!accessToken) return;
    
    if (isActive) {
      const res = await disableCoupon_API(id, accessToken);
      if (res.status === 200) {
        toast.success("Vô hiệu hóa mã giảm giá thành công");
        setReload(!reload);
      }
    } else {
      const res = await enableCoupon_API(id, accessToken);
      if (res.status === 200) {
        toast.success("Kích hoạt mã giảm giá thành công");
        setReload(!reload);
      }
    }
  }
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border mb-4 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            color="primary"
            className="h-[40px] font-medium w-full sm:w-auto"
            startContent={<Plus size={18} />}
            onClick={() => {
              setIsOpen(true)
              setEditCoupon(null)
            }}
          >
            Thêm mã giảm giá
          </Button>
        </div>
      </div>

      {loading ? (
      <DiscountSkeleton />
      ) : (
        <>
      
          <Table aria-label="Danh sách mã giảm giá" className="mb-6">
            <TableHeader>
              <TableColumn className='text-center'>Mã</TableColumn>
              <TableColumn className='text-center'>Tên</TableColumn>
              <TableColumn className='text-center'>Giá trị</TableColumn>
              <TableColumn className='text-center'>Hiệu lực</TableColumn>
              <TableColumn className='text-center'>Đã dùng</TableColumn>
              <TableColumn className='text-center'>Trạng thái</TableColumn>
              <TableColumn className='text-center'>Thao tác</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Không có mã giảm giá nào">
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className='text-center' onClick={() => {
                    navigator.clipboard.writeText(coupon.code); 
                    toast.success("Đã copy mã giảm giá");
                  }}>{coupon.code}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{coupon.name}</p>
                      <p className="text-sm text-gray-500">{coupon.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className=''>
                    <div>
                      <p >{formatDiscountValue(coupon.discountType, coupon.discountValue)}</p>
                      {coupon.minimumAmount > 0 && (
                        <p className="text-xs text-gray-500">Tối thiểu: {coupon.minimumAmount.toLocaleString('vi-VN')}đ</p>
                      )}
                      {coupon.maximumDiscount > 0 && (
                        <p className="text-xs text-gray-500">Tối đa: {coupon.maximumDiscount.toLocaleString('vi-VN')}đ</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className="text-sm">
                      <p>Từ: {formatDate(coupon.validFrom)}</p>
                      <p>Đến: {formatDate(coupon.validTo)}</p>
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <p>{coupon.usedCount}/{coupon.maxUsageCount || "∞"}</p>
                  </TableCell>
                  <TableCell className='text-center'>
                  <Switch
                    isSelected={coupon.isActive}
                    onValueChange={() => handleToggle(coupon.id , coupon.isActive)}
                  />
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className="flex gap-2 justify-center items-center">
                      <Button 
                        size="sm" 
                        isIconOnly 
                        className="bg-blue-500 text-white rounded-md"
                        onPress={() => setEditCoupon(coupon)}
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button 
                        size="sm" 
                        isIconOnly 
                        className="bg-red-500 text-white rounded-md"
                        onPress={() => handleDelete(coupon.id)}
                      >
                        <Trash size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {total > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={total}
                page={page + 1}
                onChange={(newPage) => setPage(newPage - 1)}
                classNames={{
                  wrapper: "gap-0 overflow-visible h-8 rounded border border-divider",
                }}
              />
            </div>
          )}
        </>
      )}
      <ModalAddEditDiscount 
        isOpen={isOpen}
        onClose={handleCloseModal}
        initialData={editCoupon}
        onSuccess={() => {
          setReload(!reload);
        }}
      />
    </div>
  )
}

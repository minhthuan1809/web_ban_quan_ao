'use client'
import { GetAllCode_API } from '@/app/_service/discount';
import React, { useEffect, useState } from 'react'
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination, Spinner } from "@nextui-org/react";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Pencil, Trash } from 'lucide-react';
import TitleSearchAdd from '@/app/components/ui/TitleSearchAdd';
import Loading from '@/app/_util/Loading';
import { toast } from 'react-toastify';
import ModalAddEditDiscount from './ModalAddEditDiscount';
  
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

interface PaginatedResponse {
  content: Coupon[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export default function Code() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await GetAllCode_API(searchQuery , page);
        console.log(res);
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
  }, []);

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

  return (
    <div className="p-6">
          <TitleSearchAdd 
          title={{
            title: "Quản lý mã giảm giá",
            search: "Tìm kiếm mã giảm giá...",
            btn: "Thêm mã giảm giá"
          }}
            onSearch={(value) => setSearchQuery(value)}
            onAdd={() => {
              setIsOpen(true)
            }}
        />

      {loading ? (
      <Loading />
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
                    <Chip 
                      color={coupon.isActive ? "success" : "danger"}
                      variant="flat"
                    >
                      {coupon.isActive ? "Đang hoạt động" : "Đã vô hiệu"}
                    </Chip>
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
                page={page}
                onChange={setPage}
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
        onClose={() => setIsOpen(false)}
        initialData={editCoupon}
      />
    </div>
  )
}

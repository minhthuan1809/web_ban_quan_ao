"use client"
import useAuthInfor from '@/app/customHooks/AuthInfor';
import React, { useEffect, useState } from 'react'
import { getOrderById_API } from '@/app/_service/Oder';
import { Pagination } from '@nextui-org/react';
import OrderLoader from './OrderLoader';
import OrderTabs from './OrderTabs';
import OrderItem from './OrderItem';


interface OrderItem {
  id: number;
  variantId: number;
  productName: string;
  variantInfo: {
    sizeName: string;
    colorName: string;
    productCode: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: number;
}

interface Order {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  code: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingDistrict: string;
  shippingWard: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethodId: number;
  paymentMethodName: string;
  paymentStatus: string;
  couponCode: string | null;
  note: string;
  createdAt: number;
  updatedAt: number;
  orderItems: OrderItem[];
}

const statusMap = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  SHIPPED: { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  DELIVERED: { label: 'Đã giao hàng', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function HistoryOrderPage() {
  const { userInfo } = useAuthInfor() || { userInfo: { id: 0 } };
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        if (userInfo.id) {
          const res = await getOrderById_API(userInfo.id);
          if (res?.data) {
            setOrders(res.data);
            setTotal(res.data.totalPages);
          } else {
            setOrders([]);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo.id]);

  // Lọc đơn hàng theo trạng thái
  const filteredOrders = React.useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => {
      switch(activeTab) {
        case 'pending': return order.status === 'PENDING';
        case 'processing': return order.status === 'PROCESSING';
        case 'shipped': return order.status === 'SHIPPED';
        case 'delivered': return order.status === 'DELIVERED';
        case 'cancelled': return order.status === 'CANCELLED';
        default: return true;
      }
    });
  }, [orders, activeTab]);

  // Cấu hình tabs
  const orderTabs = [
    { id: 'all', label: 'Tất cả đơn hàng', count: orders?.length || 0 },
    { id: 'pending', label: 'Chờ xác nhận', count: orders?.filter(o => o.status === 'PENDING')?.length || 0 },
    { id: 'processing', label: 'Đang xử lý', count: orders?.filter(o => o.status === 'PROCESSING')?.length || 0 },
    { id: 'shipped', label: 'Đang giao hàng', count: orders?.filter(o => o.status === 'SHIPPED')?.length || 0 },
    { id: 'delivered', label: 'Đã giao hàng', count: orders?.filter(o => o.status === 'DELIVERED')?.length || 0 },
    { id: 'cancelled', label: 'Đã hủy', count: orders?.filter(o => o.status === 'CANCELLED')?.length || 0 },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  if (loading) {
    return <OrderLoader />;
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
        <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
      </div>
      
      <OrderTabs
       tabs={orderTabs} activeTab={activeTab} onTabChange={handleTabChange} />
      
      {!filteredOrders?.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy đơn hàng nào {activeTab !== 'all' ? 'ở trạng thái này' : ''}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderItem key={order.id} order={order} statusMap={statusMap} />
          ))}
        </div>
      )}
      
      {total > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            total={total}
            page={page}
            onChange={setPage}
            classNames={{
              wrapper: "gap-0 overflow-visible h-8 rounded-xl border border-divider",
              item: "w-8 h-8 text-small rounded-none bg-transparent",
              cursor: "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold",
            }}
          />
        </div>
      )}
    </div>
  );
}
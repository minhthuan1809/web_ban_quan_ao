"use client"
import useAuthInfor from '@/app/customHooks/AuthInfor';
import React, { useEffect, useState } from 'react'
import { createOrder_API, getHistoryOrderVnpay_API, getOrderById_API } from '@/app/_service/Oder';
import { Pagination } from '@nextui-org/react';
import OrderLoader from './OrderLoader';
import OrderTabs from './OrderTabs';
import OrderItem from './OrderItem';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';

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
  const { user: userInfo, accessToken } = useAuthInfor();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
const params = useSearchParams();


useEffect(() => {

  const url = window.location.href;
  const limit = params.get('vnp_ResponseCode') ;
  if(limit === '00'){
    const createOrder = async () => {
      const data = sessionStorage.getItem('tempOrderData');
      if(data){
        const res = await createOrder_API(JSON.parse(data), Number(userInfo?.id), accessToken)      
        if(res.status === 200){
          const resVnpay = await getHistoryOrderVnpay_API(accessToken, true , res.data.id, url)
          sessionStorage.removeItem('tempOrderData');
        }
      }
    }
    createOrder();
  }
}, [params]);

useEffect(() => {
      const fetchOrders = async (showLoading: boolean) => {
        try {
          if (showLoading) setLoading(true);
          setError(null);
          
          if (!userInfo?.id) {
            setError('Không tìm thấy thông tin người dùng');
            return;
          }

          if (!accessToken) {
            setError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            return;
          }

          const res = await getOrderById_API(userInfo.id, accessToken);
        
        if (res.status === 200) {
          if (res.data) {
            let ordersData = res.data;
            if (res.data.content && Array.isArray(res.data.content)) {
              ordersData = res.data.content;
              setTotal(res.data.totalPages || 1);
            } else if (Array.isArray(res.data)) {
              ordersData = res.data;
              setTotal(1);
            } else {
              ordersData = [];
            }
            
            setOrders(ordersData);
          } else {
            setOrders([]);
          }
        } else {
          setError(`API trả về lỗi: ${res.status} ${res.statusText}`);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
          toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        } else if (error.response?.status === 404) {
          setError('Không tìm thấy đơn hàng nào');
          setOrders([]);
        } else if (error.response?.status >= 500) {
          setError('Lỗi máy chủ, vui lòng thử lại sau');
          toast.error('Lỗi máy chủ, vui lòng thử lại sau');
        } else {
          setError(error.message || 'Có lỗi xảy ra khi tải đơn hàng');
          toast.error('Có lỗi xảy ra khi tải đơn hàng');
        }
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (userInfo?.id && accessToken) {
      fetchOrders(true);
      
      // Thiết lập interval để gọi API mỗi 2 giây
      const intervalId = setInterval(() => {
        fetchOrders(false);
      }, 2000);
      
      // Xóa interval khi component unmount
      return () => clearInterval(intervalId);
    } else {
      setLoading(false);
      if (!userInfo) {
        setError('Vui lòng đăng nhập để xem lịch sử đơn hàng');
      }
    }
  }, [userInfo?.id, accessToken]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200/60 dark:border-gray-600/60 shadow-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Lịch sử đơn hàng</h1>
          <p className="text-gray-600 dark:text-gray-400">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>

      
        
        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 rounded-xl p-6 max-w-md mx-auto backdrop-blur-sm">
              <div className="text-red-600 dark:text-red-400 text-lg font-bold mb-2">Có lỗi xảy ra</div>
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : (
          <>
            <OrderTabs
             tabs={orderTabs} activeTab={activeTab} onTabChange={handleTabChange} />
            
            {!filteredOrders?.length ? (
              <div className="text-center py-12">
                <div className="bg-white/80 dark:bg-gray-800/80   dark:border-gray-600/60 max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Chưa có đơn hàng</h3>
                  <p className="text-gray-500 dark:text-gray-400">Không tìm thấy đơn hàng nào {activeTab !== 'all' ? 'ở trạng thái này' : ''}</p>
                </div>
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
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-200/60 dark:border-gray-600/60 shadow-lg">
                  <Pagination
                    total={total}
                    page={page + 1}
                    onChange={(newPage) => setPage(newPage - 1)}
                    classNames={{
                      wrapper: "gap-0 overflow-visible h-10 rounded-xl border-2 border-gray-200 dark:border-gray-600",
                      item: "w-10 h-10 text-sm rounded-none bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                      cursor: "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg text-white font-bold",
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
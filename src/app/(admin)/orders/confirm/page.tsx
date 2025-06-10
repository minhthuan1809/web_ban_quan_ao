"use client"
import { getOrder_API, updateOrderStatus_API } from '@/app/_service/Oder';
import { ShoppingBag, Eye } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns';
import TitleSearchAdd from '@/app/components/ui/TitleSearchAdd';
import Loading from '@/app/_util/Loading';
import { Pagination } from '@nextui-org/react';


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

// Định nghĩa các trạng thái đơn hàng và tên hiển thị tiếng Việt
const ORDER_STATUSES = {
  PENDING: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-800' },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  SHIPPING: { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-800' },
  DELIVERED: { label: 'Đã giao hàng', color: 'bg-purple-100 text-purple-800' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  REFUNDED: { label: 'Đã hoàn tiền', color: 'bg-orange-100 text-orange-800' }
};

// Định nghĩa luồng xử lý đơn hàng và các trạng thái tiếp theo có thể có
const ORDER_FLOW = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING'],
  PROCESSING: ['SHIPPING'],
  SHIPPING: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
};

export default function Page() {    
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const fetchOrders = useCallback(async () => {
    try {
      const res = await getOrder_API(page, searchQuery);
      setOrders(res.data.content.reverse());
      setTotal(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Đặt orders là mảng rỗng khi có lỗi
    } finally {
      setLoading(false);
    }
  }, [page , searchQuery]); 

  useEffect(() => {
    fetchOrders();
    
    // Thiết lập interval để gọi lại API mỗi 2 giây
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 2000);
    
    // Xóa interval khi component unmount
    return () => clearInterval(intervalId);
  }, []);

  const toggleOrderDetails = (orderId: number) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'dd/MM/yyyy HH:mm');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await updateOrderStatus_API(orderId, newStatus);
      
      // Cập nhật trạng thái đơn hàng trong state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Ẩn dropdown
      setShowStatusDropdown(null);
      
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const toggleStatusDropdown = (orderId: number) => {
    if (showStatusDropdown === orderId) {
      setShowStatusDropdown(null);
    } else {
      setShowStatusDropdown(orderId);
    }
  };

  // Lấy các trạng thái tiếp theo có thể có dựa trên trạng thái hiện tại
  const getNextPossibleStatuses = (currentStatus: string) => {
    return ORDER_FLOW[currentStatus as keyof typeof ORDER_FLOW] || [];
  };

  return (
    <div className='mx-auto px-4 py-8'>
       <TitleSearchAdd
          title={{
            title: "Quản lý đơn hàng",
            search: "Tìm kiếm đơn hàng...",
          }}
          onSearch={(value) => setSearchQuery(value)}
          onAdd={() => {}}  
        />

        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className="text-center py-10">Không có đơn hàng nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders?.map((order) =>{
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{order.customerName}</div>
                          <div className="text-xs">{order.customerEmail}</div>
                          <div className="text-xs">{order.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.label || order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => toggleOrderDetails(order.id)}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {expandedOrder === order.id ? 'Ẩn' : 'Xem'}
                            </button>
                            <div className="relative">
                             
                              
                              {showStatusDropdown === order.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                  {/* Chỉ hiển thị các trạng thái tiếp theo có thể có */}
                                  {getNextPossibleStatuses(order.status).map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => handleUpdateStatus(order.id, status)}
                                      disabled={updatingOrderId === order.id}
                                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                        updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${ORDER_STATUSES[status as keyof typeof ORDER_STATUSES].color.split(' ')[0]}`}></span>
                                      {ORDER_STATUSES[status as keyof typeof ORDER_STATUSES].label}
                                    </button>
                                  ))}
                                  
                                  {/* Hiển thị thông báo nếu không có trạng thái tiếp theo */}
                                  {getNextPossibleStatuses(order.status).length === 0 && (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                      Không có trạng thái tiếp theo
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="font-medium text-gray-900 mb-2">Thông tin đơn hàng</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm"><span className="font-medium">Địa chỉ:</span> {order.shippingAddress}</p>
                                  <p className="text-sm"><span className="font-medium">Quận/Huyện:</span> {order.shippingDistrict}</p>
                                  <p className="text-sm"><span className="font-medium">Phường/Xã:</span> {order.shippingWard}</p>
                                </div>
                                <div>
                                  <p className="text-sm"><span className="font-medium">Phương thức thanh toán:</span> {order.paymentMethodName}</p>
                                  <p className="text-sm"><span className="font-medium">Trạng thái thanh toán:</span> {order.paymentStatus === 'PENDING' ? 'Chưa thanh toán' : 'Đã thanh toán'}</p>
                                  <p className="text-sm"><span className="font-medium">Ghi chú:</span> {order.note || 'Không có'}</p>
                                </div>
                              </div>
                              
                              <h3 className="font-medium text-gray-900 mb-2">Sản phẩm</h3>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thông tin</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {order.orderItems.map((item) => (
                                      <tr key={item.id}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{item.productName}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                          <p>Mã: {item.variantInfo.productCode}</p>
                                          <p>Màu: {item.variantInfo.colorName}</p>
                                          <p>Kích cỡ: {item.variantInfo.sizeName}</p>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.totalPrice)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div className="mt-4 text-right">
                                <p className="text-sm"><span className="font-medium">Tổng tiền hàng:</span> {formatCurrency(order.subtotal)}</p>
                                <p className="text-sm"><span className="font-medium">Giảm giá:</span> {formatCurrency(order.discountAmount)}</p>
                                <p className="text-base font-bold"><span>Tổng thanh toán:</span> {formatCurrency(order.totalAmount)}</p>
                              </div>
                              
                              <div className="mt-4 flex flex-wrap gap-2 justify-end">
                                {/* Các nút trạng thái tiếp theo có thể có */}
                                {getNextPossibleStatuses(order.status).map((status) => (
                                  <button 
                                    key={status}
                                    onClick={() => handleUpdateStatus(order.id, status)}
                                    disabled={updatingOrderId === order.id}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                      ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]?.color || 'bg-gray-100 text-gray-800'
                                    } hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
                                  >
                                    {ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]?.label || status}
                                  </button>
                                ))}
                                
                              
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                    )
                 })}
              </tbody>
          
            </table>
           {
            total > 1 && (
              <div className='flex justify-center mt-4'>
              <Pagination
                   total={total}
                   page={page}
                   onChange={(page: number) => {
                     setPage(page);
                   }}
                 />
              </div>
            )
           }
          </div>
        )}
    </div>
  );
}

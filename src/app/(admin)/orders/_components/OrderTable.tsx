"use client"

import { exportOrderPDF_API, getOrder_API, updateOrderStatus_API } from '@/app/_service/Oder';
import { Eye, PackageX } from 'lucide-react'
import React, { useCallback, useEffect, useState, useMemo, Fragment } from 'react'
import { format } from 'date-fns';
import Loading from '@/app/_util/Loading';
import { Pagination, Tabs, Tab, Select, SelectItem } from '@nextui-org/react';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import type { AdminOrder as Order, AdminOrderItem as OrderItem, AdminOrderTableProps as OrderTableProps } from '../../../../types/order';  
import { formatOrderStatus } from "@/app/_util/FomatVietNamese";
import { useAdminSearchStore } from '@/app/_zustand/admin/SearchStore';



// Định nghĩa các trạng thái đơn hàng và tên hiển thị tiếng Việt
export const ORDER_STATUSES = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-warning/20 text-warning-600' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-primary/20 text-primary-600' },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-secondary/20 text-secondary-600' },
  SHIPPING: { label: 'Đang giao hàng', color: 'bg-info/20 text-info-600' },
  DELIVERED: { label: 'Đã giao hàng', color: 'bg-success/20 text-success-600' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-danger/20 text-danger-600' },
  NOT_RECEIVED: { label: 'Khách không nhận', color: 'bg-warning/20 text-warning-600' },
  RECEIVED: { label: 'Đã thành công', color: 'bg-success/20 text-success-600' }
};

// Định nghĩa luồng xử lý đơn hàng và các trạng thái tiếp theo có thể có
const ORDER_FLOW = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', ],
  PROCESSING: ['SHIPPING', ],
  SHIPPING: ['DELIVERED', ],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
  RECEIVED: []
};

// Component hiển thị trạng thái đơn hàng
const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusInfo = formatOrderStatus(status);
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: status === 'PENDING' ? '#ff9900' : 
             status === 'CONFIRMED' ? '#0066cc' : 
             status === 'PROCESSING' ? '#6120a2' : 
             status === 'SHIPPING' ? '#0091ff' : 
             status === 'DELIVERED' ? '#00aa55' : 
             status === 'NOT_RECEIVED' ? '#ff3300' : 
             status === 'RECEIVED' ? '#00aa55' : 
             status === 'CANCELLED' ? '#ff3300' : '#333333'
    }}>
      {statusInfo.label}
    </span>
  );
};



    export default function OrderTable({ showStatusActions = true, mode, filter = [] }: OrderTableProps) {    
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Default filter options if none provided

  const { accessToken } = useAuthInfor();
  const { search: searchQuery } = useAdminSearchStore();

  const fetchOrders = useCallback(async (loading = true) => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(loading);
    try {
      const res = await getOrder_API(page, searchQuery, accessToken);
      
      setTotal(res.data.totalPages);
      
      if (!res.data?.content || res.data?.content.length === 0) {
        setOrders([]);
        return;
      }
      
      let filteredOrders = res.data.content;

      // Lọc đơn hàng dựa trên mode
      if (mode === 'history') {
        // Chỉ hiển thị đơn hàng đã giao hoặc đã hủy
        filteredOrders = filteredOrders.filter((order: Order) => 
          order.status === 'DELIVERED' || 
          order.status === 'CANCELLED' ||
          order.status === 'REFUNDED' ||
          order.status === 'NOT_RECEIVED' ||
          order.status === 'RECEIVED'
        );
      } else if (mode === 'confirm') {
        // Hiển thị đơn hàng đang trong quá trình xử lý
        filteredOrders = filteredOrders.filter((order: Order) => 
          order.status === 'PENDING' || 
          order.status === 'CONFIRMED' || 
          order.status === 'PROCESSING' ||
          order.status === 'SHIPPING'
        );
      }

      setOrders(filteredOrders.reverse());
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, accessToken, mode]); 

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(true);
    }, accessToken ? 100 : 1000); // Wait longer if no token
    return () => clearTimeout(timer);
  }, [page, mode, searchQuery, accessToken]);


  // chứ 2000 call api 1 lần 
  useEffect(() => {
    if (!accessToken) return; // Don't start interval without token
    
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchOrders, accessToken]);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'dd/MM/yyyy HH:mm');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    if (!showStatusActions) return;
    
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus_API(orderId, newStatus, accessToken);
      await fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getNextPossibleStatuses = (currentStatus: string): string[] => {
    return ORDER_FLOW[currentStatus as keyof typeof ORDER_FLOW] || [];
  };

  // Lọc đơn hàng theo trạng thái
  const filteredOrders = useMemo(() => {
    if (selectedStatus === "ALL") return orders;
    return orders.filter(order => order.status === selectedStatus);
  }, [orders, selectedStatus]);

  // Tạo các SelectItem trước khi render
  const renderSelectItems = () => {
    const items = [];
    items.push(<SelectItem key="ALL" value="ALL">Tất cả đơn hàng</SelectItem>);
    
    for (const status of filter) {
      items.push(
        <SelectItem key={status} value={status}>
          {formatOrderStatus(status).label || status}
        </SelectItem>
      );
    }
    
    return items;
  };

  return (
    <div className='mx-auto px-2 sm:px-4 py-4 sm:py-8'>
      {loading ? (
        <Loading />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <PackageX className="w-16 h-16 mb-3 text-gray-300" />
          <div className="text-lg font-semibold">Không có đơn hàng nào</div>
          <div className="text-sm text-gray-400">Hãy thêm đơn hàng mới để bắt đầu quản lý!</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <Select
              size="sm"
              label="Trạng thái đơn hàng"
              placeholder="Chọn trạng thái"
              className="max-w-xs"
              selectedKeys={[selectedStatus]}
              onSelectionChange={(keys) => setSelectedStatus(Array.from(keys)[0] as string)}
            >
              {renderSelectItems()}
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            {/* Bảng cho màn hình lớn */}
            <div className="hidden md:block">
              <table className="min-w-full bg-background border border-divider rounded-lg">
                <thead className="bg-content1">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground/50 uppercase tracking-wider">Mã đơn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground/50 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground/50 uppercase tracking-wider">Ngày tạo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground/50 uppercase tracking-wider">Tổng tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground/50 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground/50 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-content1 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{order.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/80">
                          <div>{order.customerName}</div>
                          <div className="text-xs text-foreground/60">{order.customerEmail}</div>
                          <div className="text-xs text-foreground/60">{order.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/80">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/50">
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>

                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4">
                            <div className="bg-content2 p-4 rounded-lg">
                              <h3 className="font-medium text-foreground mb-2">Thông tin đơn hàng</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-foreground/80"><span className="font-medium">Địa chỉ:</span> {order.shippingAddress}</p>
                                  <p className="text-sm text-foreground/80"><span className="font-medium">Quận/Huyện:</span> {order.shippingDistrict}</p>
                                  <p className="text-sm text-foreground/80"><span className="font-medium">Phường/Xã:</span> {order.shippingWard}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-foreground/80"><span className="font-medium">Phương thức thanh toán:</span> {order.paymentMethodName}</p>
                                  <p className="text-sm text-foreground/80"><span className="font-medium">Trạng thái thanh toán:</span> {order.paymentStatus === 'PENDING' ? 'Chưa thanh toán' : 'Đã thanh toán'}</p>
                                  <p className="text-sm text-foreground/80"><span className="font-medium">Ghi chú:</span> {order.note || 'Không có'}</p>
                                </div>
                              </div>
                              
                              <h3 className="font-medium text-foreground mb-2">Sản phẩm</h3>
                              <table className="min-w-full divide-y divide-divider">
                                <thead className="bg-content1">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-foreground/50 uppercase">Sản phẩm</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-foreground/50 uppercase">Thông tin</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-foreground/50 uppercase">Đơn giá</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-foreground/50 uppercase">Số lượng</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-foreground/50 uppercase">Thành tiền</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.orderItems.map((item) => (
                                    <tr key={item.id}>
                                      <td className="px-4 py-2 text-sm text-foreground-900">{item.productName}</td>
                                      <td className="px-4 py-2 text-sm text-foreground-500">
                                        <p>Mã: {item.variantInfo.productCode}</p>
                                        <p>Màu: {item.variantInfo.colorName}</p>
                                        <p>Kích cỡ: {item.variantInfo.sizeName}</p>
                                      </td>
                                      <td className="px-4 py-2 text-sm text-foreground-900">{formatCurrency(item.unitPrice)}</td>
                                      <td className="px-4 py-2 text-sm text-foreground-900">{item.quantity}</td>
                                      <td className="px-4 py-2 text-sm text-foreground-900">{formatCurrency(item.totalPrice)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                              <div className="mt-4 text-right">
                                <p className="text-sm"><span className="font-medium">Tổng tiền hàng:</span> {formatCurrency(order.subtotal)}</p>
                                <p className="text-sm"><span className="font-medium">Giảm giá:</span> {formatCurrency(order.discountAmount)}</p>
                                <p className="text-base font-bold"><span>Tổng thanh toán:</span> {formatCurrency(order.totalAmount)}</p>
                              </div>

                              {showStatusActions && mode === 'confirm' && (
                                <div className="mt-4 flex flex-wrap gap-2 justify-end">
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
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Giao diện cho mobile */}
            <div className="md:hidden space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">Mã đơn: {order.code}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  
                  <div className="border-t border-gray-100 pt-2 mb-2">
                    <p className="text-sm"><span className="font-medium">Khách hàng:</span> {order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                    <p className="text-xs text-gray-500">{order.customerEmail}</p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                    <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Eye className="w-4 h-4" /> Chi tiết
                    </button>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h3 className="font-medium text-gray-900 mb-2">Thông tin đơn hàng</h3>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm"><span className="font-medium">Địa chỉ:</span> {order.shippingAddress}</p>
                        <p className="text-sm"><span className="font-medium">Quận/Huyện:</span> {order.shippingDistrict}</p>
                        <p className="text-sm"><span className="font-medium">Phường/Xã:</span> {order.shippingWard}</p>
                        <p className="text-sm"><span className="font-medium">Phương thức thanh toán:</span> {order.paymentMethodName}</p>
                        <p className="text-sm"><span className="font-medium">Trạng thái thanh toán:</span> {order.paymentStatus === 'PENDING' ? 'Chưa thanh toán' : 'Đã thanh toán'}</p>
                        <p className="text-sm"><span className="font-medium">Ghi chú:</span> {order.note || 'Không có'}</p>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2">Sản phẩm</h3>
                      <div className="space-y-3">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="border border-gray-100 rounded p-2">
                            <p className="font-medium">{item.productName}</p>
                            <div className="text-xs text-gray-500 mb-1">
                              <p>Mã: {item.variantInfo.productCode}</p>
                              <p>Màu: {item.variantInfo.colorName}, Kích cỡ: {item.variantInfo.sizeName}</p>
                            </div>
                            <div className="flex justify-between text-sm">
                              <p>{formatCurrency(item.unitPrice)} x {item.quantity}</p>
                              <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Tổng tiền hàng:</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Giảm giá:</span>
                          <span>{formatCurrency(order.discountAmount)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-gray-100 text-foreground pt-1 mt-1">
                          <span>Tổng thanh toán:</span>
                          <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                      </div>

                      {showStatusActions && mode === 'confirm' && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-end">
                          {getNextPossibleStatuses(order.status).map((status : string ) => (
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
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {total > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  total={total}
                  page={page + 1}
                  onChange={(page) => setPage(page - 1)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
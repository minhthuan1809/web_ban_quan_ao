"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import { format } from 'date-fns';
import ModalEvaluate from '../_modal/ModalEvaluate';
import { exportOrderPDF_API, updateOrderStatus_API } from '@/app/_service/Oder';
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';

interface OrderItemProps {
  order: any;
  statusMap: Record<string, { label: string; color: string }>;
}



export default function OrderItem({ order, statusMap }: OrderItemProps) {
  const { accessToken } = useAuthInfor();
  const formatDate = (timestamp: number) => format(new Date(timestamp), 'dd/MM/yyyy HH:mm');
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const [isOpen, setIsOpen] = useState(false);
  const [isExportingInvoice, setIsExportingInvoice] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleExportInvoice = async (id: number) => {
    if (isExportingInvoice) return; // Prevent multiple clicks
    
    setIsExportingInvoice(true);
    try {
      const res: any = await exportOrderPDF_API(id);
      
      
      // Check if response has data property or is direct URL/Blob
      const url = res?.data || res;
      if (url) {
        window.open(url, '_blank');
      } else {
        console.error('No URL found in response');
      }
    } catch (error) {
      console.error('Error exporting invoice:', error);
    } finally {
      setIsExportingInvoice(false);
    }
  }

  const handleUpdateOrderStatus = async (newStatus: string) => {
    if (isUpdatingStatus) return; // Prevent multiple clicks
    
    setIsUpdatingStatus(true);
    try {
      const res = await updateOrderStatus_API(order.id, newStatus, accessToken);
      if (res.status === 200) {
        let statusMessage = "";
        switch(newStatus) {
          case 'NOT_RECEIVED':
            statusMessage = "Không nhận hàng";
            break;
          case 'RECEIVED':
            statusMessage = "Đã thành công";
            break;
          default:
            statusMessage = newStatus;
        }
        toast.success(`Cập nhật trạng thái đơn hàng thành ${statusMessage}`);
      } else {
        toast.error('Cập nhật trạng thái đơn hàng thất bại');
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

    return (
    <div className="bg-content1 rounded-2xl shadow-sm border border-divider overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="bg-default-100 px-6 py-4 border-b border-divider">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="font-semibold text-foreground">#{order.code}</h3>
              <span style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: order.status === 'PENDING' ? '#ff9900' : 
                       order.status === 'CONFIRMED' ? '#0066cc' : 
                       order.status === 'PROCESSING' ? '#6120a2' : 
                       order.status === 'SHIPPING' ? '#0091ff' : 
                       order.status === 'DELIVERED' ? '#00aa55' : 
                       order.status === 'NOT_RECEIVED' ? '#ff3300' : 
                       order.status === 'RECEIVED' ? '#00aa55' : 
                       order.status === 'CANCELLED' ? '#ff3300' : '#333333'
              }}>
                {statusMap[order.status as keyof typeof statusMap]?.label || order.status}
              </span>
            </div>
            <p className="text-sm text-foreground/60">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">{formatCurrency(order.totalAmount)}</p>
              <p className="text-sm text-foreground/60">{order.orderItems.length} sản phẩm</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Items */}
      <div className="p-6">
        <div className="space-y-4">
          {order.orderItems.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-default-100 rounded-xl">
              <div className="w-16 h-16 bg-content1 rounded-lg flex items-center justify-center border border-divider flex-shrink-0 overflow-hidden">
                {item.productImages && item.productImages.length > 0 ? (
                  <img 
                    src={item.productImages[0]} 
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-foreground/60 font-mono">{item.variantInfo.productCode}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productSlug}`} className="font-medium text-foreground hover:text-primary truncate block">
                  {item.productName}
                </Link>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-foreground/60">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-default-300"></div>
                    {item.variantInfo.colorName}
                  </span>
                  <span>Size: {item.variantInfo.sizeName}</span>
                  <span>SL: {item.quantity}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-foreground">{formatCurrency(item.unitPrice || 0)}</p>
                {item.quantity > 1 && (
                  <p className="text-sm text-foreground/60">x{item.quantity}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-default-100 px-6 py-4 border-t border-divider">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex-1 space-y-1 text-sm text-foreground/60">
            <p><span className="font-medium text-foreground">Thanh toán:</span> {order.paymentMethodName}</p>
            <p><span className="font-medium text-foreground">Địa chỉ:</span> {order.shippingAddress}, {order.shippingWard}, {order.shippingDistrict}</p>
            {order.note && <p><span className="font-medium text-foreground">Ghi chú:</span> {order.note}</p>}
          </div>
          <div className="lg:text-right space-y-1">
            <div className="flex justify-between lg:justify-end lg:gap-8 text-sm">
              <span className="text-foreground/60">Tạm tính:</span>
              <span className="font-medium text-foreground">
                {formatCurrency(order.orderItems.reduce((total: number, item: any) => total + (item.unitPrice * item.quantity), 0))}
              </span>
            </div>
            {order.orderItems.some((item: any) => item.productSalePrice > 0) && (
              <div className="flex justify-between lg:justify-end lg:gap-8 text-sm">
                <span className="text-foreground/60">
                  Giảm giá sản phẩm ({order.orderItems.map((item: any) => item.productSalePrice > 0 ? `${item.productName}: ${item.productSalePrice}%` : '').filter(Boolean).join(', ')}):
                </span>
                <span className="font-medium text-danger">
                  -{formatCurrency(order.orderItems.reduce((total: number, item: any) => {
                    const itemTotal = item.unitPrice * item.quantity;
                    const saleDiscount = item.productSalePrice > 0 ? itemTotal * (item.productSalePrice / 100) : 0;
                    return total + saleDiscount;
                  }, 0))}
                </span>
              </div>
            )}
            {order.coupon && (
              <div className="flex justify-between lg:justify-end lg:gap-8 text-sm">
                <span className="text-foreground/60">Mã giảm giá ({order.coupon.discountValue}%):</span>
                <span className="font-medium text-danger">
                  -{formatCurrency(order.orderItems.reduce((total: number, item: any) => {
                    const itemTotal = item.unitPrice * item.quantity;
                    // Tính giá sau khi trừ giảm giá sản phẩm
                    const afterSalePrice = item.productSalePrice > 0 
                      ? itemTotal * (1 - item.productSalePrice / 100) 
                      : itemTotal;
                    // Áp dụng mã giảm giá lên giá đã giảm
                    return total + (afterSalePrice * (order.coupon?.discountValue / 100));
                  }, 0))}
                </span>
              </div>
            )}
            <div className="flex justify-between lg:justify-end lg:gap-8 text-base font-bold border-t border-divider pt-2">
              <span className="text-foreground">Tổng cộng:</span>
              <span className="text-primary">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Các nút khi trạng thái là DELIVERED */}
        {order.status.toUpperCase().trim() === 'DELIVERED' && (
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <button 
              onClick={() => handleUpdateOrderStatus('RECEIVED')}
              disabled={isUpdatingStatus}
              className={`inline-flex items-center px-4 py-2 bg-success hover:bg-success-600 text-white rounded-lg transition-colors duration-200 ${
                isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUpdatingStatus ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Đã nhận hàng
                </>
              )}
            </button>
            <button 
              onClick={() => handleUpdateOrderStatus('NOT_RECEIVED')}
              disabled={isUpdatingStatus}
              className={`inline-flex items-center px-4 py-2 bg-warning hover:bg-warning-600 text-white rounded-lg transition-colors duration-200 ${
                isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUpdatingStatus ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Không nhận hàng
                </>
              )}
            </button>
          </div>
        )}

        {/* Các nút khi trạng thái là RECEIVED */}
        {order.status.toUpperCase().trim() === 'RECEIVED' && (
          <>
            {(!order.isReviewed) && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setIsOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-warning hover:bg-warning-600 text-warning-foreground rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Đánh giá đơn hàng
                </button>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => handleExportInvoice(order.id)}
                disabled={isExportingInvoice}
                className={`inline-flex items-center px-4 py-2 text-danger-foreground rounded-lg transition-colors duration-200 ${
                  isExportingInvoice 
                    ? 'bg-default-200 cursor-not-allowed' 
                    : 'bg-danger hover:bg-danger-600'
                }`}
              >
                {isExportingInvoice ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-danger-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Xuất hóa đơn
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
        <ModalEvaluate isOpen={isOpen} onClose={() => setIsOpen(false)} dataOrder={order} />
    </div>
  );
} 
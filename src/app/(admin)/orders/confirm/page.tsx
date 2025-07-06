"use client"
import OrderTable from '../_components/OrderTable';

export default function ConfirmOrderPage() {
  const ORDER_STATUSES = {
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-primary/20 text-primary-600' },
    PENDING: { label: 'Chờ xác nhận', color: 'bg-warning/20 text-warning-600' },
    PROCESSING: { label: 'Đang xử lý', color: 'bg-secondary/20 text-secondary-600' },
    SHIPPING: { label: 'Đang giao hàng', color: 'bg-info/20 text-info-600' },
  };
  return <OrderTable 
    showStatusActions={true} 
    mode="confirm" 
    filter={Object.keys(ORDER_STATUSES)} 
    />;
}








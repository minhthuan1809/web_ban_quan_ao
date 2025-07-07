"use client"
import OrderTable from '../../orders/_components/OrderTable';
 const ORDER_STATUSES = {
    DELIVERED: { label: 'Đã giao hàng', color: 'bg-success/20 text-success-600' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-danger/20 text-danger-600' },
    SHIPPING: { label: 'Đang giao hàng', color: 'bg-info/20 text-info-600' },
    NOT_RECEIVED: { label: 'Khách không nhận', color: 'bg-warning/20 text-warning-600' },
  };
export default function OrderHistoryPage() {
    return <OrderTable showStatusActions={false} mode="history" filter={Object.keys(ORDER_STATUSES)} />;
}

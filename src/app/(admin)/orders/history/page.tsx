"use client"
import OrderTable from '../../orders/_components/OrderTable';

export default function OrderHistoryPage() {
    return <OrderTable title="Lịch sử đơn hàng" showStatusActions={false} mode="history" />;
}

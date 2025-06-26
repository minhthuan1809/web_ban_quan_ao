"use client"
import OrderTable from '../../orders/_components/OrderTable';

export default function OrderHistoryPage() {
    return <OrderTable showStatusActions={false} mode="history" />;
}

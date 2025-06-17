"use client"
import OrderTable from '../_components/OrderTable';

export default function ConfirmOrderPage() {
  return <OrderTable title="Xác nhận đơn hàng" showStatusActions={true} mode="confirm" />;
}

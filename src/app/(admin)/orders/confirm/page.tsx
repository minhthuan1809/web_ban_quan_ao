"use client"
import OrderTable from '../_components/OrderTable';

export default function ConfirmOrderPage() {
  return <OrderTable 
    showStatusActions={true} 
    mode="confirm" 
    />;
}

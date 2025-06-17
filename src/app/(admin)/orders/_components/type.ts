 export interface OrderItem {
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
  
  export interface Order {
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

  export interface OrderTableProps {
    title: string;
    showStatusActions?: boolean;
    mode: 'history' | 'confirm';
  }
import { Product, ProductVariant } from './product';
import { AuthUser } from './auth';

// Order Status Enums
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipping' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export type PaymentMethod = 
  | 'cash_on_delivery' 
  | 'bank_transfer' 
  | 'credit_card' 
  | 'e_wallet';

// Order Item Types
export interface OrderItem {
  id: number;
  productId: string;
  variantId: number;
  quantity: number;
  price: number;
  totalPrice: number;
  product?: Product;
  variant?: ProductVariant;
  createdAt: number;
  updatedAt: number;
}

// Shipping Address
export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  district: string;
  ward: string;
  city: string;
  note?: string;
}

// Order Types
export interface Order {
  id: string;
  userId: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  
  // Pricing
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  
  // Items and Details
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  note?: string;
  
  // Discount Info
  discountCode?: string;
  discountAmount?: number;
  
  // Tracking
  trackingNumber?: string;
  
  // Relations
  user?: AuthUser;
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
  confirmedAt?: number;
  shippedAt?: number;
  deliveredAt?: number;
  cancelledAt?: number;
}

// Order Table Props for Admin
export interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onViewDetails: (order: Order) => void;
}

// Order Statistics
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

// Order Filter and Search
export interface OrderFilter {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  paymentMethod?: PaymentMethod[];
  dateRange?: {
    start: string;
    end: string;
  };
  minAmount?: number;
  maxAmount?: number;
  userId?: number;
}

export interface OrderSearchParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: OrderFilter;
}

export interface OrderResponse {
  data: Order[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats?: OrderStats;
}

// Create Order Types
export interface CreateOrderData {
  items: {
    productId: string;
    variantId: number;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  note?: string;
  discountCode?: string;
}

export interface UpdateOrderData {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  note?: string;
}

// Admin-specific Order interfaces (different structure from main Order)
export interface AdminOrderItem {
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

export interface AdminOrder {
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
  orderItems: AdminOrderItem[];
}

export interface AdminOrderTableProps {
  showStatusActions?: boolean;
  mode: 'history' | 'confirm';
  title?: string;
  filter?: string[];
} 
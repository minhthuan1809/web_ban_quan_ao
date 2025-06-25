import { AuthUser } from './auth';

// Discount Types
export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping';
export type DiscountStatus = 'active' | 'inactive' | 'expired' | 'used_up';
export type DiscountTarget = 'all' | 'category' | 'product' | 'user_group';

// Main Discount Interface
export interface Discount {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: DiscountType;
  value: number; // percentage (0-100) or fixed amount
  
  // Usage Limits
  maxUses?: number;
  usedCount: number;
  maxUsesPerUser?: number;
  
  // Conditions
  minOrderValue?: number;
  maxDiscountAmount?: number;
  
  // Target Rules
  target: DiscountTarget;
  targetIds?: number[]; // category ids, product ids, or user group ids
  
  // Validity
  status: DiscountStatus;
  startDate: number;
  endDate: number;
  
  // Settings
  isPublic: boolean; // can be found by users or only by code
  allowCombineWithOther: boolean;
  
  // Metadata
  createdBy: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  
  // Relations
  creator?: AuthUser;
  usageHistory?: DiscountUsage[];
  
  // Computed fields
  isValid?: boolean;
  remainingUses?: number;
  usageRate?: number;
}

// Discount Usage Tracking
export interface DiscountUsage {
  id: number;
  discountId: number;
  userId: number;
  orderId: string;
  discountAmount: number;
  orderValue: number;
  usedAt: number;
  
  // Relations
  user?: AuthUser;
  discount?: Discount;
}

// Discount Validation Result
export interface DiscountValidation {
  isValid: boolean;
  error?: string;
  discountAmount?: number;
  finalAmount?: number;
}

// API Types
export interface DiscountFilter {
  status?: DiscountStatus[];
  type?: DiscountType[];
  target?: DiscountTarget[];
  isPublic?: boolean;
  createdBy?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  usageRate?: {
    min: number;
    max: number;
  };
}

export interface DiscountSearchParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: DiscountFilter;
}

export interface DiscountResponse {
  data: Discount[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats?: DiscountStats;
}

// Discount Statistics
export interface DiscountStats {
  totalDiscounts: number;
  activeDiscounts: number;
  expiredDiscounts: number;
  totalUsages: number;
  totalDiscountAmount: number;
  averageDiscountRate: number;
  topDiscounts: {
    id: number;
    code: string;
    usageCount: number;
    totalAmount: number;
  }[];
}

// Create/Update Discount Types
export interface CreateDiscountData {
  code: string;
  name: string;
  description?: string;
  type: DiscountType;
  value: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  target: DiscountTarget;
  targetIds?: number[];
  startDate: number;
  endDate: number;
  isPublic: boolean;
  allowCombineWithOther: boolean;
}

export interface UpdateDiscountData extends Partial<CreateDiscountData> {
  status?: DiscountStatus;
}

// Apply Discount Types
export interface ApplyDiscountRequest {
  code: string;
  orderValue: number;
  userId?: number;
  items?: {
    productId: string;
    categoryId: number;
    quantity: number;
    price: number;
  }[];
}

export interface ApplyDiscountResponse {
  isValid: boolean;
  discount?: Discount;
  discountAmount: number;
  finalAmount: number;
  message?: string;
  error?: string;
}

// Bulk Operations
export interface BulkDiscountOperation {
  action: 'activate' | 'deactivate' | 'delete' | 'extend';
  discountIds: number[];
  parameters?: {
    newEndDate?: number;
    newStatus?: DiscountStatus;
  };
}

// Discount Form Validation
export interface DiscountFormErrors {
  code?: string;
  name?: string;
  type?: string;
  value?: string;
  maxUses?: string;
  maxUsesPerUser?: string;
  minOrderValue?: string;
  maxDiscountAmount?: string;
  startDate?: string;
  endDate?: string;
  target?: string;
  targetIds?: string;
} 
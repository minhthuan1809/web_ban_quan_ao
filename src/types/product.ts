// Product Related Types
export interface Size {
  id: number;
  name: string;
  createdAt?: number;
  updatedAt?: number;
  isDeleted?: boolean;
}

export interface Color {
  id: number;
  name: string;
  createdAt?: number;
  updatedAt?: number;
  isDeleted?: boolean;
}

export interface Category {
  id: number;
  name: string;
  createdAt?: number;
  updatedAt?: number;
  isDeleted?: boolean;
}

export interface Material {
  id: number;
  name: string;
  createdAt?: number;
  updatedAt?: number;
  isDeleted?: boolean;
}

export interface Team {
  id: number;
  name: string;
  league?: string;
  country?: string;
  logoUrl?: string;
  createdAt?: number;
  updatedAt?: number;
  isDeleted?: boolean;
}

export interface ProductVariant {
  id?: number;
  sizeId: number;
  colorId: number;
  quantity: number;
  price: number;
  size?: Size;
  color?: Color;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  imageUrls?: string[];
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  variants?: ProductVariant[];
  category?: Category;
  material?: Material;
  team?: Team;
  averageRating?: number;
  totalReviews?: number;
  totalSold?: number;
  status?: 'active' | 'inactive' | 'out_of_stock';
}

// API Filter and Search Types
export interface ProductFilter {
  categories?: string[];
  materials?: string[];
  teams?: string[];
  colors?: string[];
  sizes?: string[];
  priceRange?: [number, number];
  inStock?: boolean;
}

export interface ProductSearchParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: ProductFilter;
}

export interface ProductResponse {
  data: Product[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Create/Update Product Types
export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  categoryId: number;
  materialId?: number;
  teamId?: number;
  imageUrls?: string[];
  variants: Omit<ProductVariant, 'id'>[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
} 
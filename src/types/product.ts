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
  variants?: any;
} 
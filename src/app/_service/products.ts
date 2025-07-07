import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const productApiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
productApiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = { ...config.params, _t: Date.now() };
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
productApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Service-specific TypeScript Interfaces (different from centralized types)
export interface ServiceProductVariant {
  id: number;
  productId: number;
  sizeId: number;
  colorId: number;
  quantity: number;
  price: number;
  images: string[];
  size?: Size;
  color?: Color;
}

export interface Size {
  id: number;
  name: string;
  description?: string;
}

export interface Color {
  id: number;
  name: string;
  hexCode: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Material {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  materialId: number;
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  variants: ServiceProductVariant[];
  category?: Category;
  material?: Material;
  averageRating?: number;
  totalReviews?: number;
  minPrice?: number;
  maxPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  categories?: number[];
  sizes?: number[];
  colors?: number[];
  materials?: number[];
  gender?: string[];
  priceRange?: [number, number];
  rating?: number;
  inStock?: boolean;
}

export interface ProductSearchParams {
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' | 'name';
  filter?: ProductFilter;
}

export interface ProductResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: {
    availableCategories: Category[];
    availableSizes: Size[];
    availableColors: Color[];
    priceRange: [number, number];
  };
}

export interface CreateProductData {
  name: string;
  description: string;
  categoryId: number;
  materialId: number;
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  variants: Omit<ServiceProductVariant, 'id' | 'productId'>[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  status?: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
}

// Product Service Class
export class ProductService {
  /**
   * Get products with advanced filtering and pagination
   */
  static async getProducts(params: ProductSearchParams = {}): Promise<AxiosResponse<ProductResponse>> {
    try {
      const {
        search = '',
        page = 1,
        limit = 12,
        sort = 'newest',
        filter = {}
      } = params;

      // Build filter parameters
      const filterParams = {
        categoryIds: filter.categories || [],
        sizeIds: filter.sizes || [],
        colorIds: filter.colors || [],
        materialIds: filter.materials || [],
        gender: filter.gender || [],
        minPrice: filter.priceRange?.[0] || 0,
        maxPrice: filter.priceRange?.[1] || 999999999,
        minRating: filter.rating || 0,
        inStock: filter.inStock
      };

      // Build query parameters
      const queryParams = new URLSearchParams({
        search,
        page: page.toString(),
        page_size: limit.toString(),
        sort,
        filter: JSON.stringify(filterParams)
      });

      const response = await productApiClient.get<ProductResponse>(`/products?${queryParams.toString()}`);
      
      return response;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get product by ID with full details
   */
  static async getProductById(id: string | number): Promise<AxiosResponse<Product>> {
    try {
      const response = await productApiClient.get<Product>(`/products/${id}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch product details');
    }
  }

  /**
   * Get variant details by ID
   */
  static async getVariantById(id: string | number): Promise<AxiosResponse<ServiceProductVariant>> {
    try {
      const response = await productApiClient.get<ServiceProductVariant>(`/products/detail/${id}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch variant details');
    }
  }

  /**
   * Create new product
   */
  static async createProduct(data: CreateProductData, token: string): Promise<AxiosResponse<Product>> {
    try {
      const response = await productApiClient.post<Product>('/products', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw new Error('Failed to create product');
    }
  }

  /**
   * Update product
   */
  static async updateProduct(id: number, data: UpdateProductData, token: string): Promise<AxiosResponse<Product>> {
    try {
      const response = await productApiClient.put<Product>(`/products/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw new Error('Failed to update product');
    }
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: number, token: string): Promise<AxiosResponse<void>> {
    try {
      const response = await productApiClient.delete<void>(`/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit: number = 8): Promise<AxiosResponse<Product[]>> {
    try {
      const response = await productApiClient.get<Product[]>('/products/featured', {
        params: { limit }
      });
      return response;
    } catch (error) {
      throw new Error('Failed to fetch featured products');
    }
  }

  /**
   * Get related products
   */
  static async getRelatedProducts(productId: number, limit: number = 4): Promise<AxiosResponse<Product[]>> {
    try {
      const response = await productApiClient.get<Product[]>(`/products/${productId}/related`, {
        params: { limit }
      });
      return response;
    } catch (error) {
      throw new Error('Failed to fetch related products');
    }
  }

  /**
   * Search products with autocomplete
   */
  static async searchProducts(query: string, limit: number = 10): Promise<AxiosResponse<Product[]>> {
    try {
      const response = await productApiClient.get<Product[]>('/products/search', {
        params: { q: query, limit }
      });
      return response;
    } catch (error) {
      throw new Error('Failed to search products');
    }
  }
}

// Legacy API exports for backward compatibility
export const getProducts_API = (search: string, page: number, limit: number, filter: any) =>
  ProductService.getProducts({ search, page, limit, filter });

export const getProductDetail_API = (id: string) =>
  ProductService.getProductById(id);

export const getVariantDetail_API = (id: string) =>
  ProductService.getVariantById(id);

export const CreateProduct_API = (data: any, token: string) =>
  ProductService.createProduct(data, token);

export const UpdateProduct_API = (id: number, data: any, token: string) =>
  ProductService.updateProduct(id, data, token);

export const deleteProduct_API = (id: number, token: string) =>
  ProductService.deleteProduct(id, token);

// Export the API client
export { productApiClient };
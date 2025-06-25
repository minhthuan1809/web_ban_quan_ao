// Generic API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
  errors?: ApiError[];
  meta?: ApiMeta;
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiMeta {
  timestamp: number;
  requestId?: string;
  version?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  firstItem: number;
  lastItem: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  meta?: ApiMeta;
}

// Search and Filter Types
export interface SearchParams {
  search?: string;
  query?: string;
  keywords?: string[];
}

export interface SortParams {
  sort?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  orderBy?: string;
}

export interface FilterParams {
  filter?: string;
  filters?: Record<string, any>;
  where?: Record<string, any>;
}

export interface BaseQueryParams extends PaginationParams, SearchParams, SortParams, FilterParams {
  include?: string[];
  fields?: string[];
  expand?: string[];
}

// Error Response Types
export interface ErrorResponse {
  error: {
    message: string;
    code?: string | number;
    details?: any;
    stack?: string;
  };
  status: number;
  timestamp: number;
  path?: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data?: T | null;
  lastUpdated?: number;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  publicId?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Generic CRUD Types
export interface CreateResponse<T = any> {
  data: T;
  message: string;
  status: number;
}

export interface UpdateResponse<T = any> {
  data: T;
  message: string;
  status: number;
}

export interface DeleteResponse {
  message: string;
  status: number;
  deletedId?: string | number;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

// Generic Data Types
export interface BaseEntity {
  id: string | number;
  createdAt: number;
  updatedAt: number;
  isDeleted?: boolean;
}

export interface TimestampEntity {
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

// Request/Response Interceptor Types
export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  timeout?: number;
}

export interface ResponseConfig<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
}

// Cache Types
export interface CacheOptions {
  ttl?: number; // time to live in seconds
  key?: string;
  version?: string;
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version?: string;
} 
// Re-export all types from different modules
export * from './auth';
export * from './product';
export * from './order';
export * from './contact';
export * from './discount';
export * from './evaluate';
export * from './api';

// UI types (excluding conflicting FormErrors)
export type {
  BaseComponentProps,
  ButtonProps,
  InputProps,
  ModalProps,
  TableColumn,
  TableProps,
  SweetAlertOptions,
  LoadingProps
} from './ui';

// Global utility types
export type ID = string | number;
export type Timestamp = number;
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = JSONValue[];

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Event handler types
export type EventHandler<T = any> = (event: T) => void;
export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

// Generic callback types
export type Callback<T = void> = () => T;
export type AsyncCallback<T = void> = () => Promise<T>;
export type CallbackWithParam<P, T = void> = (param: P) => T;
export type AsyncCallbackWithParam<P, T = void> = (param: P) => Promise<T>;

// State management types
export type SetState<T> = (value: T | ((prev: T) => T)) => void;
export type StateUpdater<T> = (prev: T) => T;

// Component types
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type ComponentStatus = 'loading' | 'success' | 'error' | 'idle';

// Navigation types
export type Route = {
  path: string;
  name: string;
  component?: string;
  meta?: Record<string, any>;
};

// Theme types
export type ColorMode = 'light' | 'dark' | 'system';
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Validation types
export type ValidationRule<T = any> = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
  message?: string;
};

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]> | ValidationRule<T[K]>[];
};

// File types
export type FileType = 'image' | 'video' | 'document' | 'audio' | 'other';
export type FileInfo = {
  name: string;
  size: number;
  type: string;
  url?: string;
  lastModified?: number;
};

// Address types (Vietnam specific)
export type AddressLevel = {
  code: string;
  name: string;
  level: 'province' | 'district' | 'ward';
  parentCode?: string;
};

export type FullAddress = {
  province: AddressLevel;
  district: AddressLevel;
  ward: AddressLevel;
  street: string;
  fullAddress: string;
}; 
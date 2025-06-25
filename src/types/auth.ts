// Authentication Types
export interface UserRole {
  id: number;
  name: string;
  createdAt?: number;
  updatedAt?: number;
  isDeleted?: boolean;
  permissions?: string[];
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  district: string;
  ward: string;
  avatarUrl?: string | null;
  isVerify: boolean;
  role: UserRole;
  cartId?: number;
  createdAt: number;
  updatedAt?: number | null;
}

export interface TokenData {
  accessToken: string;
  tokenType: string;
  userInfo: AuthUser;
  expiresIn: number;
  refreshToken?: string;
  issuedAt?: number;
}

export interface AuthState {
  accessToken: string | null;
  userInfo: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: AuthUser | null;
  accessToken: string | null;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  address: string;
  district: string;
  ward: string;
}

export interface AuthResponse {
  userInfo: AuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// User State for Zustand
export interface UserState {
  user_Zustand: AuthUser | null;
  setUser_Zustand: (user: AuthUser | null) => void;
} 
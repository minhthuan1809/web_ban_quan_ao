import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance for auth
const authApiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for auth-specific error handling
authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // Handle specific auth errors
    switch (status) {
      case 401:
        console.error('Authentication failed:', message);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        break;
      case 403:
        console.error('Access forbidden:', message);
        break;
      case 422:
        console.error('Validation error:', message);
        break;
      default:
        console.error('Auth API error:', message);
    }

    return Promise.reject(error);
  }
);

// TypeScript Interfaces
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address: {
    city: { cityId: number; cityName: string };
    district: { districtId: number; districtName: string };
    ward: { wardId: number; wardName: string };
  };
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
  avatarUrl?: string;
  isVerify: boolean;
  role: {
    id: number;
    name: string;
  };
  cartId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUser;
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
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth Service Class
export class AuthService {
  /**
   * User login
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('AuthService.login called with:', { ...credentials, password: '***' });
      console.log('API_URL:', API_URL);
      console.log('Full URL will be:', `${API_URL}/auth/login`);
      const response: AxiosResponse<AuthResponse> = await authApiClient.post('/auth/login', credentials);
      
      // Store tokens securely
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Email hoặc mật khẩu không chính xác');
    }
  }

  /**
   * User registration
   */
  static async register(userData: RegisterRequest): Promise<AxiosResponse<any>> {
    try {
      const response = await authApiClient.post('/auth/register', userData);
      return response;
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      if (error.response?.status === 422) {
        throw new Error('Thông tin đăng ký không hợp lệ');
      }
      if (error.response?.status === 409) {
        throw new Error('Email đã được sử dụng');
      }
      
      throw new Error('Đăng ký thất bại. Vui lòng thử lại');
    }
  }

  /**
   * Email verification
   */
  static async verifyEmail(token: string): Promise<AxiosResponse<any>> {
    try {
      const response = await authApiClient.get(`/auth/verify-email?token=${token}`);
      return response;
    } catch (error) {
      console.error('Email verification failed:', error);
      throw new Error('Token xác thực không hợp lệ hoặc đã hết hạn');
    }
  }

  /**
   * Get current user info
   */
  static async getUserInfo(accessToken: string): Promise<AuthUser> {
    try {
      const response: AxiosResponse<AuthUser> = await authApiClient.get('/auth/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      // Update stored user info
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw new Error('Không thể lấy thông tin người dùng');
    }
  }

  /**
   * User logout
   */
  static async logout(accessToken: string): Promise<AxiosResponse<any>> {
    try {
      const response = await authApiClient.post('/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      // Clear stored data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      
      return response;
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      throw error;
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(email: string): Promise<AxiosResponse<any>> {
    try {
      const response = await authApiClient.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
      return response;
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw new Error('Không thể gửi email đặt lại mật khẩu');
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<AxiosResponse<any>> {
    try {
      const { token, newPassword } = data;
      const response = await authApiClient.post(
        `/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`
      );
      return response;
    } catch (error) {
      console.error('Reset password failed:', error);
      throw new Error('Không thể đặt lại mật khẩu. Token có thể đã hết hạn');
    }
  }

  /**
   * Change password
   */
  static async changePassword(data: ChangePasswordRequest, accessToken: string): Promise<AxiosResponse<any>> {
    try {
      const response = await authApiClient.post('/auth/change-password', data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Change password failed:', error);
      throw new Error('Không thể thay đổi mật khẩu');
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response: AxiosResponse<RefreshTokenResponse> = await authApiClient.post('/auth/refresh', {
        refreshToken
      });

      // Update stored tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear invalid tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    return !!(token && user);
  }

  /**
   * Get stored user data
   */
  static getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get stored access token
   */
  static getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }
}

// Legacy API exports for backward compatibility
export const authLogin_API = (data: any) => AuthService.login(data);
export const authRegister_API = (data: any) => AuthService.register(data);
export const authVerifyEmail_API = (token: string) => AuthService.verifyEmail(token);
export const authGetUserInfo_API = (accessToken: string) => AuthService.getUserInfo(accessToken);
export const authLogout_API = (accessToken: string) => AuthService.logout(accessToken);
export const authForgotPassword_API = (email: string) => AuthService.forgotPassword(email);
export const authResetPassword_API = (token: string, password: string) => 
  AuthService.resetPassword({ token, newPassword: password, confirmPassword: password });

// Export the API client
export { authApiClient };
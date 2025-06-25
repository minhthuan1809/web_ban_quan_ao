"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// TypeScript interfaces
export interface UserRole {
  id: number;
  name: string;
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
  avatarUrl?: string;
  isVerify: boolean;
  role: UserRole;
  cartId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  userInfo: AuthUser;
  expiresIn?: number;
  tokenType?: string;
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

// Custom hook for authentication information
const useAuthInfor = () => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    userInfo: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
    error: null
  });

  /**
   * Parse token from cookie with enhanced validation
   */
  const parseTokenFromCookie = useCallback((): TokenData | null => {
    try {
      const tokenCookie = getCookie('token');
      
      if (!tokenCookie) {
        return null;
      }

      const tokenData: TokenData = JSON.parse(tokenCookie as string);
      
      // Validate token structure
      if (!tokenData.accessToken || !tokenData.userInfo) {
        console.warn('Invalid token structure');
        return null;
      }

      // Check token expiration
      if (tokenData.expiresIn && Date.now() > tokenData.expiresIn) {
        console.warn('Token has expired');
        deleteCookie('token');
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error('Error parsing auth token:', error);
      // Clear invalid token
      deleteCookie('token');
      return null;
    }
  }, []);

  /**
   * Update authentication state
   */
  const updateAuthState = useCallback((tokenData: TokenData | null) => {
    if (!tokenData) {
      setAuthState({
        accessToken: null,
        userInfo: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: null
      });
      return;
    }

    const isAdmin = tokenData.userInfo.role?.name?.trim().toLowerCase() === 'admin';

    setAuthState({
      accessToken: tokenData.accessToken,
      userInfo: tokenData.userInfo,
      isAuthenticated: true,
      isAdmin,
      isLoading: false,
      error: null
    });
  }, []);

  /**
   * Login - save token and update state
   */
  const login = useCallback((tokenData: TokenData) => {
    try {
      // Add issued timestamp
      const tokenWithTimestamp = {
        ...tokenData,
        issuedAt: Date.now()
      };

      setCookie('token', JSON.stringify(tokenWithTimestamp), {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });

      updateAuthState(tokenWithTimestamp);
    } catch (error) {
      console.error('Error during login:', error);
      setAuthState(prev => ({
        ...prev,
        error: 'Lỗi đăng nhập',
        isLoading: false
      }));
    }
  }, [updateAuthState]);

  /**
   * Logout - clear token and reset state
   */
  const logout = useCallback(() => {
    try {
      deleteCookie('token');
      
      // Clear localStorage items if any
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }

      setAuthState({
        accessToken: null,
        userInfo: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  /**
   * Refresh user information
   */
  const refreshUserInfo = useCallback(() => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const tokenData = parseTokenFromCookie();
    updateAuthState(tokenData);
  }, [parseTokenFromCookie, updateAuthState]);

  /**
   * Update user information in token
   */
  const updateUserInfo = useCallback((updatedUser: Partial<AuthUser>) => {
    const currentToken = parseTokenFromCookie();
    
    if (!currentToken) return;

    const updatedTokenData = {
      ...currentToken,
      userInfo: {
        ...currentToken.userInfo,
        ...updatedUser
      }
    };

    setCookie('token', JSON.stringify(updatedTokenData), {
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    updateAuthState(updatedTokenData);
  }, [parseTokenFromCookie, updateAuthState]);

  /**
   * Check if user has specific permission
   */
  const hasPermission = useCallback((permission: string): boolean => {
    if (!authState.userInfo?.role) return false;
    
    // Admin has all permissions
    if (authState.isAdmin) return true;
    
    return authState.userInfo.role.permissions?.includes(permission) || false;
  }, [authState.userInfo?.role, authState.isAdmin]);

  // Initialize auth state on mount
  useEffect(() => {
    const tokenData = parseTokenFromCookie();
    updateAuthState(tokenData);
  }, [parseTokenFromCookie, updateAuthState]);

  // Memoized computed values
  const computedValues = useMemo(() => ({
    isGuest: !authState.isAuthenticated,
    isVerified: authState.userInfo?.isVerify || false,
    userName: authState.userInfo?.fullName || '',
    userEmail: authState.userInfo?.email || '',
    userRole: authState.userInfo?.role?.name || '',
    hasCart: !!authState.userInfo?.cartId
  }), [authState]);

  // Return complete auth state and methods
  return {
    // State
    ...authState,
    ...computedValues,
    
    // Methods
    login,
    logout,
    refreshUserInfo,
    updateUserInfo,
    hasPermission,
    
    // Raw token data for advanced use cases
    getTokenData: parseTokenFromCookie
  };
};

export default useAuthInfor;

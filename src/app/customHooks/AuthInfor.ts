"use client";
import { useState, useEffect, useCallback } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// TypeScript interfaces
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

// Custom hook for authentication information
const useAuthInfor = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Khởi tạo từ cookie khi component mount
  useEffect(() => {
    console.log('AuthInfor: Checking cookies...');
    
    const tokenFromCookie = getCookie('accessToken');
    const userFromCookie = getCookie('user');
    
    console.log('accessToken cookie:', tokenFromCookie);
    console.log('user cookie:', userFromCookie);

    if (tokenFromCookie) {
      console.log('Setting accessToken from cookie');
      setAccessToken(tokenFromCookie as string);
    } else {
      console.log('No accessToken cookie found');
    }

    if (userFromCookie) {
      try {
        const userData = JSON.parse(userFromCookie as string);
        console.log('Setting user from cookie:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
        deleteCookie('user');
      }
    } else {
      console.log('No user cookie found');
    }
  }, []);

  // Function để set accessToken mới
  const setAccessTokenNew = useCallback((token: string | null) => {
    setAccessToken(token);
    if (token) {
      setCookie('accessToken', token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    } else {
      deleteCookie('accessToken');
    }
  }, []);

  // Function để set user mới
  const setUserNew = useCallback((userData: AuthUser | null) => {
    setUser(userData);
    if (userData) {
      setCookie('user', JSON.stringify(userData), {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    } else {
      deleteCookie('user');
    }
  }, []);

  // Function để clear tất cả data
  const clearAuthData = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    deleteCookie('accessToken');
    deleteCookie('user');
    deleteCookie('token'); // Clear old token format if exists
  }, []);

  // Function để force refresh từ cookies
  const refreshFromCookies = useCallback(() => {
    console.log('Force refreshing from cookies...');
    
    // Thử nhiều cách để lấy cookie
    const methods = [
      () => getCookie('accessToken'),
      () => document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1],
      () => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('accessToken');
        }
        return null;
      }
    ];

    let foundToken = null;
    let foundUser = null;

    // Thử lấy accessToken
    for (const method of methods) {
      try {
        const token = method();
        if (token) {
          foundToken = token;
          console.log('Found token via method:', method.toString());
          break;
        }
      } catch (e) {
        console.log('Method failed:', e);
      }
    }

    // Thử lấy user
    const userMethods = [
      () => getCookie('user'),
      () => {
        const cookie = document.cookie.split(';').find(c => c.trim().startsWith('user='));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
      },
      () => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('user');
        }
        return null;
      }
    ];

    for (const method of userMethods) {
      try {
        const userStr = method();
        if (userStr) {
          foundUser = JSON.parse(userStr);
          console.log('Found user via method:', method.toString());
          break;
        }
      } catch (e) {
        console.log('User method failed:', e);
      }
    }

    if (foundToken) {
      setAccessToken(foundToken);
    }
    if (foundUser) {
      setUser(foundUser);
    }

    console.log('Refresh result - Token:', !!foundToken, 'User:', !!foundUser);
  }, []);

  return {
    accessToken,
    user,
    setAccessToken: setAccessTokenNew,
    setUser: setUserNew,
    clearAuthData,
    refreshFromCookies
  };
};

export default useAuthInfor;

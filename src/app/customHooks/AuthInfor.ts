"use client";
import { useState, useEffect, useCallback } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// TypeScript interfaces
// Import types from centralized location
import type { AuthUser, UserRole } from '../../types/auth';

// Custom hook for authentication information
const useAuthInfor = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Khởi tạo từ cookie khi component mount
  useEffect(() => {
    
    const tokenFromCookie = getCookie('accessToken');
    const userFromCookie = getCookie('user');
    

    if (tokenFromCookie) {
      setAccessToken(tokenFromCookie as string);
    } else {
    }

    if (userFromCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userFromCookie as string));
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
        deleteCookie('user');
      }
    } else {
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
  }, []);

  // Function để force refresh từ cookies
  const refreshFromCookies = useCallback(() => {
    
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
          break;
        }
      } catch (e) {
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
          break;
        }
      } catch (e) {
      }
    }

    if (foundToken) {
      setAccessToken(foundToken);
    }
    if (foundUser) {
      setUser(foundUser);
    }

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

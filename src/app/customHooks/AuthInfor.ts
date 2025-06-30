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

  // Khởi tạo từ cookie/localStorage khi component mount
  useEffect(() => {
    console.log('🔍 [AuthInfor] Khởi tạo hook...');
    
    // Ưu tiên lấy từ cookies trước
    const tokenFromCookie = getCookie('accessToken') as string;
    const userFromCookie = getCookie('user') as string;
    
    if (tokenFromCookie) {
      console.log('✅ [AuthInfor] Lấy token từ cookies');
      setAccessToken(tokenFromCookie);
    } else if (typeof window !== 'undefined') {
      // Fallback sang localStorage
      const tokenFromStorage = localStorage.getItem('accessToken');
      if (tokenFromStorage) {
        console.log('🔄 [AuthInfor] Sync token từ localStorage');
        setAccessToken(tokenFromStorage);
        setCookie('accessToken', tokenFromStorage, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
      }
    }

    if (userFromCookie) {
      try {
        console.log('✅ [AuthInfor] Lấy user từ cookies');
        const userData = JSON.parse(decodeURIComponent(userFromCookie));
        setUser(userData);
      } catch (error) {
        console.error('❌ [AuthInfor] Error parsing user từ cookie:', error);
        deleteCookie('user');
      }
    } else if (typeof window !== 'undefined') {
      // Fallback sang localStorage
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        try {
          console.log('🔄 [AuthInfor] Sync user từ localStorage');
          const userData = JSON.parse(userFromStorage);
          setUser(userData);
          setCookie('user', JSON.stringify(userData), {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
          });
        } catch (error) {
          console.error('❌ [AuthInfor] Error parsing user từ localStorage:', error);
          localStorage.removeItem('user');
        }
      }
    }
  }, []);

  // Function để set accessToken mới
  const setAccessTokenNew = useCallback((token: string | null) => {
    console.log('🔧 [AuthInfor] Set access token:', !!token);
    setAccessToken(token);
    
    if (token) {
      // Lưu vào cả cookies và localStorage
      setCookie('accessToken', token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
      }
    } else {
      // Clear khỏi cả cookies và localStorage
      deleteCookie('accessToken');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  // Function để set user mới
  const setUserNew = useCallback((userData: AuthUser | null) => {
    console.log('🔧 [AuthInfor] Set user:', !!userData);
    setUser(userData);
    
    if (userData) {
      // Lưu vào cả cookies và localStorage
      const userStr = JSON.stringify(userData);
      setCookie('user', userStr, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', userStr);
      }
    } else {
      // Clear khỏi cả cookies và localStorage
      deleteCookie('user');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Function để clear tất cả data (sử dụng cho logout)
  const clearAuthData = useCallback(() => {
    console.log('🗑️ [AuthInfor] Clearing all auth data...');
    
    // Clear state
    setAccessToken(null);
    setUser(null);
    
    // Clear cookies
    deleteCookie('accessToken');
    deleteCookie('user');
    deleteCookie('token'); // Clear token cũ nếu có
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    
    console.log('✅ [AuthInfor] Cleared all auth data');
  }, []);

  // Function để force refresh từ cookies/localStorage
  const refreshFromCookies = useCallback(() => {
    console.log('🔄 [AuthInfor] Refreshing từ cookies...');
    
    const tokenFromCookie = getCookie('accessToken') as string;
    const userFromCookie = getCookie('user') as string;
    
    if (tokenFromCookie) {
      setAccessToken(tokenFromCookie);
    } else if (typeof window !== 'undefined') {
      const tokenFromStorage = localStorage.getItem('accessToken');
      if (tokenFromStorage) {
        setAccessToken(tokenFromStorage);
      }
    }

    if (userFromCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userFromCookie));
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user từ cookie:', error);
      }
    } else if (typeof window !== 'undefined') {
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        try {
          const userData = JSON.parse(userFromStorage);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user từ localStorage:', error);
        }
      }
    }
  }, []);

  // Function để sync từ localStorage sang cookies
  const syncFromLocalStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    console.log('🔄 [AuthInfor] Syncing từ localStorage...');
    
    const tokenFromStorage = localStorage.getItem('accessToken');
    const userFromStorage = localStorage.getItem('user');
    
    if (tokenFromStorage) {
      setCookie('accessToken', tokenFromStorage, {
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      setAccessToken(tokenFromStorage);
    }
    
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        setCookie('user', JSON.stringify(userData), {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user từ localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Function để manual sync (để debug)
  const manualSync = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    console.log('🔧 [AuthInfor] Manual sync...');
    const tokenFromStorage = localStorage.getItem('accessToken');
    const userFromStorage = localStorage.getItem('user');
    
    console.log('Debug info:', {
      tokenFromStorage: !!tokenFromStorage,
      userFromStorage: !!userFromStorage,
      currentToken: !!accessToken,
      currentUser: !!user
    });
    
    syncFromLocalStorage();
  }, [accessToken, user, syncFromLocalStorage]);

  return {
    accessToken,
    user,
    setAccessToken: setAccessTokenNew,
    setUser: setUserNew,
    clearAuthData,
    refreshFromCookies,
    syncFromLocalStorage,
    manualSync
  };
};

export default useAuthInfor;

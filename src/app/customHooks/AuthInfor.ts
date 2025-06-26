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
    console.log('🔍 [AuthInfor] Khởi tạo hook...');
    
    const tokenFromCookie = getCookie('accessToken');
    const userFromCookie = getCookie('user');
    const tokenFromStorage = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const userFromStorage = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    
    
    // Nếu không có trong cookies, thử lấy từ localStorage và sync
    if (!tokenFromCookie && typeof window !== 'undefined') {
      const tokenFromStorage = localStorage.getItem('accessToken');
      if (tokenFromStorage) {
        console.log('🔄 [AuthInfor] Sync token từ localStorage vào cookies');
        setCookie('accessToken', tokenFromStorage, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        setAccessToken(tokenFromStorage);
      }
    } else if (tokenFromCookie) {
      setAccessToken(tokenFromCookie as string);
    }

    if (!userFromCookie && typeof window !== 'undefined') {
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        try {
          console.log('🔄 [AuthInfor] Sync user từ localStorage vào cookies');
          const userData = JSON.parse(userFromStorage);
          setCookie('user', userFromStorage, {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
          });
          setUser(userData);
        } catch (error) {
          console.error('❌ [AuthInfor] Error parsing user data from localStorage:', error);
          localStorage.removeItem('user');
        }
      }
    } else if (userFromCookie) {
      try {
        console.log('✅ [AuthInfor] Lấy user từ cookies');
        const userData = JSON.parse(decodeURIComponent(userFromCookie as string));
        setUser(userData);
        console.log('✅ [AuthInfor] Set user từ cookies thành công:', userData.email);
      } catch (error) {
        console.error('❌ [AuthInfor] Error parsing user data from cookie:', error);
        deleteCookie('user');
      }
    }
    
    // Force sync sau khi khởi tạo
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const hasTokenInStorage = localStorage.getItem('accessToken');
        const hasTokenInCookie = getCookie('accessToken');
        
        if (hasTokenInStorage && !hasTokenInCookie) {
          window.location.reload(); // Reload để middleware pick up cookies mới
        }
      }
    }, 100);
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

  // Function để force sync từ localStorage vào cookies
  const syncFromLocalStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const tokenFromStorage = localStorage.getItem('accessToken');
    const userFromStorage = localStorage.getItem('user');
    
    if (tokenFromStorage) {
      setCookie('accessToken', tokenFromStorage, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      setAccessToken(tokenFromStorage);
    }
    
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        setCookie('user', userFromStorage, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Hàm sync ngay lập tức (có thể gọi trong console để test)
  const manualSync = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const tokenFromStorage = localStorage.getItem('accessToken');
    const userFromStorage = localStorage.getItem('user');
    
    console.log('🔧 [AuthInfor] Manual sync:', {
      tokenFromStorage: !!tokenFromStorage,
      userFromStorage: !!userFromStorage
    });
    
    if (tokenFromStorage) {
      setCookie('accessToken', tokenFromStorage, {
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      setAccessToken(tokenFromStorage);
      console.log('✅ [AuthInfor] Synced token to cookies');
    }
    
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        setCookie('user', userFromStorage, {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        setUser(userData);
        console.log('✅ [AuthInfor] Synced user to cookies:', userData.email);
      } catch (error) {
        console.error('❌ [AuthInfor] Error parsing user from localStorage:', error);
      }
    }
    
    // Make available globally for testing
    if (typeof window !== 'undefined') {
      (window as any).syncAuth = manualSync;
    }
  }, []);

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

"use client";
import { useState, useEffect, useCallback } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import type { AuthUser } from '../../types/auth';

const useAuthInfor = () => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<AuthUser | null>(null);

  // Khởi tạo từ cookie/localStorage khi component mount
  useEffect(() => {
    // Ưu tiên lấy từ cookies trước
    const tokenFromCookie = getCookie('accessToken') as string;
    const userFromCookie = getCookie('user') as string;

    if (tokenFromCookie) {
      setAccessTokenState(tokenFromCookie);
    } else if (typeof window !== 'undefined') {
      const tokenFromStorage = localStorage.getItem('accessToken');
      if (tokenFromStorage) {
        setAccessTokenState(tokenFromStorage);
        setCookie('accessToken', tokenFromStorage, {
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
      }
    }

    if (userFromCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userFromCookie));
        setUserState(userData);
      } catch {
        deleteCookie('user');
      }
    } else if (typeof window !== 'undefined') {
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        try {
          const userData = JSON.parse(userFromStorage);
          setUserState(userData);
          setCookie('user', JSON.stringify(userData), {
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
          });
        } catch {
          localStorage.removeItem('user');
        }
      }
    }
  }, []);

  // Khi login: set accessToken và user, lưu vào cookies + localStorage
  const setAccessToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      setCookie('accessToken', token, {
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
      }
    } else {
      deleteCookie('accessToken');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  const setUser = useCallback((userData: AuthUser | null) => {
    setUserState(userData);
    if (userData) {
      const userStr = JSON.stringify(userData);
      setCookie('user', userStr, {
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', userStr);
      }
    } else {
      deleteCookie('user');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Khi logout: clear toàn bộ
  const clearAuthData = useCallback(() => {
    
    setAccessTokenState(null);
    setUserState(null);
    deleteCookie('accessToken');
    deleteCookie('user');
    deleteCookie('token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  // Force refresh từ cookies/localStorage
  const refreshFromCookies = useCallback(() => {
    const tokenFromCookie = getCookie('accessToken') as string;
    const userFromCookie = getCookie('user') as string;
    if (tokenFromCookie) {
      setAccessTokenState(tokenFromCookie);
    } else if (typeof window !== 'undefined') {
      const tokenFromStorage = localStorage.getItem('accessToken');
      if (tokenFromStorage) {
        setAccessTokenState(tokenFromStorage);
      }
    }
    if (userFromCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userFromCookie));
        setUserState(userData);
      } catch {}
    } else if (typeof window !== 'undefined') {
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        try {
          const userData = JSON.parse(userFromStorage);
          setUserState(userData);
        } catch {}
      }
    }
  }, []);

  // Sync localStorage -> cookies
  const syncFromLocalStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    const tokenFromStorage = localStorage.getItem('accessToken');
    const userFromStorage = localStorage.getItem('user');
    if (tokenFromStorage) {
      setCookie('accessToken', tokenFromStorage, {
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      setAccessTokenState(tokenFromStorage);
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
        setUserState(userData);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  return {
    accessToken,
    user,
    setAccessToken,
    setUser,
    clearAuthData,
    refreshFromCookies,
    syncFromLocalStorage
  };
};

export default useAuthInfor;

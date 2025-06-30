import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Import types from centralized location
import type { TokenData, AuthResult } from './types/auth';

// Constants
const ADMIN_PATHS = [
  '/admin',
  '/dashboard', 
  '/productAdmin',
  '/category',
  '/team',
  '/material',
  '/contacts',
  '/customers',
  '/orders/confirm',
  '/orders/payments',
  '/discount',
  '/evaluate',
  '/color',
  '/size'
] as const;

const PROTECTED_PATHS = [
  '/profile',
  '/cart',
  '/history-order',
  '/orders'
] as const;

const PUBLIC_AUTH_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
] as const;

const REDIRECT_PATHS = {
  unauthorized: '/not-found',
  notFound: '/not-found',
  home: '/',
  dashboard: '/dashboard'
} as const;

/**
 * Parse and validate authentication token from cookies
 */
function parseAuthToken(request: NextRequest): AuthResult {
  const defaultResult: AuthResult = {
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    accessToken: null
  };

  try {
    // Kiểm tra format mới (accessToken và user riêng biệt)
    const accessTokenCookie = request.cookies.get('accessToken');
    const userCookie = request.cookies.get('user');
    
    if (accessTokenCookie?.value && userCookie?.value) {
      const userData = JSON.parse(userCookie.value);
      const isAdmin = Number(userData.role?.id) === 2;
    
      
      return {
        isAuthenticated: true,
        isAdmin,
        user: userData,
        accessToken: accessTokenCookie.value
      };
    }

    // Fallback: Kiểm tra format cũ (token đầy đủ)
    const tokenCookie = request.cookies.get('token');
    
    if (!tokenCookie?.value) {
      return defaultResult;
    }

    const tokenData: TokenData = JSON.parse(tokenCookie.value);
    
    // Validate token structure
    if (!tokenData.accessToken || !tokenData.userInfo) {
      console.warn('Invalid token structure');
      return defaultResult;
    }

    // Check token expiration if available
    if (tokenData.expiresIn && Date.now() > tokenData.expiresIn) {
      console.warn('Token has expired');
      return defaultResult;
    }

    const isAdmin = tokenData.userInfo.role?.name?.trim().toLowerCase() === 'admin';

    return {
      isAuthenticated: true,
      isAdmin,
      user: tokenData.userInfo,
      accessToken: tokenData.accessToken
    };

  } catch (error) {
    console.error('Error parsing authentication token:', error);
    return defaultResult;
  }
}

/**
 * Check if path matches any patterns in the given array
 */
function matchesPath(pathname: string, paths: readonly string[]): boolean {
  return paths.some(path => pathname === path || pathname.startsWith(path + '/'));
}

/**
 * Create appropriate response based on route protection requirements
 */
function createResponse(
  request: NextRequest,
  auth: AuthResult,
  pathname: string
): NextResponse {
  
  // Handle admin route protection
  if (matchesPath(pathname, ADMIN_PATHS)) {
    if (!auth.isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!auth.isAdmin) {
      // Return 404 instead of redirect for non-admin users
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }
    // Only redirect /admin to dashboard, not other admin routes
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL(REDIRECT_PATHS.dashboard, request.url));
    }
  }

  // Handle protected user routes
  if (matchesPath(pathname, PROTECTED_PATHS)) {
    if (!auth.isAuthenticated) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Cho phép cả user và admin truy cập, không chặn user thường
  }

  // Handle public auth routes (login, register, etc.)
  if (matchesPath(pathname, PUBLIC_AUTH_PATHS)) {
    if (auth.isAuthenticated) {
      // Người dùng đã đăng nhập không được phép truy cập các trang auth
      const returnUrl = request.nextUrl.searchParams.get('returnUrl');
      
      let redirectUrl: string;
      
      if (returnUrl && returnUrl.startsWith('/')) {
        redirectUrl = returnUrl;
      } else if (auth.isAdmin) {
        redirectUrl = REDIRECT_PATHS.dashboard;
      } else {
        redirectUrl = REDIRECT_PATHS.home;
      }
      

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Special handling for specific routes
  if (pathname === '/profile' && !auth.isAuthenticated) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  // Add user info to headers for SSR components (optional)
  const response = NextResponse.next();
  
  if (auth.isAuthenticated && auth.user) {
    response.headers.set('x-user-id', auth.user.id.toString());
    response.headers.set('x-user-role', auth.user.role.name);
    response.headers.set('x-is-admin', auth.isAdmin.toString());
  }

  return response;
}

/**
 * Main middleware function with comprehensive route protection
 */
export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('__nextjs') ||
    pathname.includes('webpack-hmr') ||
    pathname.includes('static')
  ) {
    return NextResponse.next();
  }

  // Parse authentication data
  const auth = parseAuthToken(request);
  

  
  // Log access attempts for admin routes (for security monitoring)
  if (matchesPath(pathname, ADMIN_PATHS) && !auth.isAdmin) {
    console.warn(`Unauthorized admin access attempt: ${pathname} by ${auth.user?.email || 'anonymous'}`);
  }

  // Create and return appropriate response
  return createResponse(request, auth, pathname);
}

// Optimized matcher configuration
export const config = {
  matcher: [
  
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
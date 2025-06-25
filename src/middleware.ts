import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Types
interface TokenData {
  accessToken: string;
  userInfo: {
    id: number;
    email: string;
    fullName: string;
    role: {
      id: number;
      name: string;
    };
    isVerify: boolean;
  };
  expiresIn?: number;
  tokenType?: string;
}

interface AuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: TokenData['userInfo'] | null;
  accessToken: string | null;
}

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
  '/evaluate'
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
  unauthorized: '/components/error/401',
  notFound: '/404',
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
  return paths.some(path => pathname.startsWith(path) || pathname.includes(path));
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
      return NextResponse.rewrite(new URL(REDIRECT_PATHS.unauthorized, request.url));
    }
    
    // Redirect /admin to dashboard
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
  }

  // Handle public auth routes (login, register, etc.)
  if (matchesPath(pathname, PUBLIC_AUTH_PATHS)) {
    if (auth.isAuthenticated) {
      // Redirect authenticated users away from auth pages
      const returnUrl = request.nextUrl.searchParams.get('returnUrl');
      const redirectUrl = returnUrl && returnUrl.startsWith('/') 
        ? returnUrl 
        : auth.isAdmin 
          ? REDIRECT_PATHS.dashboard 
          : REDIRECT_PATHS.home;
      
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Special handling for specific routes
  if (pathname === '/profile' && !auth.isAuthenticated) {
    return NextResponse.rewrite(new URL(REDIRECT_PATHS.notFound, request.url));
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
  
  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
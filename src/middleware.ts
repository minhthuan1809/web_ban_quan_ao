import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("token");
  const path = request.nextUrl.pathname;
  let accessToken = null;
  let userInfo = null;
  let isAdmin = false;
  if (cookie?.value) {
    try {
      const tokenData = JSON.parse(cookie.value);
      accessToken = tokenData.accessToken;
      userInfo = tokenData.userInfo;
      isAdmin = userInfo?.role.name.trim().toLowerCase() === 'admin';
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  }
  const pathAdmin = ['/admin', '/dashboard', '/productAdmin', '/category', '/team', '/material', '/contacts', '/customers'];
  const pathUser = ['/profile', '/orders', '/wishlist', '/cart', '/checkout', '/payment', '/order-success', '/order-detail'];
  // Nếu không phải admin mà truy cập vào đường dẫn admin thì chuyển đến trang UnauthorizedPage

  if (!isAdmin && pathAdmin.some(adminPath => path.includes(adminPath))) {
    return NextResponse.rewrite(new URL('/components/error/401', request.url));
  }

  if (path === '/admin') {
    return NextResponse.rewrite(new URL('/dashboard', request.url));
  }
  if (path === '/login' || path === '/register') {
    if (cookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (path === '/profile') {
    if (!cookie) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  return NextResponse.next();
}
 
// Match all paths
export const config = {
  matcher: '/:path*',
}
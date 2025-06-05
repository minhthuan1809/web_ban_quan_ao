import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("token");
  const path = request.nextUrl.pathname;

  if (path === '/login' || path === '/register') {
    if (cookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
 
// Match all paths
export const config = {
  matcher: '/:path*',
}
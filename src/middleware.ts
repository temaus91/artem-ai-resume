import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const hasSupabaseCookie = request.cookies.getAll().some((cookie) => cookie.name.includes('sb-') && cookie.name.includes('auth-token'));
  if (!hasSupabaseCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

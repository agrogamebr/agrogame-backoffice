import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const forceChangePassword = request.cookies.get('force_change_password')?.value;
  const { pathname } = request.nextUrl;

  // Paths that are public (login, static files, etc)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public') ||
    pathname === '/login'
  ) {
    // If user is authenticated and tries to access login, redirect to dashboard or change-password
    if (token && pathname === '/login') {
      if (forceChangePassword === 'true') {
        return NextResponse.redirect(new URL('/change-password', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Allow access to change-password page if user is authenticated
  if (pathname === '/change-password') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Allow access to change-password page
    return NextResponse.next();
  }

  // Allow access to profile/change-password page if user is authenticated
  if (pathname === '/profile/change-password') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // If user has forced password change, redirect to forced change page
    if (forceChangePassword === 'true') {
      return NextResponse.redirect(new URL('/change-password', request.url));
    }
    return NextResponse.next();
  }

  // Root path handling
  if (pathname === '/') {
    if (token) {
      if (forceChangePassword === 'true') {
        return NextResponse.redirect(new URL('/change-password', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protected routes (everything else)
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user must change password, redirect to change-password page
  if (forceChangePassword === 'true') {
    return NextResponse.redirect(new URL('/change-password', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};

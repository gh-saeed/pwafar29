import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();

  try {
    // فقط decode می‌کنیم اگه URL فارسی یا encoded باشه
    url.pathname = decodeURIComponent(url.pathname);
  } catch (err) {
    console.warn('Error decoding URL:', url.pathname);
  }

  return NextResponse.rewrite(url);
}

// همه مسیرها غیر از مسیرهای سیستمی و API
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 
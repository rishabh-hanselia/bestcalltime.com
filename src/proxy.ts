import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'hi', 'ar', 'ru'];

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if it's an exact match for /en or /en/...
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const newPath = pathname.replace(/^\/en/, '') || '/';
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check if pathname already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // If no locale in pathname, rewrite to /en
  return NextResponse.rewrite(new URL(`/en${pathname}`, request.url));
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip public files
    '/((?!_next|api|favicon\\.ico|favicon\\.svg|og-image\\.png|site\\.webmanifest|robots\\.txt|sitemap\\.xml|.*\\..*).*)',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// Section 7: Supported Locales (English, Hindi, Marathi)
const locales = ['en', 'hi', 'mr'];
const defaultLocale = 'en';

// Temporarily commented to restore dashboard access (Section 7)
/*
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // Section 7: Mandatory locale prefixes
});
*/

export default function middleware(request: NextRequest) {
  // const response = intlMiddleware(request);
  const response = NextResponse.next();

  // Section 11: Security Hardening (Mandatory Headers & CSP)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' cdnjs.cloudflare.com mux.com;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' blob: data: s3.amazonaws.com;
    font-src 'self' fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Skip security checks for API routes but keep headers for browser-facing app
  return response;
}

export const config = {
  // Match all pathnames except for the ones starting with:
  // - api (API routes)
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - static (static files)
  // - favicon.ico, sitemap.xml, robots.txt (metadata files)
  matcher: ['/((?!api|_next|_vercel|static|favicon.ico|sitemap.xml|robots.txt).*)']
};

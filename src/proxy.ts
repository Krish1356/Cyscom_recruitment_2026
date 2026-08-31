import { auth } from "@/auth"
import { NextResponse } from "next/server"

const rateLimitMap = new Map();

function rateLimit(ip: string) {
  const windowMs = 60 * 1000;
  const maxRequests = 100;
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - record.startTime > windowMs) {
    record.count = 1;
    record.startTime = now;
  } else {
    record.count += 1;
  }
  rateLimitMap.set(ip, record);
  return record.count <= maxRequests;
}

export default auth((req) => {
  const ip = (req as any).ip ?? req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  
  if (req.nextUrl.pathname.startsWith('/api') || req.nextUrl.pathname.startsWith('/assessment')) {
    const isAllowed = rateLimit(ip);
    if (!isAllowed) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  
  let response = NextResponse.next();

  if (isAuthPage) {
    if (isLoggedIn) {
      response = NextResponse.redirect(new URL('/', req.nextUrl));
    }
  } else {
    const isPublicRoute = req.nextUrl.pathname === '/' || 
                          req.nextUrl.pathname.startsWith('/_next') ||
                          req.nextUrl.pathname.startsWith('/api/auth') ||
                          req.nextUrl.pathname.startsWith('/api/setup-admin');

    if (!isLoggedIn && !isPublicRoute) {
      response = NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  // Security Headers
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'");
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|webp|ico)).*)'],
}

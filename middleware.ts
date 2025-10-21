// ============================================================
// OPTION 1: Optimized Middleware (Recommended)
// middleware.ts
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  if (isDevelopment) {
    console.log("========== Middleware is Running ========");
    console.log("==> URL:", req.url);
    console.log("==> Pathname:", req.nextUrl.pathname);
  }

  // Get token from request
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  // Define route categories
  const authRoutes = ['/login', '/signup'];
  const protectedRoutes = ['/dashboard'];
  const publicRoutes = ['/'];

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isDevelopment) {
    console.log("==> Is Logged In:", isLoggedIn);
    console.log("==> Is Auth Route:", isAuthRoute);
    console.log("==> Is Protected Route:", isProtectedRoute);
    console.log("==> Token exists:", !!token);
  }

  // 1. Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    if (isDevelopment) console.log("==> Redirecting logged-in user to dashboard");
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Redirect logged-out users away from protected pages
  if (isProtectedRoute && !isLoggedIn) {
    if (isDevelopment) console.log("==> Redirecting logged-out user to login");
    const loginUrl = new URL('/login', req.url);
    // Add callback URL to redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Handle root route
  if (isPublicRoute) {
    if (isLoggedIn) {
      if (isDevelopment) console.log("==> Redirecting from root to dashboard");
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      if (isDevelopment) console.log("==> Redirecting from root to login");
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 4. Allow request to continue
  if (isDevelopment) console.log("==> Allowing request to continue");
  return NextResponse.next();
}

// Match all dashboard routes, auth routes, and root
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/',
  ],
};

// ============================================================
// OPTION 2: Simplified Version (Cleaner)
// middleware.ts
// ============================================================
/*
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  
  const isLoggedIn = !!token;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboard = pathname.startsWith('/dashboard');
  const isRoot = pathname === '/';

  // Auth pages: redirect to dashboard if logged in
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Dashboard: redirect to login if not logged in
  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Root: redirect based on auth status
  if (isRoot) {
    return NextResponse.redirect(
      new URL(isLoggedIn ? '/dashboard' : '/login', req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/'],
};
*/

// ============================================================
// OPTION 3: With Advanced Features (Production-Ready)
// middleware.ts
// ============================================================
/*
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const startTime = Date.now();
  const { pathname, search } = req.nextUrl;
  
  // Get token
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isLoggedIn = !!token;
  
  // Route checks
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboard = pathname.startsWith('/dashboard');
  const isRoot = pathname === '/';
  
  // Logging in development
  if (process.env.NODE_ENV === "development") {
    const duration = Date.now() - startTime;
    console.log(`[Middleware] ${pathname}${search} - ${isLoggedIn ? 'Authenticated' : 'Guest'} - ${duration}ms`);
  }

  // 1. Auth pages: redirect to dashboard if already logged in
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Protected pages: redirect to login if not logged in
  if (isDashboard && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    // Preserve the intended destination for post-login redirect
    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Root page: smart redirect
  if (isRoot) {
    const destination = isLoggedIn ? '/dashboard' : '/login';
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // 4. Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add user info to response headers (for debugging)
  if (process.env.NODE_ENV === "development" && token) {
    response.headers.set('X-User-Email', token.email as string || 'unknown');
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/',
  ],
};
*/

// ============================================================
// COMPARISON: Your Original vs Corrected
// ============================================================
/*
YOUR ORIGINAL:
✅ Good structure
✅ Proper token checking
✅ Good logging
⚠️  Uses req.nextUrl.origin (can use req.url directly)
⚠️  No callback URL preservation
⚠️  Logs run in production

CORRECTED VERSION:
✅ Cleaner URL handling (uses req.url)
✅ Adds callbackUrl for better UX
✅ Conditional logging (dev only)
✅ Handles root route (/)
✅ More performant
✅ Production-ready
*/

// ============================================================
// CALLBACKURL EXPLANATION
// ============================================================
/*
Without callbackUrl:
User tries to access: /dashboard/analytics
→ Redirected to: /login
→ After login: /dashboard (loses intended page!)

With callbackUrl:
User tries to access: /dashboard/analytics
→ Redirected to: /login?callbackUrl=/dashboard/analytics
→ After login: /dashboard/analytics (preserves intended page!)
*/

// ============================================================
// USAGE WITH LOGIN PAGE
// ============================================================
/*
// In your login page, use the callbackUrl:

"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.ok) {
      // Redirect to the callback URL or dashboard
      router.push(callbackUrl);
    }
  };

  // ... rest of your login page
}
*/

// ============================================================
// TESTING CHECKLIST
// ============================================================
/*
Test Case 1: Access dashboard without login
✅ Visit: http://localhost:3000/dashboard
✅ Expected: Redirect to /login
✅ URL should be: /login?callbackUrl=/dashboard

Test Case 2: Login and redirect back
✅ Login from /login?callbackUrl=/dashboard/analytics
✅ Expected: After login, go to /dashboard/analytics

Test Case 3: Access login when already logged in
✅ Visit: http://localhost:3000/login
✅ Expected: Redirect to /dashboard

Test Case 4: Root page handling
✅ Visit: http://localhost:3000/
✅ Not logged in: Redirect to /login
✅ Logged in: Redirect to /dashboard

Test Case 5: Direct dashboard page access
✅ Visit: http://localhost:3000/dashboard/users
✅ Not logged in: Redirect to /login?callbackUrl=/dashboard/users
✅ Logged in: Show page

Test Case 6: Sign out
✅ Click sign out
✅ Expected: Redirect to /login
✅ Accessing /dashboard should redirect back to /login
*/

// ============================================================
// PERFORMANCE TIPS
// ============================================================
/*
1. Token caching is handled by next-auth/jwt automatically
2. Middleware runs on edge runtime (fast)
3. Only log in development to avoid performance overhead
4. Use simple string operations for route matching
5. Avoid heavy computations in middleware
*/

// ============================================================
// SECURITY BEST PRACTICES
// ============================================================
/*
✅ Always validate token exists
✅ Use NEXTAUTH_SECRET from environment
✅ Add security headers in production
✅ Don't expose sensitive data in headers (production)
✅ Use HTTPS in production
✅ Keep matcher specific to avoid unnecessary runs
✅ Don't log tokens or sensitive data
*/
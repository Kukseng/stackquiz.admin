// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  if (isDevelopment) {
    console.log("========== Middleware Running ==========");
    console.log("URL:", req.url);
    console.log("Pathname:", req.nextUrl.pathname);
  }

  // Get authentication token
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isLoggedIn = !!token;
  const { pathname, search } = req.nextUrl;

  if (isDevelopment) {
    console.log("Is Logged In:", isLoggedIn);
    console.log("Token exists:", !!token);
  }

  // Define routes
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboard = pathname.startsWith('/dashboard');
  const isRoot = pathname === '/';

  // ========== RULE 1: PROTECT DASHBOARD ==========
  // Block access to dashboard if NOT logged in
  if (isDashboard && !isLoggedIn) {
    if (isDevelopment) {
      console.log("🚫 BLOCKED: Redirecting to login");
    }
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // ========== RULE 2: REDIRECT LOGGED-IN USERS FROM AUTH PAGES ==========
  // If already logged in, don't show login/signup pages
  if (isAuthRoute && isLoggedIn) {
    if (isDevelopment) {
      console.log("✅ Already logged in, redirecting to dashboard");
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // ========== RULE 3: HANDLE ROOT PAGE ==========
  // Redirect root to login or dashboard based on auth status
  if (isRoot) {
    const destination = isLoggedIn ? '/dashboard' : '/login';
    if (isDevelopment) {
      console.log(`🏠 Root redirect to ${destination}`);
    }
    return NextResponse.redirect(new URL(destination, req.url));
  }

  if (isDevelopment) {
    console.log("✅ Request allowed to continue");
    console.log("==========================================");
  }

  // Allow request to continue
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',  // All dashboard routes
    '/login',                           
  ],
};
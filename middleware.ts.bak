// middleware.ts (root project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // API routes: attach user info if token exists
  if (pathname.startsWith("/api")) {
    if (token) {
      const user = await verifyToken(token);
      if (user) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", String(user.id));
        requestHeaders.set("x-user-role", user.role);
        return NextResponse.next({ request: { headers: requestHeaders } });
      }
    }
    // Allow public API routes
    if (pathname.startsWith("/api/auth/login")) {
      return NextResponse.next();
    }
  }

  // Page protection
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/attendance") ||
    pathname.startsWith("/requests");

  if (isAdminRoute || isUserRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (isAdminRoute && user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/attendance/:path*",
    "/requests/:path*",
    "/api/:path*",
  ],
};

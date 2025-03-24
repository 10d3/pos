/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTE_PERMISSIONS, ROLE_PERMISSIONS } from "./lib/const";
import { jwtVerify } from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Skip API routes and public routes
  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.includes("/_next/") ||
    request.nextUrl.pathname.includes("/images/") ||
    request.nextUrl.pathname.includes("/icons/") ||
    request.nextUrl.pathname.includes("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("Authorization")?.split(" ")[1];

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    const { payload } = await jwtVerify(token, secret);

    // Check if user has permission to access the route
    const userRole = payload.role as string;
    const pathname = request.nextUrl.pathname;

    // Find the most specific matching route
    const matchingRoutes = Object.keys(ROUTE_PERMISSIONS)
      .filter((route) => pathname.startsWith(route))
      .sort((a, b) => b.length - a.length);

    if (matchingRoutes.length > 0) {
      const matchedRoute = matchingRoutes[0];
      const permission = ROUTE_PERMISSIONS[matchedRoute];

      // Get permissions directly from ROLE_PERMISSIONS instead of payload
      // @ts-expect-error - Dynamic access
      const rolePermissions = ROLE_PERMISSIONS[userRole]?.[permission];

      // Check if user has at least view permission
      const hasAccess =
        typeof rolePermissions === "boolean"
          ? rolePermissions
          : typeof rolePermissions === "object" &&
            rolePermissions.view === true;

      if (!hasAccess) {
        // Redirect to dashboard if no permission
        return NextResponse.redirect(new URL("/pos", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    console.error("Auth middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

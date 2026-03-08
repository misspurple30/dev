import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    console.log('Middleware - Route:', req.nextUrl.pathname);
    console.log('Middleware - Token:', token);

    if (isAdminRoute && token?.role === "admin") {
      return NextResponse.next();
    }

    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('Middleware - Authorized check:', !!token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*"
  ]
};
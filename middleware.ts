import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.isAdmin ? "ADMIN" : "STUDENT" // Assuming your JWT token includes a 'role' field ('ADMIN' or 'STUDENT')

    console.log(token)

    // 1. Restrict /admin routes to ADMIN role only
    if (path.startsWith("/admin")) {
      if (role !== "ADMIN") {
        // If a student tries to access admin, send them to their dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 2. Restrict /dashboard routes to STUDENT role only
    if (path.startsWith("/dashboard")) {
      if (role === "ADMIN") {
        // If an admin tries to access the student dashboard, send them to /admin
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      if (role !== "STUDENT") {
        // If unauthenticated or unrecognized role, redirect to login
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Ensures the user is at least logged in before running the custom checks above
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
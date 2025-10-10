import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can be added here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is trying to access protected routes
        const { pathname } = req.nextUrl;
        
        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/signin",
          "/signup",
          "/api/auth/signup",
        ];

        // API routes that should be protected
        const protectedApiRoutes = [
          "/api/auth/logout",
        ];

        // Check if the current path is a public route
        if (publicRoutes.includes(pathname)) {
          return true;
        }

        // Check if accessing protected API routes
        if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
          return !!token;
        }

        // Admin routes require admin role
        if (pathname.startsWith("/admin")) {
          if (!token) return false;
          // Note: Role checking will be done on the page level for now
          // In production, you'd want to decode the JWT to check role here
          return !!token;
        }

        // Dashboard and other protected pages require authentication
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
          return !!token;
        }

        // All other routes are accessible
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

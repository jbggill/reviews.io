import { clerkMiddleware } from "@clerk/nextjs/server";

// Define your public routes
export default clerkMiddleware({
  publicRoutes: ["/", "/restaurant(.*)", "/contact", "/about"],
});

// Make sure that the matcher does not cause unexpected route matching issues
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",  // Protect all routes except static files and Next.js internals
    "/api/(.*)",  // Protect API routes
    "/trpc/(.*)",  // Protect TRPC routes
  ],
};


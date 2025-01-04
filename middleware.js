import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Extract token from NextAuth using the secret
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/account/login", req.url));
  }

  // Allow request to proceed if authenticated
  return NextResponse.next();
}

// Apply middleware to all routes under `/protected` prefix
export const config = {
  matcher: ["/protected/:path*"], // Matches all routes under `/protected`
};
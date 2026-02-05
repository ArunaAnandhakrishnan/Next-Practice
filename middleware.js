import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow Next internals, static files, login, and APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/tinymce") ||
    pathname.startsWith("/api") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  // Read token from cookie
  const token = req.cookies.get("token")?.value;

  // Redirect if token missing
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/editor/:path*", "/list/:path*", "/notification/:path*"],
};

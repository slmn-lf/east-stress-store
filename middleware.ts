import { NextRequest, NextResponse } from "next/server";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Proteksi routes admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value;

    // Jika tidak ada token, redirect ke login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Verifikasi token
    try {
      const decoded = JSON.parse(
        Buffer.from(token, "base64").toString("utf-8")
      );
      if (decoded.username !== ADMIN_USERNAME) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

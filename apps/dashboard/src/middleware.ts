// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers to prevent various attacks
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export async function middleware(request: NextRequest) {
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("session_token")?.value ||
    request.cookies.get("better-auth.session-token")?.value ||
    request.cookies.get("session-token")?.value;

  if (!sessionToken) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    const response = NextResponse.redirect(signInUrl);

    return addSecurityHeaders(response);
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export default createMiddleware(routing);

export const config = {
  // matcher: ["/((?!_next|favicon.ico|api/auth/*|auth/*).*)"],
  matcher: "/((?!api|trpc|_next|_vercel|api/auth/*|auth/*|.*\\..*).*)",
};

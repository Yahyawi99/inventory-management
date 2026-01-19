// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
export const PUBLIC_AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/accept-invitation",
];

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("session_token")?.value ||
    request.cookies.get("better-auth.session-token")?.value ||
    request.cookies.get("session-token")?.value;

  const pathname = request.nextUrl.pathname;

  const pathnameWithoutLocale = pathname.replace(/^\/(en|fr|ar)/, "");

  const isAuthPage = PUBLIC_AUTH_ROUTES.some((route) =>
    pathnameWithoutLocale.startsWith(route),
  );

  if (isAuthPage) {
    return addSecurityHeaders(response);
  }

  if (!sessionToken) {
    const locale = pathname.split("/")[1] || "en";
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
  }

  return addSecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};

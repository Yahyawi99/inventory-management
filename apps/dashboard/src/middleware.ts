// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authClient } from "./lib/auth-client";

const JWT_SECRET = process.env.JWT_SECRET;

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers to prevent various attacks
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
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

// export async function middleware(request: NextRequest) {
//   const sessionToken =
//     request.cookies.get("better-auth.session_token")?.value ||
//     request.cookies.get("session_token")?.value ||
//     request.cookies.get("better-auth.session-token")?.value ||
//     request.cookies.get("session-token")?.value;

//   if (!sessionToken) {
//     const signInUrl = new URL("/auth/sign-in", request.url);
//     const response = NextResponse.redirect(signInUrl);

//     return addSecurityHeaders(response);
//   }

//   // const url = request.nextUrl.clone();

//   // try {
//   //   const res = await authClient.getSession({
//   //     headers: {
//   //       cookie: req.headers.get("cookie") ?? "",
//   //     },
//   //   });

//   //   const session = res.data;

//   //   if (session?.twoFactor?.enabled && !session?.twoFactor?.verified) {
//   //     // Redirect to /verify-2fa if 2FA required but not completed
//   //     url.pathname = "/verify-2fa";
//   //     return NextResponse.redirect(url);
//   //   }
//   // } catch (err) {
//   //   console.error("Session check failed", err);
//   //   // if session fails completely, maybe force login
//   //   url.pathname = "/auth/sign-in";
//   //   return NextResponse.redirect(url);
//   // }

//   const response = NextResponse.next();
//   return addSecurityHeaders(response);
// }

// middleware.ts

export async function middleware(request: NextRequest) {
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("session_token")?.value ||
    request.cookies.get("better-auth.session-token")?.value ||
    request.cookies.get("session-token")?.value;

  const url = request.nextUrl.clone();
  let response;

  if (!sessionToken) {
    url.pathname = "/auth/sign-in";
    response = NextResponse.redirect(url);
    return addSecurityHeaders(response);
  }

  try {
    const session = await authClient.getSession();

    // If there is no valid user session, redirect to sign-in
    if (!session?.data?.user) {
      url.pathname = "/auth/sign-in";
      response = NextResponse.redirect(url);
    }
    // If the user's email is not yet verified, they are in a 2FA flow
    else if (!session.data.user.emailVerified) {
      // The user is on the correct page, so we don't need to redirect.
      // We just continue to the requested page (which should be /auth/verify-2fa).
      response = NextResponse.next();
    }
    // If the user is fully verified, redirect them to the main application
    else if (session.data.user.emailVerified) {
      url.pathname = "/en"; // Or your main dashboard URL
      response = NextResponse.redirect(url);
    }
    // As a fallback, continue to the requested page
    else {
      response = NextResponse.next();
    }
  } catch (err) {
    console.error("Session check failed in middleware:", err);
    url.pathname = "/auth/sign-in";
    response = NextResponse.redirect(url);
  }

  return addSecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/auth/*|auth/*).*)"],
};

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const url = req.nextUrl.clone();
  url.pathname = `${url.locale}/auth/sign-in`;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header is missing or malformed.");
    return NextResponse.redirect(url);
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.userId as string);
    response.headers.set("x-company-id", payload.companyId as string);

    return response;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api/auth/login|api/auth/register|auth/sign-in|auth/sign-up).*)",
  ],
};

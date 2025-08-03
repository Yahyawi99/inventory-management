// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  console.log("hello");
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Authorization header is missing or malformed." },
      { status: 401 }
    );
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
    return NextResponse.json(
      { message: "Invalid or expired token." },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/orders/:path*", "/api/inventory/:path*"],
};

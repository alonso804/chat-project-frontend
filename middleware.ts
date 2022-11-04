import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup")
  ) {
    return NextResponse.next();
  }

  const jwt = req.cookies.get("token");

  if (!jwt) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};

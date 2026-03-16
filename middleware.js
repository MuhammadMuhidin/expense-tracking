import { NextResponse } from "next/server";

export function middleware(request) {

  const token = request.cookies.get("user")?.value;
  const { pathname } = request.nextUrl;

  /* SKIP API */
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next).*)"]
};
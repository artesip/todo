import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
    return NextResponse.next();
  }

  if (!token && pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

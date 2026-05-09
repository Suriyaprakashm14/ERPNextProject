import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  DEFAULT_AUTH_REDIRECT,
  ERP_NEXT_SESSION_COOKIE,
  LOGIN_ROUTE,
} from "@/lib/auth-config";

const PUBLIC_ROUTES = new Set([LOGIN_ROUTE, "/signup"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const hasSessionCookie = Boolean(
    request.cookies.get(ERP_NEXT_SESSION_COOKIE)?.value,
  );

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(hasSessionCookie ? DEFAULT_AUTH_REDIRECT : LOGIN_ROUTE, request.url),
    );
  }

  if (!hasSessionCookie && !PUBLIC_ROUTES.has(pathname)) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    const nextPath = `${pathname}${search}`;

    loginUrl.searchParams.set("next", nextPath);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

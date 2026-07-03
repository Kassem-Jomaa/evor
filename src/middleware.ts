import { NextResponse, type NextRequest } from "next/server";
import { AUTH_TOKEN_KEY } from "@/config/auth";

/**
 * Server-side gate for the admin dashboard. Runs before any `/admin` page is
 * rendered and redirects requests that carry no auth cookie to the login page,
 * so protected pages (and their server-fetched data) never reach an
 * unauthenticated client. The client-side AuthGuard stays in place as a second
 * layer. `/admin/login` is exempt so the login page itself is reachable.
 *
 * The cookie is presence-checked only — JWT validity is enforced by the backend
 * on each API call. A 401 there clears the cookie, so the next admin navigation
 * is redirected back here.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

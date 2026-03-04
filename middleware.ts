import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const hasAccess = session?.user?.hasBasicAccess;

  const isAppRoute = nextUrl.pathname.startsWith("/app");
  const isAuthRoute = nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");

  // Protect /app routes
  if (isAppRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/checkout?reason=no_access", nextUrl));
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    if (hasAccess) {
      return NextResponse.redirect(new URL("/app", nextUrl));
    }
    return NextResponse.redirect(new URL("/checkout", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};

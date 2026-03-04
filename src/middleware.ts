import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/app", "/app/store", "/app/profile"];
const AUTH_ROUTES = ["/login", "/register"];

export default auth(function middleware(req: NextRequest & { auth: unknown }) {
  const { nextUrl } = req;
  const session = (req as { auth: { user?: { hasBasicAccess?: boolean } } | null }).auth;
  const isLoggedIn = !!session?.user;
  const hasAccess = session?.user?.hasBasicAccess ?? false;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  // Redireciona usuário logado que tenta acessar /login ou /register
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(hasAccess ? "/app" : "/checkout", req.url));
  }

  // Rota protegida sem autenticação → login
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Rota protegida sem acesso pago → checkout
  if (isProtectedRoute && isLoggedIn && !hasAccess) {
    return NextResponse.redirect(new URL("/checkout", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

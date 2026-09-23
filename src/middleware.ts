import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

const PROTECTED_API_PREFIXES = [
  "/api/content",
  "/api/experience",
  "/api/projects",
  "/api/skills",
  "/api/education",
  "/api/upload",
  "/api/contact-messages",
];

function isProtectedApi(pathname: string): boolean {
  return PROTECTED_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isApiUnderAdmin = isProtectedApi(pathname);

  if ((isAdminPage && !isLoginPage) || isApiUnderAdmin) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const valid = await verifySessionToken(token);

    if (!valid) {
      if (isAdminPage) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/content/:path*",
    "/api/experience/:path*",
    "/api/projects/:path*",
    "/api/skills/:path*",
    "/api/education/:path*",
    "/api/upload/:path*",
    "/api/contact-messages/:path*",
  ],
};

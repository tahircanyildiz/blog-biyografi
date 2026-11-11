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
  "/api/social",
];

function isProtectedApi(pathname: string): boolean {
  return PROTECTED_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * SITE_URL "https://www.ornek.com" ise "ornek.com"a gelen istekleri kalıcı
 * olarak www'ye yönlendirir. Önceden iki alan adı da 200 dönüyordu; Google
 * aynı sayfanın iki kopyasını görüp sıralama sinyallerini bölüyordu.
 */
function canonicalHostRedirect(request: NextRequest): NextResponse | null {
  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) return null;

  let canonical: URL;
  try {
    canonical = new URL(siteUrl);
  } catch {
    return null;
  }

  const host = request.headers.get("host")?.toLowerCase();
  if (!host || !canonical.hostname.startsWith("www.")) return null;
  if (host !== canonical.hostname.slice(4)) return null;

  const target = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, canonical.origin);
  return NextResponse.redirect(target, 308);
}

export async function middleware(request: NextRequest) {
  const redirect = canonicalHostRedirect(request);
  if (redirect) return redirect;

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
  // Host yönlendirmesi tüm sayfalarda çalışmalı; statik dosyalar hariç.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Önceden /robots.txt 404 dönüyordu. Arama motorlarına ve AI tarayıcılarına
 * (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) içerik açık; sadece
 * yönetim paneli ve API kapalı. /blog-test sayfaları zaten `noindex` —
 * robots ile engellenirse Google o etiketi göremez, bu yüzden açık bırakıldı.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

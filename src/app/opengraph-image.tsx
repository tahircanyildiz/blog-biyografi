import { getSiteSettings } from "@/lib/content";
import { getAllPostsSafe } from "@/lib/posts";
import { OG_SIZE, renderOgImage } from "@/lib/og";
import { homeDescription, siteName } from "@/lib/seo";
import { SITE_URL, tidy, truncate } from "@/lib/site";

// DB'ye bağlı — build aşamasında (DATABASE_URL yokken) üretilmemeli.
export const dynamic = "force-dynamic";
export const alt = "Kişisel site ve blog — paylaşım görseli";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [settings, posts] = await Promise.all([getSiteSettings(), getAllPostsSafe()]);

  return renderOgImage({
    eyebrow: tidy(settings.roleTitle) || "Kişisel site",
    title: siteName(settings),
    description: truncate(tidy(settings.tagline) || homeDescription(settings), 120),
    footer: new URL(SITE_URL).host.replace(/^www\./, ""),
    photo: settings.profileImage || undefined,
    badge: posts.length > 0 ? `${posts.length} blog yazısı` : undefined,
  });
}

import { getSiteSettings } from "@/lib/content";
import { getAllPostsSafe } from "@/lib/posts";
import { OG_SIZE, renderOgImage } from "@/lib/og";
import { blogDescription, blogTitle, siteName } from "@/lib/seo";
import { SITE_URL, truncate } from "@/lib/site";

export const dynamic = "force-dynamic";
export const alt = "Blog — paylaşım görseli";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function BlogOpenGraphImage() {
  const [settings, posts] = await Promise.all([getSiteSettings(), getAllPostsSafe()]);
  const title = blogTitle(settings);

  return renderOgImage({
    eyebrow: siteName(settings),
    title: title === "Blog" ? `${siteName(settings)} Blog` : title,
    description: truncate(blogDescription(settings), 140),
    footer: `${new URL(SITE_URL).host.replace(/^www\./, "")}/blog`,
    badge: posts.length > 0 ? `${posts.length} yazı` : undefined,
  });
}

import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";
import { getAllPostsSafe } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

// Build-time env vars (BLOG_BASE_URL vb.) Docker build aşamasında mevcut
// olmayabilir; bu route'u request-time'da render ederek build'i buna
// bağımlı olmaktan çıkarıyoruz.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, posts] = await Promise.all([getSiteSettings(), getAllPostsSafe()]);

  const latestPostDate = posts[0]?.updatedAt ?? posts[0]?.publishedAt;
  const homeModified = [settings.updatedAt, latestPostDate ? new Date(latestPostDate) : null]
    .filter((date): date is Date => date instanceof Date && !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const own: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: homeModified, changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPostDate ? new Date(latestPostDate) : undefined,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Yazı listesi SDK'nın sitemapEntries'i yerine paylaşılan (request-cache'li)
  // listeden üretiliyor; blog servisi geçici olarak düşse bile sitemap
  // en azından ana sayfaları döndürür.
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt ?? Date.now()),
    changeFrequency: "weekly",
    priority: 0.7,
    images: post.coverImage?.url ? [post.coverImage.url] : undefined,
  }));

  return [...own, ...postEntries];
}

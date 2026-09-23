import type { MetadataRoute } from "next";
import { blog, SITE_URL } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const own: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1.0 },
    { url: `${SITE_URL}/blog`, priority: 0.8 },
  ];

  const posts = await blog.sitemapEntries({
    origin: SITE_URL,
    pathPrefix: "/blog",
  });

  return [...own, ...posts];
}

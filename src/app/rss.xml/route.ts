import { getSiteSettings } from "@/lib/content";
import { cleanTags, getAllPostsSafe } from "@/lib/posts";
import { blogDescription, blogTitle, siteName } from "@/lib/seo";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

function xml(text: string | null | undefined): string {
  return (text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string | null | undefined): string {
  const date = iso ? new Date(iso) : new Date();
  return (Number.isNaN(date.getTime()) ? new Date() : date).toUTCString();
}

/** RSS 2.0 akışı — Feedly/Inoreader gibi okuyucular ve içerik toplayıcılar için. */
export async function GET() {
  const [settings, posts] = await Promise.all([getSiteSettings(), getAllPostsSafe()]);
  const name = siteName(settings);
  const title = blogTitle(settings) === "Blog" ? `${name} Blog` : blogTitle(settings);

  const items = posts
    .map((post) => {
      const link = absoluteUrl(`/blog/${post.slug}`);
      const categories = cleanTags(post.tags)
        .map((tag) => `      <category>${xml(tag)}</category>`)
        .join("\n");
      const image = post.coverImage?.url
        ? `      <media:content url="${xml(post.coverImage.url)}" medium="image" />`
        : "";

      return [
        "    <item>",
        `      <title>${xml(post.title)}</title>`,
        `      <link>${xml(link)}</link>`,
        `      <guid isPermaLink="true">${xml(link)}</guid>`,
        `      <pubDate>${rfc822(post.publishedAt ?? post.updatedAt)}</pubDate>`,
        `      <dc:creator>${xml(name)}</dc:creator>`,
        post.excerpt ? `      <description>${xml(post.excerpt)}</description>` : "",
        categories,
        image,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${xml(title)}</title>
    <link>${xml(absoluteUrl("/blog"))}</link>
    <description>${xml(blogDescription(settings))}</description>
    <language>tr</language>
    <lastBuildDate>${rfc822(posts[0]?.publishedAt)}</lastBuildDate>
    <atom:link href="${xml(`${SITE_URL}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <image>
      <url>${xml(absoluteUrl("/icon-192.png"))}</url>
      <title>${xml(title)}</title>
      <link>${xml(absoluteUrl("/blog"))}</link>
    </image>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}

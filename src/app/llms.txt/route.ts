import { getHomePageData } from "@/lib/content";
import { getAllPostsSafe } from "@/lib/posts";
import { blogDescription, homeDescription, siteName } from "@/lib/seo";
import { absoluteUrl, isOngoing, tidy, truncate } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * llms.txt (https://llmstxt.org): ChatGPT, Claude, Perplexity gibi AI
 * asistanlarının siteyi hızlıca anlaması için düz metin özet. Google bu
 * dosyayı kullanmıyor; AI aramalarında doğru alıntılanmaya yardımcı olur.
 */
export async function GET() {
  const [{ settings, experience, socialLinks }, posts] = await Promise.all([
    getHomePageData(),
    getAllPostsSafe(),
  ]);

  const name = siteName(settings);
  const current = experience.find((item) => isOngoing(item.endDate));

  const lines: string[] = [
    `# ${name}`,
    "",
    `> ${homeDescription(settings)}`,
    "",
  ];

  const facts = [
    tidy(settings.roleTitle) && `- Unvan: ${tidy(settings.roleTitle)}`,
    current && `- Şu anki pozisyon: ${tidy(current.role)}, ${tidy(current.company)}`,
    tidy(settings.location) && `- Konum: ${tidy(settings.location)}`,
    posts.length > 0 && `- Blog: ${posts.length} yazı (Türkçe)`,
  ].filter(Boolean) as string[];
  if (facts.length) lines.push(...facts, "");

  lines.push(
    "## Sayfalar",
    "",
    `- [Ana sayfa ve özgeçmiş](${absoluteUrl("/")}): Hakkımda, deneyim, yetenekler, eğitim ve iletişim.`,
    `- [Blog](${absoluteUrl("/blog")}): ${blogDescription(settings)}`,
    `- [RSS akışı](${absoluteUrl("/rss.xml")})`,
    `- [Site haritası](${absoluteUrl("/sitemap.xml")})`,
    ""
  );

  if (socialLinks.length > 0) {
    lines.push("## Profiller", "");
    for (const link of socialLinks) lines.push(`- [${link.platform}](${link.url})`);
    lines.push("");
  }

  if (posts.length > 0) {
    lines.push("## Blog yazıları", "");
    for (const post of posts) {
      const summary = truncate(post.excerpt, 160);
      lines.push(
        `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)})${summary ? `: ${summary}` : ""}`
      );
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

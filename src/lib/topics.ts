import type { PostSummary } from "@lobsterlead/blog-sdk";

/**
 * Yazıların çoğunda etiket yok (LobsterLead boş bırakıyor); konu, başlığa
 * (bulunamazsa özete) göre belirlenir. Sıra önemlidir: ilk eşleşen kazanır.
 * Kart üstündeki konu adı ve "benzer yazılar" sıralaması bunu kullanır.
 */
const TOPICS: { name: string; pattern: RegExp }[] = [
  {
    name: "Yazılım geliştirme ve yapay zekâ",
    pattern: /next\.js|\.net\b|c#|\bmcp\b|modern web|yapay zek|\bai\b|typescript|node\.js|react|backend|frontend/i,
  },
  {
    name: "Test otomasyonu araçları",
    pattern: /playwright|cypress|selenium|appium|espresso|rest assured|cucumber|codeless|test otomasyon/i,
  },
  {
    name: "Test türleri ve yöntemler",
    pattern: /regresyon|smoke|sanity|performans|yük test|api test|birim test|unit test|entegrasyon|bdd|test piramidi|bug rapor|hata ayıklama/i,
  },
  { name: "QA ve kariyer", pattern: /qa engineer|sdet|test mühendisi|kariyer|maaş|yol harita|agile/i },
];

export function topicOf(post: Pick<PostSummary, "title" | "excerpt">): string | null {
  const byTitle = TOPICS.find((topic) => topic.pattern.test(post.title));
  if (byTitle) return byTitle.name;
  return TOPICS.find((topic) => topic.pattern.test(post.excerpt ?? ""))?.name ?? null;
}

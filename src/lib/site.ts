/**
 * Site genelinde kullanılan URL/metin yardımcıları. SEO tarafındaki her
 * mutlak URL (canonical, OG, JSON-LD, sitemap, RSS) buradan üretilir ki
 * tek bir `SITE_URL` env değişkeniyle tutarlı kalsın.
 */

export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  ""
);

export const SITE_LOCALE = "tr_TR";
export const SITE_LANGUAGE = "tr-TR";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function fullName(person: { firstName: string; lastName: string }): string {
  return [person.firstName, person.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

/** "İstanbul , Türkiye" gibi elle girilmiş metinlerdeki boşluk hatalarını toparlar. */
export function tidy(text: string | null | undefined): string {
  return (text ?? "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Kelime ortasından kesmeden, sonuna "…" ekleyerek kısaltır. */
export function truncate(text: string | null | undefined, max: number): string {
  const clean = tidy(text);
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.–-]+$/, "")}…`;
}

/** Admin'de girilen "Halen", "Günümüz" gibi bitiş tarihleri devam eden işi gösterir. */
export function isOngoing(endDate: string): boolean {
  return /halen|günümüz|devam|şu an|present|current|now/i.test(endDate);
}

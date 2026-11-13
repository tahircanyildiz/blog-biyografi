export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };

/**
 * Yazı gövdesindeki id'li h2/h3 başlıklarından içindekiler listesi çıkarır.
 * Blog servisi başlıklara id veriyor; id'siz başlıklar (ör. kutu başlıkları)
 * atlanır. Kenar çubuğu kalabalık olmasın diye h3'ler yalnızca az h2 varsa eklenir.
 */
export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const pattern = /<h([23])\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  for (const match of html.matchAll(pattern)) {
    const text = match[3]
      .replace(/<[^>]+>/g, "")
      .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity] ?? entity)
      .trim();
    if (text) items.push({ id: match[2], text, level: match[1] === "2" ? 2 : 3 });
  }
  const h2Count = items.filter((item) => item.level === 2).length;
  return h2Count >= 5 ? items.filter((item) => item.level === 2) : items;
}

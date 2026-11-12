// Sitede yayında olan tüm blog yazılarını listeler (konu tekrarını önlemek ve iç link vermek için).
// Kullanım: node automation/auto-blog/lib/existing-posts.mjs [--json]
const BASE = 'https://blogservice.lobsterlead.com/api/v1/sites/mrpurposeless/posts';
const SITE = 'https://www.tahircanyildiz.com/blog';

const posts = [];
let cursor;
do {
  const qs = new URLSearchParams({ limit: '50', locale: 'tr' });
  if (cursor) qs.set('cursor', cursor);
  const res = await fetch(`${BASE}?${qs}`);
  if (!res.ok) throw new Error(`Liste alınamadı: ${res.status}`);
  const page = await res.json();
  posts.push(...page.posts);
  cursor = page.nextCursor;
} while (cursor);

const rows = posts.map((p) => ({
  date: p.publishedAt?.slice(0, 10),
  slug: p.slug,
  title: p.title,
  tags: (p.tags || []).filter(Boolean),
  url: `${SITE}/${p.slug}`,
}));

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log(`Yayında ${rows.length} yazı var:\n`);
  for (const r of rows) console.log(`${r.date}  ${r.title}\n            ${r.url}`);
}

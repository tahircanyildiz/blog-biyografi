// Son yayınlanan yazılardaki kapak/paylaşım/gövde görsellerini denetler. LobsterLead'in görsel
// seçicisi bir kez çalışma alanındaki "paylaşılan dokümanlar"dan, üçüncü kişinin e-posta adresini
// gösteren bir ekran görüntüsünü kapak yapmıştı; bu betik aynı durumu erken yakalamak içindir.
// Kullanım: node automation/auto-blog/lib/check-covers.mjs <uyarı-kaydı.json>
// Çıktı: sorunlu yazı varsa her biri için bir satır (başlık ve sebep); yoksa boş.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const BASE = 'https://blogservice.lobsterlead.com/api/v1/sites/mrpurposeless/posts';
const ALLOWED = [
  'https://www.tahircanyildiz.com/uploads/',
  'https://storage.googleapis.com/lobsterlead-storage/ws_23/brand_23/media/',
];
const statePath = process.argv[2];
const alerted = new Set(statePath && existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : []);

const { posts } = await (await fetch(`${BASE}?limit=10&locale=tr`)).json();
const since = Date.now() - 3 * 24 * 60 * 60 * 1000;
const lines = [];

for (const p of posts) {
  if (new Date(p.publishedAt).getTime() < since) continue;
  const detail = await (await fetch(`${BASE}/${p.slug}?locale=tr`)).json();
  const urls = [
    detail.post?.coverImage?.url,
    detail.meta?.og?.image,
    ...[...(detail.post?.bodyHtml ?? '').matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]),
  ].filter(Boolean);

  const reasons = new Set();
  for (const url of urls) {
    if (url.includes('/shared/documents/')) reasons.add('paylaşılan dokümanlardan alınmış görsel (ekran görüntüsü olabilir)');
    else if (!ALLOWED.some((prefix) => url.startsWith(prefix))) reasons.add(`beklenmeyen kaynaktan görsel: ${new URL(url).host}`);
  }
  if (reasons.size && !alerted.has(p.slug)) {
    lines.push(`• ${p.title} — ${[...reasons].join('; ')}`);
    alerted.add(p.slug);
  } else if (!reasons.size) {
    // Düzelmiş: kayıttan çıkar ki görsel sonradan geri dönerse yeniden uyarılsın
    alerted.delete(p.slug);
  }
}

if (statePath) writeFileSync(statePath, JSON.stringify([...alerted], null, 2));
if (lines.length) console.log(lines.join('\n'));

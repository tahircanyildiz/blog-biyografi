// Taslak klasöründeki yazıyı LobsterLead'e TASLAK olarak ekler (yayınlamaz) ve önizleme sayfası üretir.
// Kullanım: node automation/auto-blog/lib/create-draft.mjs <taslak-klasörü>
//
// Taslak klasörü şunları içermeli:
//   post.html   gövde HTML'i (sitedeki yazı yapısında)
//   meta.json   { slug, title, metaTitle, metaDescription, excerpt, tags, keywords, cover: { file, alt } }
//   images/     kapak ve gövdedeki tüm görseller (.webp)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
process.loadEnvFile(join(root, '.env'));
const { BLOG_BASE_URL, BLOG_SITE_KEY, BLOG_API_KEY } = process.env;
const SITE = 'https://www.tahircanyildiz.com';

const dir = resolve(process.argv[2] ?? '');
const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'));
const body = readFileSync(join(dir, 'post.html'), 'utf8');

// --- Doğrulamalar: eksik ya da SEO sınırlarını aşan alan varsa taslak oluşturulmaz ---
const problems = [];
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(meta.slug ?? '')) problems.push('slug yalnızca küçük harf, rakam ve tire içermeli');
if (!meta.title) problems.push('title eksik');
if (!meta.metaTitle || meta.metaTitle.length > 60) problems.push(`metaTitle 1-60 karakter olmalı (şu an ${meta.metaTitle?.length ?? 0})`);
if (!meta.metaDescription || meta.metaDescription.length < 120 || meta.metaDescription.length > 160)
  problems.push(`metaDescription 120-160 karakter olmalı (şu an ${meta.metaDescription?.length ?? 0})`);
if (!meta.excerpt) problems.push('excerpt eksik');
if (!meta.cover?.file || !existsSync(join(dir, 'images', meta.cover.file))) problems.push('kapak görseli images/ altında yok');
for (const m of body.matchAll(/src="https:\/\/www\.tahircanyildiz\.com\/uploads\/([^"]+)"/g)) {
  if (!existsSync(join(dir, 'images', m[1]))) problems.push(`gövdedeki görsel images/ altında yok: ${m[1]}`);
}
if (/<script/i.test(body)) problems.push('gövdede ham <script> var; kod örneklerinde &lt; &gt; kullanın');
if (problems.length) {
  console.error('Taslak oluşturulmadı:\n- ' + problems.join('\n- '));
  process.exit(1);
}

const coverUrl = `${SITE}/uploads/${meta.cover.file}`;
const payload = {
  slug: meta.slug,
  locale: 'tr',
  status: 'draft',
  title: meta.title,
  metaDescription: meta.metaDescription,
  excerpt: meta.excerpt,
  bodyHtml: body,
  tags: meta.tags ?? [],
  keywords: meta.keywords ?? '',
  author: { name: 'Tahir Can Yıldız', url: SITE },
  coverImage: { url: coverUrl, alt: meta.cover.alt, width: 1600, height: 900 },
  seoData: { metaTitle: meta.metaTitle, ogImage: coverUrl },
};

const api = `${BLOG_BASE_URL}/api/v1/sites/${BLOG_SITE_KEY}/posts`;
const headers = { 'content-type': 'application/json', 'x-api-key': BLOG_API_KEY };

let res = await fetch(api, { method: 'POST', headers, body: JSON.stringify(payload) });
if (!res.ok) {
  // Aynı slug ile daha önce taslak oluşturulduysa güncelle (yeniden çalıştırmaya dayanıklı)
  const { slug, ...update } = payload;
  res = await fetch(`${api}/${slug}`, { method: 'PATCH', headers, body: JSON.stringify(update) });
}
const json = await res.json().catch(() => ({}));
if (!res.ok || json.post?.status !== 'draft') {
  console.error(`Taslak kaydedilemedi: ${res.status} ${JSON.stringify(json).slice(0, 400)}`);
  process.exit(1);
}

// Sanitize sonrası yapıyı kontrol et
const detail = await (await fetch(`${api}/${meta.slug}?locale=tr&preview=true`, { headers })).json();
const saved = detail.post?.bodyHtml ?? '';
const count = (re) => (saved.match(re) || []).length;
const summary = {
  slug: meta.slug,
  status: json.post.status,
  words: json.post.wordCount,
  minutes: json.post.readingTimeMinutes,
  figures: count(/<figure/g),
  codeBlocks: count(/<pre/g),
  tables: count(/<table/g),
  faqItems: count(/ll-faq-item/g),
  references: count(/<li><span>/g),
  canonical: detail.meta?.canonical,
};
writeFileSync(join(dir, 'draft-result.json'), JSON.stringify(summary, null, 2));

// Yerel önizleme: canlı sitenin CSS'iyle, görseller yerel dosyadan
const home = await (await fetch(`${SITE}/blog`)).text();
const css = home.match(/\/_next\/static\/css\/[a-z0-9]+\.css/)?.[0] ?? '';
const localBody = body.replaceAll(`${SITE}/uploads/`, 'images/');
writeFileSync(
  join(dir, 'preview.html'),
  `<!doctype html><html lang="tr" class="h-full"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>ÖNİZLEME — ${meta.title}</title>
<link rel="stylesheet" href="${SITE}${css}">
<style>.pb{position:sticky;top:0;z-index:10;background:#f59e0b;color:#111;font:600 14px system-ui;padding:8px 16px;text-align:center}</style></head>
<body class="min-h-full bg-bg text-ink antialiased"><div class="pb">TASLAK ÖNİZLEME — henüz yayında değil</div>
<main style="max-width:780px;margin:0 auto;padding:2.5rem 1rem 4rem">
<h1 style="font-size:2.3rem;line-height:1.15;font-weight:600;margin:.5rem 0 1.5rem">${meta.title}</h1>
<img src="images/${meta.cover.file}" alt="" style="width:100%;border-radius:20px;margin-bottom:2rem">
<article class="post-body"><div class="blog-body">${localBody}</div></article></main></body></html>`,
);

console.log(JSON.stringify(summary, null, 2));

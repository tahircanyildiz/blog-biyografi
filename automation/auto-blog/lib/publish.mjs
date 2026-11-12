// Taslağı yayına alır ve canlı sayfayı doğrular. Görseller bu adımdan ÖNCE sunucuya yüklenmiş olmalı
// (publish.sh bunu sırayla yapar). Doğrudan çalıştırmayın; publish.sh kullanın.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
process.loadEnvFile(join(root, '.env'));
const { BLOG_BASE_URL, BLOG_SITE_KEY, BLOG_API_KEY } = process.env;

const dir = resolve(process.argv[2] ?? '');
const metaPath = join(dir, 'meta.json');
const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
const url = `https://www.tahircanyildiz.com/blog/${meta.slug}`;

const res = await fetch(`${BLOG_BASE_URL}/api/v1/sites/${BLOG_SITE_KEY}/posts/${meta.slug}`, {
  method: 'PATCH',
  headers: { 'content-type': 'application/json', 'x-api-key': BLOG_API_KEY },
  body: JSON.stringify({ locale: 'tr', status: 'published', publishedAt: new Date().toISOString() }),
});
const json = await res.json().catch(() => ({}));
if (!res.ok || json.post?.status !== 'published') {
  console.error(`Yayınlanamadı: ${res.status} ${JSON.stringify(json).slice(0, 300)}`);
  process.exit(1);
}

// Sitenin önbelleği nedeniyle sayfanın görünmesi birkaç saniye sürebilir
let status = 0;
for (let i = 0; i < 6 && status !== 200; i++) {
  if (i) await new Promise((r) => setTimeout(r, 5000));
  status = (await fetch(url)).status;
}

meta.published = { at: json.post.publishedAt, url };
writeFileSync(metaPath, JSON.stringify(meta, null, 2));
console.log(`Yayında: ${url} (HTTP ${status})`);
if (status !== 200) process.exit(1);

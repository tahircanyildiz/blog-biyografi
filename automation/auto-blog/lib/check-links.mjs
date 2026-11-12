// Yazıdaki tüm dış linklerin çalıştığını doğrular (yükleme görselleri hariç; onlar yayınlarken yüklenir).
// Kullanım: node automation/auto-blog/lib/check-links.mjs <taslak-klasörü>
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? '');
const html = readFileSync(join(dir, 'post.html'), 'utf8');
const urls = [...new Set([...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]))];

let failed = 0;
for (const url of urls) {
  let status = 0;
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (link-check)' },
      signal: AbortSignal.timeout(20_000),
    });
    status = res.status;
  } catch {
    status = 0;
  }
  const ok = status >= 200 && status < 400;
  if (!ok) failed++;
  console.log(`${ok ? 'OK ' : 'HATA'} ${status} ${url}`);
}

console.log(`\n${urls.length} link, ${failed} hatalı.`);
process.exit(failed ? 1 : 0);

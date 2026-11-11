# Kişisel Portfolyo + Blog

Next.js 15 (App Router) + React 19 + TypeScript ile geliştirilmiş, tek admin
kullanıcılı kişisel portfolyo, biyografi ve blog sitesi. Blog içeriği
`@lobsterlead/blog-sdk` üzerinden Lobster Lead blog servisinden canlı çekilir;
site içeriğinin geri kalanı (`Hero`, `Experience`, `Projects`, `Skills`,
`Education`, `Contact`) `/admin` panelinden yönetilir.

## Teknoloji Yığını

- Next.js 15 / React 19 / TypeScript (strict)
- Tailwind CSS v4 (`globals.css` içinde `@theme` token'ları, açık/koyu tema)
- Animasyonlar saf CSS (scroll-driven `animation-timeline`) — JS kütüphanesi yok
- Prisma + SQLite (dosya tabanlı veritabanı — site içeriği için)
- `@lobsterlead/blog-sdk` (blog içeriği için, harici Lobster Lead servisi)
- `lucide-react` ikonlar

## Yerel Geliştirme

```bash
npm install
cp .env.example .env   # değerleri kendi ortamınıza göre düzenleyin
npx prisma migrate dev
npm run db:seed        # opsiyonel: örnek SiteSettings verisi
npm run dev
```

Site: http://localhost:3000
Admin panel: http://localhost:3000/admin/login

## Ortam Değişkenleri

`.env.example` dosyasına bakın:

| Değişken | Açıklama |
| --- | --- |
| `DATABASE_URL` | SQLite dosya yolu, `prisma/schema.prisma`'ya göre relatif (`file:../data/prod.db`) |
| `ADMIN_PASSWORD` | `/admin/login` girişi için düz metin şifre |
| `ADMIN_SECRET` | Admin session cookie'sini imzalamak için kullanılan HMAC anahtarı |
| `SITE_URL` | Bu sitenin canonical/OG URL'i ve `/sitemap.xml` için kullanılır |
| `BLOG_BASE_URL` | Lobster Lead blog servisinin base URL'i (`https://blogservice.lobsterlead.com`) |
| `BLOG_SITE_KEY` | Lobster Lead'deki site anahtarınız |
| `BLOG_API_KEY` | Lobster Lead API anahtarı (server-only; `NEXT_PUBLIC_` prefix'i kullanılmaz, client bundle'a sızmaz) |

**Not:** `DATABASE_URL` içindeki dosya yolu `prisma/schema.prisma` dosyasının
bulunduğu dizine göre çözümlenir (Prisma'nın davranışı budur), proje köküne
göre değil. Bu yüzden proje kökündeki `./data` klasörüne işaret etmek için yol
`../data/...` şeklinde yazılmalıdır — Docker volume mount'u da bu varsayımla
çalışır.

## Docker ile Kendi VM'inizde Yayınlama

```bash
cp .env.example .env
# .env içindeki ADMIN_PASSWORD, ADMIN_SECRET, BLOG_API_KEY
# değerlerini güçlü, rastgele değerlerle / gerçek Lobster Lead anahtarınızla değiştirin.

docker compose up -d --build
```

- Container ilk ayağa kalkışta `docker-entrypoint.sh` script'i `prisma migrate
  deploy` komutunu otomatik çalıştırır, veritabanı şeması güncel tutulur.
- SQLite veritabanı dosyası `./data` klasöründe (host'ta) kalıcı olarak saklanır.
- Yüklenen görseller `./public/uploads` klasöründe (host'ta) kalıcı olarak saklanır.
- Uygulama container içinde her zaman port `3000`'de çalışır. Host tarafında
  hangi porta eşleneceği `docker-compose.yml`'deki `ports` satırında
  belirlenir (`"3242:3000"` gibi — host'ta başka bir servis kullanmıyorsa
  `"3000:3000"` da yapılabilir). Nginx config'inizdeki `proxy_pass` portunun
  bununla eşleştiğinden emin olun (bkz. `deploy/nginx.conf.example`).

### İlk Admin Şifresini Değiştirme

Admin şifresi bir veritabanı kaydı değil, `.env` dosyasındaki
`ADMIN_PASSWORD` değişkenidir. Değiştirmek için:

1. `.env` dosyasında `ADMIN_PASSWORD` değerini güncelleyin.
2. `docker compose up -d --build` ile container'ı yeniden başlatın (veya
   sadece `docker compose restart app` — env değişikliği için restart yeterli
   olabilir, ama build cache sorunlarını önlemek için `--build` önerilir).

`ADMIN_SECRET` değiştirilirse mevcut tüm admin session cookie'leri geçersiz
olur (kullanıcılar yeniden giriş yapmalı).

### Nginx Reverse Proxy Kurulumu

`deploy/nginx.conf.example` dosyasını referans alın. Özet adımlar:

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/domain.com
sudo nano /etc/nginx/sites-available/domain.com   # domain.com yerine kendi alan adınızı yazın
sudo ln -s /etc/nginx/sites-available/domain.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL için:
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d domain.com -d www.domain.com
```

## Blog Entegrasyonu (Lobster Lead)

Blog içeriği bu proje içinde saklanmaz — `/blog` ve `/blog/[slug]` sayfaları
her istekte `@lobsterlead/blog-sdk` üzerinden Lobster Lead blog servisinden
(`BLOG_BASE_URL` + `BLOG_SITE_KEY`) canlı olarak çekilir (`src/lib/blog.ts`).
Yazı oluşturma/düzenleme/silme Lobster Lead admin panelinden yapılır:

- **Blog admin paneli:** `https://blogservice.lobsterlead.com/admin/sites/<site-key>`
- Bu link, site admin panelindeki (`/admin`) sol menüde de yer alır.

`bodyHtml` Lobster Lead tarafında sanitize edilmiş olarak gelir
(`<script>`, `on*`, `style="..."` strip edilir) ve `.blog-body` class'ı
altında render edilir (`src/app/blog/[slug]/page.tsx`). Bu class'ın stilleri
`src/app/globals.css` içinde, projenin kendi koyu tema token'larına
(`--color-bg`, `--color-surface`, `--color-accent` vb.) uyarlanmış şekilde
tanımlıdır — Lobster Lead tarafından üretilen `ll-*` class adları
**değiştirilmemelidir** (blog servisi bu adlara göre HTML üretir).

## SEO ve Görünürlük

| Ne | Nerede |
| --- | --- |
| Sayfa başlığı/açıklaması (ana sayfa + blog) | `/admin/seo` — boşsa ad/unvan/bio'dan otomatik üretilir (`src/lib/seo.ts`) |
| Canonical, Open Graph, Twitter kartları, RSS keşif linki | Her sayfanın `generateMetadata`'sı |
| Paylaşım görselleri (1200×630, Türkçe font destekli) | `src/app/opengraph-image.tsx`, `src/app/blog/opengraph-image.tsx` |
| JSON-LD: `Person`, `WebSite`, `ProfilePage`, `Blog`, `BlogPosting` (yazar = Person), `BreadcrumbList` | `src/lib/seo.ts` |
| `/robots.txt`, `/sitemap.xml` (görsel ve `lastmod` ile), `/rss.xml`, `/llms.txt`, `/manifest.webmanifest` | `src/app/` altındaki aynı adlı route'lar |
| `domain.com` → `www.domain.com` kalıcı yönlendirme | `src/middleware.ts` (`SITE_URL` www ile başlıyorsa) |
| Blog arama sonuçları (`/blog?q=`) | `noindex, follow` |

Yayın sonrası: Google Search Console'da site doğrulandıktan sonra
`/sitemap.xml` adresini gönderin; Bing Webmaster Tools'a da aynı sitemap
eklenebilir.

### Görseller

- Görsel optimizasyonu açık (`next.config.ts`): profil fotoğrafı ve blog
  kapakları cihaz boyutuna göre WebP olarak sunulur. `sharp`'ın Alpine ikilisi
  `package-lock.json`'da mevcut, ek kurulum gerekmez.
- Admin panelden yüklenen görseller `src/app/uploads/[file]/route.ts`
  üzerinden servis edilir. (Next.js production'da `public/` klasörünü yalnızca
  açılışta taradığı için önceden yeni yüklemeler restart'a kadar 404
  veriyordu.)

## Proje Yapısı

```
prisma/schema.prisma       Veritabanı şeması (SQLite — site içeriği, blog hariç)
src/middleware.ts           Admin sayfaları + içerik-mutasyon API'lerini korur
src/lib/                    Prisma client, auth (HMAC session), blog SDK client
src/app/                    Ana sayfa, /blog (Lobster Lead SDK), /admin, sitemap
src/components/site/        Ana sayfa bölümleri (Hero, Experience, Projects, ...)
src/components/admin/       Admin panel form bileşenleri
src/components/ui/          Paylaşılan UI yardımcıları (RevealOnScroll, GlowCard, JsonLd, SocialIcon)
src/lib/seo.ts              Metadata varsayılanları + JSON-LD üreticileri
src/lib/posts.ts            Yazı listesi (istek başına önbellekli), sayfalama, arama
public/fonts/og/            Paylaşım görselleri için Inter/Fraunces (OFL lisanslı)
```

## Kabul Kriterleri Kontrolü

- `npm run build` hatasız derleniyor
- Admin girişi olmadan `/admin` erişimi `/admin/login`'e yönlendiriliyor
- Admin girişi olmadan içerik API'lerine istek `401` dönüyor
- `/blog` ve `/blog/[slug]` Lobster Lead servisinden veri çekip render ediyor;
  olmayan bir slug için gerçek `404` dönüyor
- `/sitemap.xml` açılıyor, blog yazılarını same-origin URL'lerle içeriyor
- `/robots.txt`, `/rss.xml`, `/llms.txt`, `/opengraph-image` 200 dönüyor
- `prefers-reduced-motion` açıkken animasyonlar devre dışı kalıyor
- Mobilde (375px) yatay taşma yok
- `docker compose up -d --build` sonrası site ayağa kalkıyor, SQLite dosyası
  `./data` altında kalıcı kalıyor

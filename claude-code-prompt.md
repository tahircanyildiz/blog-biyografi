# Kişisel Portfolyo + Blog Sitesi — Claude Code Build Prompt

Bu dosyayı olduğu gibi Claude Code'a (VS Code içinde) yapıştırıp başlayabilirsin.
Referans tasarım: https://bunyaminakdeniz.com/ (yapı ve bölüm sırası neredeyse birebir
alınacak, kendi bilgilerinle dolacak).

---

## 1. ROL VE GENEL ÇERÇEVE

Kıdemli bir full-stack mühendis gibi davran. Üretime hazır, temiz, tip güvenli
(TypeScript strict) kod yaz. Bu bir kişisel portfolyo + biyografi + blog sitesi:
sahibi bunu kendi VM'inde Docker ile barındıracak. Ölçek küçük (tek admin
kullanıcı, düşük-orta trafik) — bu yüzden basit ve bakımı kolay çözümleri
karmaşık/ölçeklenebilir olanlara tercih et.

## 2. TEKNOLOJİ YIĞINI (birebir uy)

- **Next.js 15** (App Router), **React 19**, **TypeScript strict**
- **Tailwind CSS v4** — `tailwind.config` dosyası yok, `globals.css` içinde
  `@import "tailwindcss";` + `@theme { --color-... }` ile design token'ları tanımla.
  `--color-bg` gibi bir token otomatik olarak `bg-bg` gibi utility üretir.
- **Animasyon:** `motion` paketi (Framer Motion'ın yeni adı) →
  `import { motion, useReducedMotion } from "motion/react"`
- **İkonlar:** `lucide-react`
- **ORM/DB:** Prisma + **SQLite** (dosya tabanlı, ayrı DB servisi kurmaya gerek yok;
  `DATABASE_URL="file:./prod.db"`). İleride Postgres'e geçiş gerekirse tek satır
  datasource değişikliği yeterli olacak şekilde Prisma kullan.
- Harici görsel/font CDN'i kullanma; `next/font/google` ile fontu build-time'da
  self-host et (örn. Inter).
- Başka gereksiz bağımlılık ekleme.

## 3. TASARIM SİSTEMİ (frontend-design ilkelerine göre planla, sonra uygula)

Marka zaten referans siteden geliyor (brief sabitlenmiş): koyu, minimalist,
mühendis/geliştirici kimliğine uygun. Bunu birebir kopyalamak yerine "aynı dil,
kendi kişiliği" ilkesiyle uygula — ama kullanıcı "neredeyse birebir aynısı"
istediği için palet ve yapıyı büyük ölçüde koru.

**Renk (4-6 token):**
- `--color-bg: #09090b` (zinc-950, ana arka plan)
- `--color-surface: #18181b` (kartlar)
- `--color-border: #27272a`, `--color-border-hover: #3f3f46`
- `--color-ink: #f4f4f5` (başlık/ana metin), `--color-muted: #a1a1aa` (gövde metni)
- `--color-accent: #f97316` (turuncu, tek vurgu rengi — çok düşük opaklıkta arka
  planda, dolu halde sadece nokta/link/hover'da kullan)

**Tipografi:** Tek font ailesi (Inter veya benzeri geometrik sans), net bir tip
ölçeği (The Elements of Typographic Style mantığıyla): H1 4xl/6xl, kesin
tracking-tight; gövde metni max-width ~65-75 karakter. Başlıkta tek kelimeyi
renklendirme/italik yapma gibi klişelerden kaçın.

**Layout:** Sol hizalı, tek kolon içerik akışı; hero'da metin solda + profil
görseli sağda (masaüstünde), mobilde alt alta. Proje kartları gerçek bir
sıra/sequence olduğu için (01/07 gibi) numaralandırma kullanmak burada meşru —
deneyim zaman çizelgesi solda dikey çizgi + nokta işaretleyicilerle.

**Hareket ilkesi:** Sayfa yüklenince TEK bir orkestre giriş sekansı (hero'da
rozet→başlık→açıklama→butonlar→stat kartları, stagger 0.08s). Diğer bölümler
scroll'da whileInView ile tek seferlik fade+16px yukarı kayma. Kart hover'ında
kenarlıkta mouse'u takip eden radial-gradient ışıma (React state ile re-render
YAPMADAN, CSS custom property `--mx`/`--my` üzerinden). `prefers-reduced-motion`
aktifse tüm hareketleri kapat (`useReducedMotion` + CSS media query fallback).

## 4. SAYFA YAPISI (ana sayfa — tek sayfa, bölümler arası çapa linkleri)

Referans siteyle aynı sıra:
1. **Hero** — rozet, rol başlığı, isim (H1, iki satır), tagline, bio (2 cümle),
   2 buton (birincil: dolu açık renk; ikincil: outline), 3 stat kartı (yıl
   deneyimi / proje sayısı / lokasyon), sağda profil fotoğrafı. Elle yazılmış
   Haikei-tarzı katmanlı SVG dalga arka plan (kütüphane kullanma), altta çok
   düşük opaklıkta `<feTurbulence>` noise dokusu.
2. **About / Hakkımda** — kısa biyografi (admin panelden düzenlenebilir).
3. **Experience** — dikey zaman çizelgesi: rol, şirket, tarih aralığı,
   açıklama, teknoloji etiketleri (chip), 3 ölçülebilir istatistik (örn. "3yr+
   Duration / 5k+ Daily Users / 3 Dev Team").
4. **Projects** — kart listesi: görsel + başlık + açıklama + etiketler +
   Mission/Key Feature/Client alanları + "Detayları Gör" linki. Sıra numarası
   (01/07 vb.) göster çünkü gerçekten sıralı bir liste.
5. **Skills** — kategoriye göre gruplanmış chip'ler (Core Languages, Framework,
   State Management, Backend, Tools vb.)
6. **Education** — ikon + başlık + kurum + tarih + tip (Bachelor's/
   Certification), opsiyonel madde listesi.
7. **Contact** — form (Ad, E-posta, Mesaj), gönderimde loading + başarı/hata
   durumu; ayrıca statik e-posta, lokasyon, GitHub linki.
8. **Footer** — © yıl, isim, "Built with Next.js".

Nav: sticky, scroll'da blur+border kazanır, bölüm linkleri + "Blog" butonu,
mobilde hamburger menü.

## 5. BLOG (`/blog` ve `/blog/[slug]`)

- `/blog`: grid halinde `BlogPost` kartları (kapak görseli, tarih, başlık,
  excerpt, ilk 3 etiket), en yeni üstte.
- `/blog/[slug]`: kapak görseli, başlık, tarih/yazar, içerik (Lobster Lead'den
  gelen HTML — `.prose-blog` custom class ile stillendir, `dangerouslySetInnerHTML`
  kullan ama sadece kendi webhook'undan gelen güvenilir veri için).
- Blog içeriği **sadece Lobster Lead webhook'u üzerinden** gelir, admin panelden
  blog yazısı oluşturma/düzenleme YOK — admin panelden sadece silme/görüntüleme
  yapılabilsin (yanlışlıkla gelen/istenmeyen bir yazıyı kaldırmak için).

### Lobster Lead Webhook — `/api/webhook/lobsterlead`

- `POST`, `Authorization: Bearer <LOBSTERLEAD_WEBHOOK_SECRET>` header'ı ile
  korunur (env'den okunur, cookie/admin session'dan bağımsız — dışarıdan
  Lobster Lead sunucusu çağıracak).
- Gelen JSON alan isimleri Lobster Lead'in gerçek payload'ıyla **birebir
  eşleşmeyebilir**. Kodun içinde TEK bir `mapPayload()` fonksiyonunda tüm alan
  eşlemesini topla (title/slug/content/excerpt/coverImage/tags/publishedAt/author
  için birden fazla olası alan adını kabul et: örn. `content ?? html ?? body`),
  böylece gerçek formatı görünce tek yerden düzeltilebilsin.
- `slug` yoksa `title`'dan otomatik üret (Türkçe karakterleri normalize et).
- Var olan slug'a tekrar post gelirse **upsert** yap (güncelle), yoksa oluştur.
- Geçersiz/eksik `title`/`content` gelirse 400 dön, geçersiz token'da 401.
- **NOT:** Lobster Lead hesabındaki gerçek webhook örnek payload'ını al, bu
  fonksiyonu ona göre kesinleştir.

## 6. ADMİN PANELİ (`/admin`)

- **Blog dışındaki her şey** admin panelden düzenlenebilir: Hero/About metni,
  stat değerleri, profil fotoğrafı, Experience (ekle/düzenle/sil/sırala),
  Projects (ekle/düzenle/sil/sırala, görsel yükleme), Skills (kategori bazlı
  ekle/düzenle/sil), Education (ekle/düzenle/sil), Contact bilgileri (email,
  github, lokasyon) + gelen iletişim formu mesajlarının listesi.
- **Auth:** Tam kullanıcı sistemi yok — tek bir `ADMIN_PASSWORD` env değişkeni.
  `/admin/login` şifreyi POST eder, doğruysa **imzalı, HttpOnly, Secure**
  (production'da) bir session cookie set edilir (HMAC-SHA256, `ADMIN_SECRET`
  env ile imzalanmış `expiry.signature` formatında token, 7 gün TTL).
  - **ÖNEMLİ:** Next.js middleware **Edge runtime**'da çalışır ve Node'un
    `crypto` modülünü (createHmac) DESTEKLEMEZ. İmzalama/doğrulama için
    **Web Crypto API** (`crypto.subtle.importKey` + `crypto.subtle.sign`,
    `HMAC`/`SHA-256`) kullan — bu hem middleware'de hem normal route'larda
    çalışır. Bu noktayı atlarsan build sonrası admin girişi middleware'de
    sessizce patlar.
  - `src/middleware.ts` içinde `/admin/*` (login hariç) ve tüm içerik-mutasyon
    API route'larını (`/api/content`, `/api/experience`, `/api/projects`,
    `/api/skills`, `/api/education`, `/api/blog` [silme], `/api/upload`)
    cookie kontrolüyle koru. `/api/webhook/lobsterlead` ve `/api/contact`
    (POST) middleware koruması DIŞINDA kalmalı (biri Lobster Lead'in Bearer
    token'ıyla, diğeri herkese açık form submit'i).
- Admin dashboard: sol menüde bölümler (Hero, Experience, Projects, Skills,
  Education, Contact & Mesajlar, Blog Yazıları [salt-okunur + sil]), sağda ilgili
  form. Kaydet butonunda loading state + başarı toast'ı (kütüphanesiz, basit).
- Görsel yükleme: `/api/upload` — sadece jpg/png/webp/gif, max 5MB, dosyayı
  `public/uploads/<uuid>.<ext>` olarak diske yaz, URL döndür. (VM'de bu klasör
  Docker volume olarak mount edilmeli — bkz. bölüm 7.)

## 7. VERİTABANI ŞEMASI (Prisma, taslak — gerekirse genişlet)

```prisma
model SiteSettings {
  id Int @id @default(1)
  firstName String   lastName String   roleTitle String
  tagline String      bio String
  statYearsLabel String  statYearsValue String
  statProjLabel String  statProjValue String
  location String   profileImage String
  email String   githubUrl String   linkedinUrl String
  footerNote String
  updatedAt DateTime @updatedAt
}
model Experience {
  id String @id @default(cuid())  order Int
  role String  company String  employment String
  startDate String  endDate String  description String
  tags String // virgülle ayrılmış
  stat1Label String  stat1Value String
  stat2Label String  stat2Value String
  stat3Label String  stat3Value String
}
model Project {
  id String @id @default(cuid())  order Int
  title String  eyebrow1 String  eyebrow2 String
  description String  tags String
  mission String  keyFeature String  clientName String
  coverImage String  liveUrl String
}
model SkillGroup {
  id String @id @default(cuid())  order Int
  category String  subcategory String  items String // virgülle ayrılmış
}
model Education {
  id String @id @default(cuid())  order Int
  icon String  title String  institution String
  period String  type String  bullets String // \n ile ayrılmış
}
model BlogPost {
  id String @id @default(cuid())  slug String @unique
  title String  excerpt String  content String  coverImage String
  author String  tags String  publishedAt DateTime @default(now())
  source String @default("lobsterlead")  createdAt DateTime @default(now())
}
model ContactMessage {
  id String @id @default(cuid())
  name String  email String  message String
  createdAt DateTime @default(now())  read Boolean @default(false)
}
```

## 8. DEPLOYMENT — KENDİ VM'İ ÜZERİNDE DOCKER

- `next.config.ts` içinde `output: "standalone"` (küçük Docker imajı için).
- **Dockerfile:** multi-stage (deps → build → runner), `node:22-alpine` tabanlı,
  `prisma generate` build aşamasında çalışsın, runner aşamasında `.next/standalone`
  + `.next/static` + `public/` kopyalanır.
- **docker-compose.yml:** tek servis (`app`), `./data:/app/data` (SQLite dosyası
  için) ve `./public/uploads:/app/public/uploads` volume'ları, `.env` dosyasından
  env değişkenleri (`ADMIN_PASSWORD`, `ADMIN_SECRET`, `LOBSTERLEAD_WEBHOOK_SECRET`,
  `DATABASE_URL`), port `3000:3000`.
- Container ilk ayağa kalkışta `prisma migrate deploy` çalıştıran bir entrypoint
  script'i ekle (migration'ları otomatik uygula).
- **Nginx (host üzerinde, container dışında) örnek config** üret: reverse proxy
  `location / { proxy_pass http://127.0.0.1:3000; }`, `client_max_body_size 10M;`
  (görsel yükleme için), certbot ile SSL notu.
- `.env.example` dosyası tüm gerekli değişkenlerle.
- `README.md`: `docker compose up -d --build`, ilk admin şifresini nasıl
  değiştireceği, Lobster Lead webhook URL'sini panellerine nasıl gireceği
  (`https://domain.com/api/webhook/lobsterlead` + secret) adım adım.

## 9. KOD KURALLARI

- Her dosyanın gerektiği yerde `"use client"` (sadece interaktif/animasyonlu
  bileşenlerde; sunucu bileşenlerini varsayılan bırak, DB sorgularını server
  component'lerde yap).
- Hiç `any` tipi yok.
- Semantik HTML (`section`, `h1`, `nav`, `button`), görünür `focus-visible`
  halkası, dekoratif SVG'lerde `aria-hidden`.
- Mobil öncelikli, 375px'te yatay scroll YOK.
- `prefers-reduced-motion`'da animasyon yok.

## 10. KABUL KRİTERLERİ (göndermeden önce kontrol et)

- [ ] `npm run build` hatasız derleniyor
- [ ] Admin girişi olmadan `/admin` erişimi `/admin/login`'e yönleniyor
- [ ] Admin girişi olmadan içerik API'lerine istek 401 dönüyor
- [ ] Lobster Lead webhook'u yanlış token'la 401, doğru token + eksik title ile
      400 dönüyor
- [ ] Reduced-motion açıkken hiçbir animasyon oynamıyor
- [ ] Mobilde (375px) hiçbir bölümde yatay taşma yok
- [ ] Docker Compose ile temiz bir ortamda `docker compose up -d --build` sonrası
      site ayağa kalkıyor ve SQLite dosyası `./data` altında kalıcı

---

**Ekleme notu:** Bu prompt tek seferde tüm dosyaları oluşturmanı bekliyor; büyük
olduğu için Claude Code'a önce 3-4'lük gruplar halinde (1-config+schema,
2-lib/middleware/API, 3-UI bileşenleri+sayfalar, 4-admin panel, 5-Docker/README)
ilerlemesini söyleyebilirsin.

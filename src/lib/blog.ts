import { BlogClient } from "@lobsterlead/blog-sdk";

let client: BlogClient | undefined;

function getClient(): BlogClient {
  if (!client) {
    client = new BlogClient({
      baseUrl: process.env.BLOG_BASE_URL!,
      siteKey: process.env.BLOG_SITE_KEY!,
      apiKey: process.env.BLOG_API_KEY,
      // Sayfalar zaten `force-dynamic` (her istekte sunucu render) ama
      // Next'in fetch veri önbelleği bundan bağımsız çalışır — revalidate
      // süresi yeni yayımlanan yazıların /blog listesinde görünmesini
      // geciktiriyordu. Düşük trafikli kişisel site için maliyeti önemsiz
      // olduğundan tamamen önbelleksiz (her zaman taze) bırakıyoruz.
      fetchInit: { cache: "no-store" },
    });
  }
  return client;
}

// BlogClient'ı ilk gerçek kullanımda (request-time) oluşturur, modül
// import edilir edilmez değil — Docker build aşamasında BLOG_BASE_URL
// gibi env değişkenleri henüz mevcut olmayabileceği için bu önemli.
export const blog = new Proxy({} as BlogClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});

export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

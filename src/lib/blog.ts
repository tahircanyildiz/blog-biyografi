import { BlogClient } from "@lobsterlead/blog-sdk";

let client: BlogClient | undefined;

function getClient(): BlogClient {
  if (!client) {
    client = new BlogClient({
      baseUrl: process.env.BLOG_BASE_URL!,
      siteKey: process.env.BLOG_SITE_KEY!,
      apiKey: process.env.BLOG_API_KEY,
      fetchInit: { next: { revalidate: 300, tags: ["blog"] } },
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

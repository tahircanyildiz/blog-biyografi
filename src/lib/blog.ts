import { BlogClient } from "@lobsterlead/blog-sdk";

export const blog = new BlogClient({
  baseUrl: process.env.BLOG_BASE_URL!,
  siteKey: process.env.BLOG_SITE_KEY!,
  apiKey: process.env.BLOG_API_KEY,
  fetchInit: { next: { revalidate: 300, tags: ["blog"] } },
});

export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

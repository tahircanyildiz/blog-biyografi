import { cache } from "react";
import type { PostSummary } from "@lobsterlead/blog-sdk";
import { blog } from "@/lib/blog";

export const BLOG_LOCALE = "tr";

/** /blog ilk sayfası: 1 öne çıkan yazı + ızgarada bu kadar yazı. */
export const FIRST_PAGE_GRID_SIZE = 12;
/** /blog?sayfa=2 ve sonrası: sayfa başına yazı sayısı. */
export const PAGE_SIZE = 12;

function timeOf(post: Pick<PostSummary, "publishedAt" | "updatedAt">): number {
  const value = post.publishedAt ?? post.updatedAt;
  const time = value ? new Date(value).getTime() : 0;
  return Number.isNaN(time) ? 0 : time;
}

/**
 * Yayındaki tüm yazılar, en yeniden eskiye. `cache()` sayesinde aynı istekte
 * (header, sayfa, footer, JSON-LD) birden fazla çağrılsa da API'ye bir kez
 * gidilir; SDK sayfalamayı kendi içinde hallediyor.
 */
export const getAllPosts = cache(async (): Promise<PostSummary[]> => {
  const posts: PostSummary[] = [];
  for await (const post of blog.posts.all({ locale: BLOG_LOCALE })) {
    posts.push(post);
  }
  return posts.sort((a, b) => timeOf(b) - timeOf(a));
});

/**
 * Blog servisi geçici olarak erişilemezse ana sayfa/footer gibi blog'a
 * bağımlı olmayan sayfalar çökmesin diye boş listeye düşer.
 */
export async function getAllPostsSafe(): Promise<PostSummary[]> {
  try {
    return await getAllPosts();
  } catch (error) {
    console.error("[blog] Yazı listesi alınamadı:", error);
    return [];
  }
}

/** generateMetadata ve sayfa aynı istekte aynı yazıyı iki kez çekmesin. */
export const getPost = cache((slug: string) =>
  blog.posts.get(slug, { locale: BLOG_LOCALE })
);

/** Blog servisi etiketsiz yazılar için `[""]` döndürüyor; boşları atar. */
export function cleanTags(tags: string[] | null | undefined): string[] {
  return (tags ?? []).map((tag) => tag.trim()).filter(Boolean);
}

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

/** Son `days` gün içinde yayımlandıysa "Yeni" rozeti gösterilir. */
export function isRecent(iso: string | null | undefined, days = 3): boolean {
  if (!iso) return false;
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return false;
  return Date.now() - time < days * 24 * 60 * 60 * 1000;
}

export function totalPages(postCount: number): number {
  if (postCount <= 1 + FIRST_PAGE_GRID_SIZE) return 1;
  return 1 + Math.ceil((postCount - 1 - FIRST_PAGE_GRID_SIZE) / PAGE_SIZE);
}

/** Sayfa 1: öne çıkan + ızgara; sonraki sayfalar: sadece ızgara. */
export function paginate(posts: PostSummary[], page: number) {
  if (page <= 1) {
    return {
      featured: posts[0] ?? null,
      grid: posts.slice(1, 1 + FIRST_PAGE_GRID_SIZE),
    };
  }
  const start = 1 + FIRST_PAGE_GRID_SIZE + (page - 2) * PAGE_SIZE;
  return { featured: null, grid: posts.slice(start, start + PAGE_SIZE) };
}

/** Türkçe büyük/küçük harf ve aksan farklarını yok sayan basit arama. */
function normalizeForSearch(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i");
}

export function searchPosts(posts: PostSummary[], query: string): PostSummary[] {
  const terms = normalizeForSearch(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return posts.filter((post) => {
    const haystack = normalizeForSearch(
      [post.title, post.excerpt ?? "", ...cleanTags(post.tags)].join(" ")
    );
    return terms.every((term) => haystack.includes(term));
  });
}

/** Yazı detay sayfasının altındaki önceki/sonraki ve "diğer yazılar" listesi. */
export function getAdjacentPosts(posts: PostSummary[], slug: string) {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return { newer: null, older: null, more: posts.slice(0, 3) };
  }

  const newer = index > 0 ? posts[index - 1] : null;
  const older = index < posts.length - 1 ? posts[index + 1] : null;
  const exclude = new Set([slug, newer?.slug, older?.slug]);
  const currentTags = new Set(cleanTags(posts[index].tags));

  const more = posts
    .filter((post) => !exclude.has(post.slug))
    .map((post, order) => ({
      post,
      order,
      shared: cleanTags(post.tags).filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared || a.order - b.order)
    .slice(0, 3)
    .map((entry) => entry.post);

  return { newer, older, more };
}

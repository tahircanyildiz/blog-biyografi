/**
 * "/blog-test" için deneysel istemci — LobsterLead'in yeni preprod REST
 * API'si (https://preprod-next.lobsterlead.com/developers). Bunun için
 * henüz bir SDK yok (mevcut @lobsterlead/blog-sdk eski/farklı bir servise
 * bağlanıyor — src/lib/blog.ts), bu yüzden düz fetch ile yazıldı.
 *
 * Mevcut /blog akışına ("gerçek" siteye) hiç dokunmuyor; tamamen ayrı bir
 * env/route/lib seti.
 */

export interface TestPostImage {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface TestPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  featured_image: TestPostImage | null;
  images: TestPostImage[];
  tags: string[];
  categories: string[];
  seo: {
    title: string;
    description: string;
    og_image: string | null;
  };
  language: string;
  published_at: string;
  updated_at: string;
}

export interface TestPostList {
  data: TestPost[];
  next_cursor: string | null;
}

export class LobsterLeadTestApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "LobsterLeadTestApiError";
  }
}

function getConfig() {
  const baseUrl = process.env.LOBSTERLEAD_TEST_API_BASE;
  const apiKey = process.env.LOBSTERLEAD_TEST_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "LOBSTERLEAD_TEST_API_BASE / LOBSTERLEAD_TEST_API_KEY env değişkenleri eksik"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

async function request<T>(path: string): Promise<T> {
  const { baseUrl, apiKey } = getConfig();

  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const code = body?.error?.code ?? "unknown_error";
    const message = body?.error?.message ?? `HTTP ${res.status}`;
    throw new LobsterLeadTestApiError(res.status, code, message);
  }

  return res.json();
}

export function listTestPosts(params: {
  limit?: number;
  language?: string;
  cursor?: string;
} = {}): Promise<TestPostList> {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.language) qs.set("language", params.language);
  if (params.cursor) qs.set("cursor", params.cursor);
  const suffix = qs.toString() ? `?${qs}` : "";
  return request<TestPostList>(`/posts${suffix}`);
}

export function getTestPostBySlug(
  slug: string,
  language?: string
): Promise<{ data: TestPost }> {
  const qs = language ? `?language=${encodeURIComponent(language)}` : "";
  return request<{ data: TestPost }>(
    `/posts/by-slug/${encodeURIComponent(slug)}${qs}`
  );
}

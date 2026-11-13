import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Rss, Search, X } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { getAllPosts, paginate, searchPosts, totalPages } from "@/lib/posts";
import {
  alternates,
  blogDescription,
  blogNode,
  blogTitle,
  breadcrumbNode,
  graph,
  openGraph,
  siteName,
} from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PostCard } from "@/components/site/PostCard";
import { Pagination, pageHref } from "@/components/site/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface BlogPageProps {
  searchParams: SearchParams;
}

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function parsePage(value: string): number {
  if (!value) return 1;
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : Number.NaN;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = parsePage(first(params.sayfa));
  const query = first(params.q);
  const settings = await getSiteSettings();

  const baseTitle = blogTitle(settings);
  const title = page > 1 ? `${baseTitle} – Sayfa ${page}` : baseTitle;
  // Paylaşımlarda tek başına "Blog" yazmasın; sitenin adı da görünsün.
  const shareTitle = `${title} | ${siteName(settings)}`;
  const description = blogDescription(settings);
  const canonical = pageHref(Number.isNaN(page) ? 1 : page);

  return {
    title,
    description,
    alternates: alternates(settings, canonical),
    // Arama sonuç sayfaları ince/tekrarlı içerik — dizine eklenmesin, linkler takip edilsin.
    robots: query ? { index: false, follow: true } : undefined,
    openGraph: openGraph(settings, {
      type: "website",
      url: absoluteUrl(canonical),
      title: shareTitle,
      description,
      images: [{ url: "/blog/opengraph-image", width: 1200, height: 630, alt: shareTitle }],
    }),
    twitter: { card: "summary_large_image", title: shareTitle, description },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const query = first(params.q);
  const page = parsePage(first(params.sayfa));

  const [settings, posts] = await Promise.all([getSiteSettings(), getAllPosts()]);
  const pageCount = totalPages(posts.length);

  if (Number.isNaN(page) || (page > pageCount && !query)) notFound();

  const title = blogTitle(settings);
  const description = blogDescription(settings);
  const results = query ? searchPosts(posts, query) : [];
  const { featured, grid } = query ? { featured: null, grid: results } : paginate(posts, page);

  const crumbs = [
    { name: "Ana sayfa", path: "/" },
    { name: title, path: "/blog" },
  ];

  return (
    <>
      <JsonLd
        data={graph(blogNode(settings, [featured, ...grid].filter((p) => p !== null)), breadcrumbNode(crumbs))}
      />

      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="relative isolate overflow-hidden border-b border-border">
          <div aria-hidden className="hero-aurora -z-10" />
          <div aria-hidden className="hero-grid -z-10" />

          <div className="mx-auto max-w-6xl px-6 pb-14 pt-8 md:pb-20 md:pt-12">
            <Breadcrumbs items={crumbs} />
            <h1 className="mt-6 font-serif text-5xl font-semibold tracking-tight text-balance text-ink md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <form action="/blog" role="search" className="relative w-full sm:max-w-md">
                <label htmlFor="blog-search" className="sr-only">
                  Yazılarda ara
                </label>
                <Search
                  size={18}
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  id="blog-search"
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder={`${posts.length} yazı içinde ara…`}
                  className="h-12 w-full rounded-full border border-border bg-surface/80 pl-11 pr-4 text-ink shadow-sm outline-none backdrop-blur transition-colors placeholder:text-muted focus:border-accent-ink"
                />
              </form>
              <a href="/rss.xml" className="btn btn-secondary h-12">
                <Rss size={16} aria-hidden />
                RSS
              </a>
            </div>
          </div>
        </section>

        <section aria-label="Yazılar" className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          {query && (
            <div className="mb-8 flex flex-wrap items-center gap-3 text-ink-2" role="status">
              <span>
                <strong className="text-ink">“{query}”</strong> için {results.length} sonuç bulundu.
              </span>
              <Link href="/blog" className="chip hover:text-accent-ink">
                <X size={14} aria-hidden />
                Aramayı temizle
              </Link>
            </div>
          )}

          {page > 1 && !query && (
            <p className="mb-8 text-sm text-muted">
              Sayfa {page} / {pageCount}
            </p>
          )}

          {featured && (
            <div className="mb-10">
              <PostCard post={featured} variant="featured" headingLevel="h2" wide priority />
            </div>
          )}

          {grid.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((post, index) => (
                <div key={post.id} className={index < 3 ? "" : "reveal"}>
                  <PostCard post={post} headingLevel="h2" priority={!featured && index === 0} />
                </div>
              ))}
            </div>
          ) : (
            !featured && (
              <div className="card p-10 text-center">
                <p className="text-lg font-semibold text-ink">
                  {query ? "Aramanızla eşleşen yazı bulunamadı." : "Henüz yayınlanmış yazı yok."}
                </p>
                {query && (
                  <p className="mt-2 text-muted">
                    Farklı bir kelime deneyin ya da{" "}
                    <Link href="/blog" className="font-semibold text-accent-ink">
                      tüm yazılara göz atın
                    </Link>
                    .
                  </p>
                )}
              </div>
            )
          )}

          {!query && <Pagination page={page} pageCount={pageCount} />}
        </section>
      </main>

      <Footer />
    </>
  );
}

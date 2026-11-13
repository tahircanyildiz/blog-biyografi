import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
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
        <section>
          <div className="mx-auto max-w-6xl px-6 pb-10 pt-8 md:pb-14 md:pt-12">
            <Breadcrumbs items={crumbs} />
            <h1 className="mt-8 max-w-[18ch] font-serif text-5xl font-medium leading-[1.02] tracking-[-0.025em] text-ink md:text-[4.25rem]">
              {title}
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-2">{description}</p>

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
                  className="h-11 w-full rounded-lg border border-border bg-surface pl-11 pr-4 text-base text-ink transition-colors placeholder:text-muted hover:border-border-hover"
                />
              </form>
              <a href="/rss.xml" className="text-link text-sm sm:ml-2">
                RSS ile takip et
              </a>
            </div>
          </div>
        </section>

        <section aria-label="Yazılar" className="mx-auto max-w-6xl px-6 pb-16">
          <div className="border-t border-border pt-10">
          {query && (
            <div className="mb-8 flex flex-wrap items-center gap-3 text-ink-2" role="status">
              <span>
                <strong className="text-ink">“{query}”</strong> için {results.length} sonuç bulundu.
              </span>
              <Link href="/blog" className="text-link text-sm">
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
            <div className="mb-14">
              <PostCard post={featured} variant="featured" headingLevel="h2" wide priority />
            </div>
          )}

          {grid.length > 0 ? (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((post, index) => (
                <PostCard key={post.id} post={post} headingLevel="h2" priority={!featured && index === 0} />
              ))}
            </div>
          ) : (
            !featured && (
              <div className="py-10">
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
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

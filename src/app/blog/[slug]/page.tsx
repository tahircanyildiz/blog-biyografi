import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, RefreshCw } from "lucide-react";
import { BlogApiError } from "@lobsterlead/blog-sdk";
import { toNextMetadata } from "@lobsterlead/blog-sdk/next";
import { getSiteSettings, getSocialLinks } from "@/lib/content";
import { cleanTags, formatDate, getAdjacentPosts, getAllPostsSafe, getPost } from "@/lib/posts";
import { alternates, blogTitle, breadcrumbNode, graph, postNode, siteName } from "@/lib/seo";
import { SITE_LOCALE, absoluteUrl } from "@/lib/site";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PostCard } from "@/components/site/PostCard";
import { AuthorCard } from "@/components/site/AuthorCard";
import { ShareButtons } from "@/components/site/ShareButtons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function loadPost(slug: string) {
  try {
    return await getPost(slug);
  } catch (error) {
    if (error instanceof BlogApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [detail, settings] = await Promise.all([loadPost(slug), getSiteSettings()]);
  if (!detail) return {};

  // Meta değerleri blog servisinden gelir (AGENTS.md: elle yazma). Sadece
  // Next'e özgü düzeltmeler: başlık şablonu uygulanmasın (SERP'te 60
  // karakteri aşmasın), og:locale doğru formatta olsun, yazar eklensin.
  const meta = toNextMetadata(detail.meta);
  const name = siteName(settings);

  return {
    ...meta,
    title: { absolute: meta.title },
    authors: [{ name, url: absoluteUrl("/") }],
    alternates: alternates(settings, meta.alternates.canonical),
    openGraph: {
      ...meta.openGraph,
      locale: SITE_LOCALE,
      authors: [name],
      images: meta.openGraph.images.length > 0 ? meta.openGraph.images : ["/opengraph-image"],
    },
    twitter: {
      ...meta.twitter,
      images: meta.twitter.images ?? meta.openGraph.images.map((image) => image.url),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [detail, settings, socialLinks, allPosts] = await Promise.all([
    loadPost(slug),
    getSiteSettings(),
    getSocialLinks(),
    getAllPostsSafe(),
  ]);

  if (!detail) notFound();

  const { post, meta } = detail;
  const url = meta.canonical || absoluteUrl(`/blog/${post.slug}`);
  const tags = cleanTags(post.tags);
  const published = post.publishedAt ?? post.createdAt;
  const updatedLater =
    post.updatedAt &&
    new Date(post.updatedAt).getTime() - new Date(published).getTime() > 24 * 60 * 60 * 1000;
  const dek = post.metaDescription || meta.description;
  const { newer, older, more } = getAdjacentPosts(allPosts, post.slug);

  const crumbs = [
    { name: "Ana sayfa", path: "/" },
    { name: blogTitle(settings), path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={graph(postNode(detail, settings), breadcrumbNode(crumbs))} />
      <div aria-hidden className="reading-progress" />

      <SiteHeader />

      <main id="main" className="flex-1">
        <article>
          <header className="relative isolate overflow-hidden">
            <div aria-hidden className="hero-aurora -z-10 opacity-50" />
            <div className="mx-auto max-w-3xl px-6 pt-8 md:pt-12">
              <Breadcrumbs items={crumbs} />

              {tags.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-balance text-ink md:text-5xl">
                {post.title}
              </h1>

              {dek && <p className="mt-5 text-lg leading-relaxed text-ink-2 md:text-xl">{dek}</p>}

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-border py-4 text-sm text-muted">
                <Link href="/#about" rel="author" className="group inline-flex items-center gap-2.5">
                  {settings.profileImage && (
                    <span className="relative size-9 overflow-hidden rounded-full border border-border">
                      <Image src={settings.profileImage} alt="" fill sizes="36px" className="object-cover" />
                    </span>
                  )}
                  <span className="font-semibold text-ink group-hover:text-accent-ink">{siteName(settings)}</span>
                </Link>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={15} aria-hidden />
                  <time dateTime={published}>{formatDate(published)}</time>
                </span>
                {post.readingTimeMinutes > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={15} aria-hidden />
                    {post.readingTimeMinutes} dk okuma
                  </span>
                )}
                {updatedLater && (
                  <span className="inline-flex items-center gap-1.5">
                    <RefreshCw size={14} aria-hidden />
                    Güncellendi: <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                  </span>
                )}
              </div>
            </div>

            {post.coverImage?.url && (
              <figure className="mx-auto mt-10 max-w-5xl px-6">
                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-surface-2 shadow-2xl shadow-black/20">
                  <Image
                    src={post.coverImage.url}
                    alt={post.coverImage.alt || post.title}
                    fill
                    sizes="(min-width: 1024px) 976px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </figure>
            )}
          </header>

          <div className="mx-auto max-w-3xl px-6 pb-8 pt-12 md:pt-14">
            <div className="blog-body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />

            <div className="mt-14 border-t border-border pt-8">
              <ShareButtons url={url} title={post.title} />
            </div>

            <div className="mt-10">
              <AuthorCard settings={settings} socialLinks={socialLinks} />
            </div>

            {(newer || older) && (
              <nav aria-label="Diğer yazılar" className="mt-10 grid gap-4 sm:grid-cols-2">
                {older ? (
                  <Link href={`/blog/${older.slug}`} className="group card card-hover p-5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                      <ArrowLeft size={14} aria-hidden /> Önceki yazı
                    </span>
                    <span className="mt-2 line-clamp-2 block font-semibold leading-snug text-ink group-hover:text-accent-ink">
                      {older.title}
                    </span>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}
                {newer && (
                  <Link href={`/blog/${newer.slug}`} className="group card card-hover p-5 sm:text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                      Sonraki yazı <ArrowRight size={14} aria-hidden />
                    </span>
                    <span className="mt-2 line-clamp-2 block font-semibold leading-snug text-ink group-hover:text-accent-ink">
                      {newer.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </div>
        </article>

        {more.length > 0 && (
          <section aria-labelledby="more-posts-heading" className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex items-end justify-between gap-4">
              <h2 id="more-posts-heading" className="font-serif text-3xl font-semibold tracking-tight text-ink">
                Bunlar da ilginizi çekebilir
              </h2>
              <Link href="/blog" className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-accent-ink sm:inline-flex">
                Tüm yazılar <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((item) => (
                <div key={item.id} className="reveal">
                  <PostCard post={item} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

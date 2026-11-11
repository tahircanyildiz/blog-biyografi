import Link from "next/link";
import type { Metadata } from "next";
import { listTestPosts } from "@/lib/blogTest";
import { cleanTags } from "@/lib/posts";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog Test",
  robots: { index: false, follow: false },
};

export default async function BlogTestPage() {
  // Dil filtresi verilmiyor — test hesabında hem TR hem EN yazı
  // yayınlanabiliyor, hepsi listede görünsün istiyoruz.
  const { data: posts } = await listTestPosts({ limit: 20 });

  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-20">
          <RevealOnScroll>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Deneysel — LobsterLead preprod API
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              Blog Test
            </h1>
          </RevealOnScroll>

          {posts.length === 0 ? (
            <p className="mt-8 text-muted">Henüz yayınlanmış yazı yok.</p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {posts.map((post) => (
                <RevealOnScroll key={post.id}>
                  <Link
                    href={`/blog-test/${post.slug}`}
                    className="card card-hover block overflow-hidden rounded-2xl"
                  >
                    {post.featured_image && (
                      <div className="relative h-44 w-full overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.featured_image.url}
                          alt={post.featured_image.alt || post.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {post.published_at && (
                        <time className="text-xs text-muted">
                          {new Date(post.published_at).toLocaleDateString("tr-TR")}
                        </time>
                      )}
                      <h2 className="mt-2 text-lg font-semibold text-ink">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted">
                          {post.excerpt}
                        </p>
                      )}
                      {cleanTags(post.tags).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {cleanTags(post.tags).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

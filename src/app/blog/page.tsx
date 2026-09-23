import Link from "next/link";
import type { Metadata } from "next";
import { blog } from "@/lib/blog";
import { getSiteSettings } from "@/lib/content";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const [settings, { posts }] = await Promise.all([
    getSiteSettings(),
    blog.posts.list({ limit: 20, locale: "tr" }),
  ]);

  return (
    <>
      <Nav name={`${settings.firstName} ${settings.lastName}`.trim()} />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-20">
          <RevealOnScroll>
            <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Blog
            </h1>
          </RevealOnScroll>

          {posts.length === 0 ? (
            <p className="mt-8 text-muted">Henüz yayınlanmış yazı yok.</p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {posts.map((post, index) => (
                <RevealOnScroll key={post.id} delay={Math.min(index * 0.05, 0.2)}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-border-hover"
                  >
                    {post.coverImage && (
                      <div className="relative h-44 w-full overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImage.url}
                          alt={post.coverImage.alt || post.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {post.publishedAt && (
                        <time className="text-xs text-muted">
                          {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
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
                      {post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
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

      <Footer
        firstName={settings.firstName}
        lastName={settings.lastName}
        footerNote={settings.footerNote}
      />
    </>
  );
}

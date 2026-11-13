import Link from "next/link";
import type { Metadata } from "next";
import { getAllPostsSafe } from "@/lib/posts";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { PostCard } from "@/components/site/PostCard";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: true },
};

/** Gerçek 404 yanıtı + ziyaretçiyi kaybetmemek için son yazılara yönlendirme. */
export default async function NotFound() {
  const posts = (await getAllPostsSafe()).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:pt-24">
          <p className="tabular font-serif text-[clamp(5rem,14vw,10rem)] font-medium leading-none tracking-[-0.04em] text-border-hover">
            404
          </p>
          <h1 className="mt-6 max-w-[20ch] font-serif text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-ink md:text-5xl">
            Aradığınız sayfa bulunamadı
          </h1>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ink-2">
            Bağlantı değişmiş ya da sayfa kaldırılmış olabilir. Son yazılar aşağıda; tüm liste{" "}
            <Link href="/blog" className="text-link">
              blog sayfasında
            </Link>
            .
          </p>
          <div className="mt-8">
            <Link href="/" className="btn btn-secondary">
              Ana sayfaya dön
            </Link>
          </div>
        </section>

        {posts.length > 0 && (
          <section aria-label="Son yazılar" className="mx-auto max-w-6xl px-6 pb-20">
            <div className="grid gap-x-8 gap-y-12 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} headingLevel="h2" />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

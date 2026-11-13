import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
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
        <section className="relative isolate overflow-hidden">
          <div aria-hidden className="hero-aurora -z-10" />
          <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
            <p className="font-mono text-sm font-semibold text-accent-ink">404</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-tight text-ink md:text-6xl">
              Aradığınız sayfa bulunamadı
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-2">
              Bağlantı değişmiş ya da sayfa kaldırılmış olabilir. Ana sayfaya dönebilir veya son
              yazılara göz atabilirsiniz.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn btn-secondary">
                Ana sayfa
              </Link>
              <Link href="/blog" className="btn btn-primary">
                Blog yazıları
                <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {posts.length > 0 && (
          <section aria-label="Son yazılar" className="mx-auto max-w-6xl px-6 pb-20">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import type { PostSummary } from "@lobsterlead/blog-sdk";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "./PostCard";

interface LatestPostsProps {
  posts: PostSummary[];
  totalCount: number;
}

/** Ana sayfada hero'nun hemen altında: 1 öne çıkan + 4 kompakt yazı. */
export function LatestPosts({ posts, totalCount }: LatestPostsProps) {
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section
      id="blog"
      aria-labelledby="latest-posts-heading"
      className="mx-auto max-w-6xl px-6 py-14 md:py-20"
    >
      <SectionHeading
        id="latest-posts-heading"
        eyebrow="Blog"
        title="Son yazılar"
        description="Sahada öğrendiklerim, adım adım rehberler ve güncel teknik notlar."
        action={
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-ink"
          >
            Tüm yazılar
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs">{totalCount}</span>
            <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-5">
        <div className="reveal lg:col-span-3">
          <PostCard post={featured} variant="featured" />
        </div>
        {rest.length > 0 && (
          <div className="flex flex-col gap-4 lg:col-span-2">
            {rest.map((post) => (
              <div key={post.id} className="reveal lg:flex-1">
                <PostCard post={post} variant="compact" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/blog" className="btn btn-primary">
          Tüm yazıları keşfet
          <ArrowRight size={18} aria-hidden />
        </Link>
        <a href="/rss.xml" className="btn btn-secondary">
          <Rss size={16} aria-hidden />
          RSS ile takip et
        </a>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { PostSummary } from "@lobsterlead/blog-sdk";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "./PostCard";

interface LatestPostsProps {
  posts: PostSummary[];
  totalCount: number;
}

/** Ana sayfada hero'nun hemen altında: 1 öne çıkan + 6 kart. */
export function LatestPosts({ posts, totalCount }: LatestPostsProps) {
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section id="blog" aria-labelledby="latest-posts-heading" className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <SectionHeading
        id="latest-posts-heading"
        title="Son yazılar"
        description="Backend, frontend, yapay zekâ ve test otomasyonu üzerine."
        action={
          <Link href="/blog" className="text-[0.9375rem] font-semibold text-accent-ink hover:underline hover:underline-offset-4">
            Tüm yazılar ({totalCount})
          </Link>
        }
      />

      <div className="mt-8">
        <PostCard post={featured} variant="featured" />
      </div>

      {rest.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <p className="mt-10 text-center">
        <Link href="/blog" className="btn btn-secondary">
          Tüm yazıları gör
        </Link>
      </p>
    </section>
  );
}

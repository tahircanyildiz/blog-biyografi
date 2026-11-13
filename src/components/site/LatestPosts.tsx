import Link from "next/link";
import type { PostSummary } from "@lobsterlead/blog-sdk";
import { Section } from "@/components/ui/SectionHeading";
import { PostCard, PostRow } from "./PostCard";

interface LatestPostsProps {
  posts: PostSummary[];
  totalCount: number;
}

/** Ana sayfada hero'nun hemen altında: en yeni yazı görselli, sonrakiler liste satırı. */
export function LatestPosts({ posts, totalCount }: LatestPostsProps) {
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <Section
      id="blog"
      title="Son yazılar"
      aside={
        <>
          <p>Toplam {totalCount} yazı.</p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/blog" className="text-link">
              Tümünü gör
            </Link>
            <a href="/rss.xml" className="text-link">
              RSS
            </a>
          </p>
        </>
      }
    >
      <PostCard post={featured} variant="featured" wide />

      {rest.length > 0 && (
        <ol className="mt-10">
          {rest.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </ol>
      )}
    </Section>
  );
}

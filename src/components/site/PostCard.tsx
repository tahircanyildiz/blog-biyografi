import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@lobsterlead/blog-sdk";
import { formatDate } from "@/lib/posts";

type Variant = "featured" | "default";

interface PostCardProps {
  post: PostSummary;
  variant?: Variant;
  /** Sayfadaki başlık hiyerarşisine göre: /blog'da h2, bölüm içinde h3. */
  headingLevel?: "h2" | "h3";
  /** Ekranın üst kısmındaki (LCP adayı) kapak görselini öncelikli yükle. */
  priority?: boolean;
  /** featured varyantı geniş ekranda yatay (görsel solda) dizilsin. */
  wide?: boolean;
}

export function PostMeta({ post, className = "" }: { post: PostSummary; className?: string }) {
  const iso = post.publishedAt ?? post.updatedAt;
  const date = formatDate(iso);

  return (
    <p className={`tabular flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted ${className}`}>
      {date && <time dateTime={iso}>{date}</time>}
      {post.readingTimeMinutes > 0 && <span>{post.readingTimeMinutes} dk okuma</span>}
    </p>
  );
}

function Cover({
  post,
  sizes,
  priority = false,
}: {
  post: PostSummary;
  sizes: string;
  priority?: boolean;
}) {
  if (!post.coverImage?.url) return null;

  return (
    <Image
      src={post.coverImage.url}
      alt={post.coverImage.alt || post.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );
}

/**
 * Yazı kartı: kutu yok, görsel + metin. Kartın tamamı tıklanabilir
 * (stretched link), ama bağlantı metni yalnızca başlık.
 */
export function PostCard({
  post,
  variant = "default",
  headingLevel = "h3",
  priority = false,
  wide = false,
}: PostCardProps) {
  const Heading = headingLevel;
  const href = `/blog/${post.slug}`;
  const featured = variant === "featured";

  return (
    <article
      className={`group relative ${
        featured && wide ? "grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center md:gap-10" : "flex flex-col"
      }`}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-surface-2">
        <Cover
          post={post}
          priority={priority}
          sizes={
            featured
              ? "(min-width: 1024px) 640px, 100vw"
              : "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          }
        />
      </div>

      <div className={featured && wide ? "" : featured ? "mt-5" : "mt-4"}>
        <PostMeta post={post} />
        <Heading
          className={`mt-2 text-ink transition-colors group-hover:text-accent-ink ${
            featured
              ? "font-serif text-[1.75rem] font-medium leading-[1.15] tracking-[-0.015em] md:text-[2rem]"
              : "text-lg font-semibold leading-snug"
          }`}
        >
          <Link href={href} className="stretched-link focus-visible:outline-none">
            {post.title}
          </Link>
        </Heading>
        {post.excerpt && (
          <p
            className={`mt-3 leading-relaxed text-muted ${
              featured ? "line-clamp-3 max-w-[60ch]" : "line-clamp-2 text-[0.9375rem]"
            }`}
          >
            {post.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}

/** Ana sayfadaki yazı listesi satırı: tarih solda, başlık sağda, aralarında ince çizgi. */
export function PostRow({ post }: { post: PostSummary }) {
  const iso = post.publishedAt ?? post.updatedAt;
  const date = formatDate(iso);

  return (
    <li className="group relative grid gap-1 border-t border-border py-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-6">
      <time dateTime={iso} className="tabular pt-0.5 text-sm text-muted">
        {date}
      </time>
      <div className="min-w-0">
        <h3 className="font-medium leading-snug text-ink transition-colors group-hover:text-accent-ink">
          <Link href={`/blog/${post.slug}`} className="stretched-link focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        {post.readingTimeMinutes > 0 && (
          <p className="mt-1 text-sm text-muted">{post.readingTimeMinutes} dk okuma</p>
        )}
      </div>
    </li>
  );
}

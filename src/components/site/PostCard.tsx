import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@lobsterlead/blog-sdk";
import { formatDate } from "@/lib/posts";
import { topicOf } from "@/lib/topics";

type Variant = "featured" | "default";

interface PostCardProps {
  post: PostSummary;
  variant?: Variant;
  /** Sayfadaki başlık hiyerarşisine göre: /blog'da h2, bölüm içinde h3. */
  headingLevel?: "h2" | "h3";
  /** Ekranın üst kısmındaki (LCP adayı) kapak görselini öncelikli yükle. */
  priority?: boolean;
}

/** Tarih + okuma süresi. Ayraç, metin değil küçük bir nokta (ekran okuyucu atlar). */
export function PostMeta({ post, className = "" }: { post: PostSummary; className?: string }) {
  const iso = post.publishedAt ?? post.updatedAt;
  const date = formatDate(iso);

  return (
    <p className={`tabular flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted ${className}`}>
      {date && <time dateTime={iso}>{date}</time>}
      {date && post.readingTimeMinutes > 0 && (
        <span aria-hidden className="size-[3px] rounded-full bg-current opacity-70" />
      )}
      {post.readingTimeMinutes > 0 && <span>{post.readingTimeMinutes} dk okuma</span>}
    </p>
  );
}

function Cover({ post, sizes, priority = false }: { post: PostSummary; sizes: string; priority?: boolean }) {
  if (!post.coverImage?.url) return null;

  return (
    <Image
      src={post.coverImage.url}
      alt={post.coverImage.alt || post.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
    />
  );
}

/**
 * Yazı kartı: kapak + konu + başlık + tarih. Kartın tamamı tıklanabilir
 * (stretched link), bağlantı metni yalnızca başlık.
 */
export function PostCard({ post, variant = "default", headingLevel = "h3", priority = false }: PostCardProps) {
  const Heading = headingLevel;
  const href = `/blog/${post.slug}`;
  const topic = topicOf(post);

  if (variant === "featured") {
    return (
      <article className="card card-hover group relative grid overflow-hidden lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
          <Cover post={post} priority={priority} sizes="(min-width: 1024px) 640px, 100vw" />
        </div>
        <div className="flex flex-col justify-center p-6 md:p-9">
          {topic && <p className="text-sm font-semibold text-accent-ink">{topic}</p>}
          <Heading className="mt-3 font-serif text-2xl font-bold leading-[1.18] tracking-[-0.015em] text-ink md:text-[2rem]">
            <Link href={href} className="stretched-link">
              {post.title}
            </Link>
          </Heading>
          {post.excerpt && <p className="mt-4 line-clamp-3 leading-relaxed text-ink-2">{post.excerpt}</p>}
          <PostMeta post={post} className="mt-5" />
        </div>
      </article>
    );
  }

  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-surface-2">
        <Cover post={post} priority={priority} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {topic && <p className="text-[0.8125rem] font-semibold text-accent-ink">{topic}</p>}
        <Heading className="mt-2 line-clamp-3 text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-accent-ink">
          <Link href={href} className="stretched-link">
            {post.title}
          </Link>
        </Heading>
        <PostMeta post={post} className="mt-auto pt-4" />
      </div>
    </article>
  );
}

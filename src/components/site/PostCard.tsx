import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import type { PostSummary } from "@lobsterlead/blog-sdk";
import { formatDate, isRecent } from "@/lib/posts";

type Variant = "featured" | "default" | "compact";

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
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted ${className}`}
    >
      {isRecent(post.publishedAt) && (
        <span className="rounded-full bg-accent px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wider text-on-accent">
          Yeni
        </span>
      )}
      {date && <time dateTime={iso}>{date}</time>}
      {post.readingTimeMinutes > 0 && (
        <span className="inline-flex items-center gap-1">
          <Clock size={13} aria-hidden />
          {post.readingTimeMinutes} dk okuma
        </span>
      )}
    </div>
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
  if (!post.coverImage?.url) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/25 via-surface-2 to-accent-2/15 text-accent-ink">
        <Newspaper size={28} aria-hidden />
      </div>
    );
  }

  return (
    <Image
      src={post.coverImage.url}
      alt={post.coverImage.alt || post.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
    />
  );
}

export function PostCard({
  post,
  variant = "default",
  headingLevel = "h3",
  priority = false,
  wide = false,
}: PostCardProps) {
  const Heading = headingLevel;
  const href = `/blog/${post.slug}`;

  if (variant === "featured") {
    return (
      <article
        className={`group card card-hover relative overflow-hidden focus-within:ring-2 focus-within:ring-accent-ink ${
          wide ? "grid lg:grid-cols-[1.35fr_1fr]" : "flex h-full flex-col"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-surface-2 ${
            wide ? "aspect-[16/9] lg:aspect-auto lg:min-h-[24rem]" : "aspect-[16/9]"
          }`}
        >
          <Cover
            post={post}
            priority={priority}
            sizes={wide ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 680px, 100vw"}
          />
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <PostMeta post={post} />
          <Heading className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-tight text-balance text-ink md:text-3xl">
            <Link href={href} className="stretched-link focus-visible:outline-none">
              {post.title}
            </Link>
          </Heading>
          {post.excerpt && (
            <p className="mt-3 line-clamp-3 leading-relaxed text-muted">{post.excerpt}</p>
          )}
          <span
            aria-hidden
            className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-accent-ink"
          >
            Yazıyı oku
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group card card-hover relative flex h-full items-center gap-4 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-accent-ink">
        <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:w-32">
          <Cover post={post} sizes="128px" />
        </div>
        <div className="min-w-0 flex-1 pr-2">
          <PostMeta post={post} />
          <Heading className="mt-1.5 line-clamp-2 text-[0.95rem] font-semibold leading-snug text-ink transition-colors group-hover:text-accent-ink">
            <Link href={href} className="stretched-link focus-visible:outline-none">
              {post.title}
            </Link>
          </Heading>
        </div>
      </article>
    );
  }

  return (
    <article className="group card card-hover relative flex h-full flex-col overflow-hidden rounded-2xl focus-within:ring-2 focus-within:ring-accent-ink">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
        <Cover
          post={post}
          priority={priority}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <PostMeta post={post} />
        <Heading className="mt-2.5 line-clamp-3 text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-accent-ink">
          <Link href={href} className="stretched-link focus-visible:outline-none">
            {post.title}
          </Link>
        </Heading>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        )}
      </div>
    </article>
  );
}

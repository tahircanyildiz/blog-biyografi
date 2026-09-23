import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogApiError } from "@lobsterlead/blog-sdk";
import { toNextMetadata, jsonLdScript } from "@lobsterlead/blog-sdk/next";
import { blog } from "@/lib/blog";
import { getSiteSettings } from "@/lib/content";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const detail = await blog.posts.get(slug, { locale: "tr" });
    return toNextMetadata(detail.meta);
  } catch (error) {
    if (error instanceof BlogApiError && error.status === 404) return {};
    throw error;
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const settings = await getSiteSettings();

  let detail;
  try {
    detail = await blog.posts.get(slug, { locale: "tr" });
  } catch (error) {
    if (error instanceof BlogApiError && error.status === 404) notFound();
    throw error;
  }

  const { post } = detail;

  return (
    <>
      <Nav name={`${settings.firstName} ${settings.lastName}`.trim()} />

      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(detail) }}
        />

        <article className="post-body mx-auto max-w-3xl px-6 py-20">
          {post.coverImage && (
            <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl sm:h-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-muted">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
              </time>
            )}
            {post.author?.name && <span>· {post.author.name}</span>}
            {post.readingTimeMinutes > 0 && (
              <span>· {post.readingTimeMinutes} dk okuma</span>
            )}
          </div>

          <div className="blog-body mt-10">
            <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          </div>
        </article>
      </main>

      <Footer
        firstName={settings.firstName}
        lastName={settings.lastName}
        footerNote={settings.footerNote}
      />
    </>
  );
}

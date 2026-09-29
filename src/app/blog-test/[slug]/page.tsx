import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LobsterLeadTestApiError, getTestPostBySlug } from "@/lib/blogTest";
import { getSiteSettings, getSocialLinks } from "@/lib/content";
import { SITE_URL } from "@/lib/blog";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const dynamic = "force-dynamic";

interface BlogTestPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogTestPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data: post } = await getTestPostBySlug(slug, "tr");
    const canonical = `${SITE_URL}/blog-test/${post.slug}`;

    return {
      title: post.seo.title || post.title,
      description: post.seo.description || post.excerpt,
      alternates: { canonical },
      robots: { index: false, follow: false },
      openGraph: {
        title: post.seo.title || post.title,
        description: post.seo.description || post.excerpt,
        url: canonical,
        type: "article",
        images: post.seo.og_image ? [{ url: post.seo.og_image }] : undefined,
      },
    };
  } catch (error) {
    if (error instanceof LobsterLeadTestApiError && error.status === 404) {
      return {};
    }
    throw error;
  }
}

export default async function BlogTestPostPage({
  params,
}: BlogTestPostPageProps) {
  const { slug } = await params;

  const [settings, socialLinks] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
  ]);

  let post;
  try {
    ({ data: post } = await getTestPostBySlug(slug, "tr"));
  } catch (error) {
    if (
      error instanceof LobsterLeadTestApiError &&
      (error.status === 404 || error.status === 410)
    ) {
      notFound();
    }
    throw error;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image?.url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url: `${SITE_URL}/blog-test/${post.slug}`,
  };

  return (
    <>
      <Nav />

      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article className="post-body mx-auto max-w-3xl px-6 py-20">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Deneysel — LobsterLead preprod API
          </p>

          {post.featured_image && (
            <div className="relative mb-8 mt-4 h-64 w-full overflow-hidden rounded-xl sm:h-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featured_image.url}
                alt={post.featured_image.alt || post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-muted">
            {post.published_at && (
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString("tr-TR")}
              </time>
            )}
          </div>

          <div
            className="blog-body mt-10"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
        </article>
      </main>

      <Footer
        firstName={settings.firstName}
        lastName={settings.lastName}
        footerNote={settings.footerNote}
        socialLinks={socialLinks}
      />
    </>
  );
}

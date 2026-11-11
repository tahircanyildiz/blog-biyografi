import type { Metadata } from "next";
import type {
  Education,
  Experience,
  SiteSettings,
  SkillGroup,
  SocialLink,
} from "@prisma/client";
import type { PostDetail, PostSummary } from "@lobsterlead/blog-sdk";
import { cleanTags } from "@/lib/posts";
import {
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_URL,
  absoluteUrl,
  fullName,
  isOngoing,
  tidy,
  truncate,
} from "@/lib/site";
import { splitTags } from "@/lib/content";

type OpenGraph = NonNullable<Metadata["openGraph"]>;
type JsonLdNode = Record<string, unknown>;

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BLOG_ID = `${SITE_URL}/blog#blog`;

/* ------------------------------------------------------------------ */
/* Metin varsayılanları — admin'deki SEO alanları boşsa bunlar devreye girer */
/* ------------------------------------------------------------------ */

export function siteName(settings: SiteSettings): string {
  return fullName(settings) || "Kişisel Site";
}

export function homeTitle(settings: SiteSettings): string {
  return (
    settings.seoTitle.trim() ||
    [fullName(settings), tidy(settings.roleTitle)].filter(Boolean).join(" | ") ||
    siteName(settings)
  );
}

export function homeDescription(settings: SiteSettings): string {
  return (
    settings.seoDescription.trim() ||
    truncate(settings.tagline || settings.bio, 158) ||
    `${siteName(settings)} kişisel sitesi ve blogu.`
  );
}

export function blogTitle(settings: SiteSettings): string {
  return settings.blogTitle.trim() || "Blog";
}

export function blogDescription(settings: SiteSettings): string {
  if (settings.blogDescription.trim()) return settings.blogDescription.trim();
  const role = tidy(settings.roleTitle);
  return `${siteName(settings)}${role ? ` (${role})` : ""} blogu: güncel yazılar, rehberler ve sahadan teknik notlar.`;
}

/**
 * Sayfa `alternates` tanımlayınca root'taki objenin tamamı eziliyor; RSS
 * keşif linki (`<link rel="alternate" type="application/rss+xml">`) her
 * sayfada kalsın diye canonical ile birlikte buradan üretilir.
 */
export function alternates(settings: SiteSettings, canonical: string): Metadata["alternates"] {
  return {
    canonical,
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: `${siteName(settings)} — Blog RSS` }],
    },
  };
}

/** Alt sayfalardaki openGraph objesi root'takini tamamen ezdiği için ortak alanları her seferinde ekler. */
export function openGraph(settings: SiteSettings, og: OpenGraph): OpenGraph {
  return {
    siteName: siteName(settings),
    locale: SITE_LOCALE,
    ...og,
  } as OpenGraph;
}

/* ------------------------------------------------------------------ */
/* JSON-LD                                                              */
/* ------------------------------------------------------------------ */

/** `</script>` kaçışı: içerikteki `<` karakterleri script'i erken kapatmasın. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function compact<T extends JsonLdNode>(node: T): T {
  return Object.fromEntries(
    Object.entries(node).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
  ) as T;
}

function isHttpUrl(url: string): boolean {
  try {
    const { protocol, pathname } = new URL(url);
    // Seed'deki "https://github.com/" gibi kök URL'ler profil değildir.
    return (protocol === "https:" || protocol === "http:") && pathname.length > 1;
  } catch {
    return false;
  }
}

/** Yazı/blog düğümlerinde yazar ve yayıncı olarak kullanılan kısa Person. */
export function personRef(settings: SiteSettings): JsonLdNode {
  return compact({
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteName(settings),
    url: `${SITE_URL}/`,
    image: settings.profileImage ? absoluteUrl(settings.profileImage) : undefined,
  });
}

export function personNode(input: {
  settings: SiteSettings;
  socialLinks: SocialLink[];
  experience?: Experience[];
  education?: Education[];
  skills?: SkillGroup[];
}): JsonLdNode {
  const { settings, socialLinks, experience = [], education = [], skills = [] } = input;
  const current = experience.find((item) => isOngoing(item.endDate));
  const [locality, country] = tidy(settings.location)
    .split(",")
    .map((part) => part.trim());

  const schools = Array.from(
    new Set(education.map((item) => tidy(item.institution)).filter(Boolean))
  );
  const knowsAbout = Array.from(
    new Set(skills.flatMap((group) => splitTags(group.items)))
  ).slice(0, 30);

  return compact({
    ...personRef(settings),
    givenName: settings.firstName.trim() || undefined,
    familyName: settings.lastName.trim() || undefined,
    jobTitle: tidy(current?.role) || tidy(settings.roleTitle) || undefined,
    description: truncate(settings.bio, 300) || undefined,
    sameAs: socialLinks.map((link) => link.url).filter(isHttpUrl),
    worksFor: current?.company
      ? { "@type": "Organization", name: tidy(current.company) }
      : undefined,
    alumniOf: schools.map((name) => ({ "@type": "EducationalOrganization", name })),
    address: locality
      ? compact({
          "@type": "PostalAddress",
          addressLocality: locality,
          addressCountry: country,
        })
      : undefined,
    knowsAbout,
  });
}

export function websiteNode(settings: SiteSettings): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: siteName(settings),
    description: homeDescription(settings),
    inLanguage: SITE_LANGUAGE,
    publisher: { "@id": PERSON_ID },
  };
}

export function profilePageNode(settings: SiteSettings): JsonLdNode {
  return {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile`,
    url: `${SITE_URL}/`,
    name: homeTitle(settings),
    inLanguage: SITE_LANGUAGE,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    dateModified: settings.updatedAt.toISOString(),
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogNode(settings: SiteSettings, posts: PostSummary[]): JsonLdNode {
  return {
    "@type": "Blog",
    "@id": BLOG_ID,
    url: absoluteUrl("/blog"),
    name: blogTitle(settings) === "Blog" ? `${siteName(settings)} Blog` : blogTitle(settings),
    description: blogDescription(settings),
    inLanguage: SITE_LANGUAGE,
    author: personRef(settings),
    publisher: personRef(settings),
    blogPost: posts.map((post) =>
      compact({
        "@type": "BlogPosting",
        headline: post.title,
        url: absoluteUrl(`/blog/${post.slug}`),
        datePublished: post.publishedAt ?? undefined,
        dateModified: post.updatedAt,
        image: post.coverImage?.url,
        author: { "@id": PERSON_ID },
      })
    ),
  };
}

/**
 * Blog servisinin ürettiği BlogPosting JSON-LD'sini temel alır; yayıncıyı
 * "Organization" yerine sitenin sahibi olan Person yapar ve eksik `author`
 * alanını ekler (E-E-A-T: içeriğin arkasındaki gerçek kişi).
 */
export function postNode(detail: PostDetail, settings: SiteSettings): JsonLdNode {
  const { post, meta } = detail;
  const url = meta.canonical || absoluteUrl(`/blog/${post.slug}`);
  const base = { ...(detail.jsonLd ?? {}) } as JsonLdNode;
  delete base["@context"];

  const keywords =
    (typeof base.keywords === "string" && base.keywords.trim()) ||
    post.keywords?.trim() ||
    cleanTags(post.tags).join(", ");

  return compact({
    ...base,
    "@type": base["@type"] ?? "BlogPosting",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: keywords || undefined,
    author: personRef(settings),
    publisher: personRef(settings),
    isPartOf: { "@type": "Blog", "@id": BLOG_ID, url: absoluteUrl("/blog") },
  });
}

export function graph(...nodes: JsonLdNode[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

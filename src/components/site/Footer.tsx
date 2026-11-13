import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getSiteSettings, getSocialLinks } from "@/lib/content";
import { formatDate, getAllPostsSafe } from "@/lib/posts";
import { getSocialMeta } from "@/lib/social";
import { fullName, tidy, truncate } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "Ana sayfa" },
  { href: "/blog", label: "Blog" },
  { href: "/#about", label: "Hakkımda" },
  { href: "/#experience", label: "Deneyim" },
  { href: "/#skills", label: "Yetenekler" },
  { href: "/#contact", label: "İletişim" },
];

/**
 * Her sayfada son yazılara bağlantı verir — site içi linklemeyi güçlendirir
 * ve yeni yazıların hızlı keşfedilmesini sağlar.
 */
export async function Footer() {
  const [settings, socialLinks, posts] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
    getAllPostsSafe(),
  ]);

  const name = fullName(settings);
  const blurb = truncate(settings.tagline || settings.bio, 150);
  const latest = posts.slice(0, 4);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-[1.3fr_0.8fr_1.4fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="logo-tile size-10 p-1">
              <Image src="/logo-96.png" alt="" width={32} height={30} className="size-8 object-contain" />
            </span>
            <span className="font-serif text-xl font-medium text-ink">{name}</span>
          </Link>
          {settings.roleTitle && (
            <p className="mt-3 text-sm text-ink-2">{tidy(settings.roleTitle)}</p>
          )}
          {blurb && <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{blurb}</p>}

          {socialLinks.length > 0 && (
            <ul className="-ml-2.5 mt-4 flex items-center">
              {socialLinks.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={getSocialMeta(social.platform).label}
                    className="inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:text-accent-ink"
                  >
                    <SocialIcon platform={social.platform} size={16} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Alt menü">
          <h2 className="text-sm font-medium text-ink">Gezinti</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-2 transition-colors hover:text-accent-ink">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="/rss.xml" className="text-ink-2 transition-colors hover:text-accent-ink">
                RSS
              </a>
            </li>
          </ul>
        </nav>

        {latest.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-ink">Son yazılar</h2>
            <ul className="mt-4 space-y-4">
              {latest.map((post) => (
                <li key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <span className="line-clamp-2 text-sm leading-snug text-ink-2 transition-colors group-hover:text-accent-ink">
                      {post.title}
                    </span>
                    <time dateTime={post.publishedAt ?? undefined} className="tabular mt-1 block text-xs text-muted">
                      {formatDate(post.publishedAt)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {name}. Tüm hakları saklıdır.
          </span>
          {settings.footerNote && <span>{settings.footerNote}</span>}
        </div>
      </div>
    </footer>
  );
}

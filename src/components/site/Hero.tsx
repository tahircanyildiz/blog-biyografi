import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Layers, MapPin, Newspaper } from "lucide-react";
import type { SiteSettings, SocialLink } from "@prisma/client";
import type { PostSummary } from "@lobsterlead/blog-sdk";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getSocialMeta } from "@/lib/social";
import { tidy } from "@/lib/site";

interface HeroProps {
  settings: SiteSettings;
  socialLinks: SocialLink[];
  latestPost: PostSummary | null;
  postCount: number;
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Sunucu bileşeni: isim (h1) ve fotoğraf (LCP) ilk HTML'de animasyonsuz
 * görünür; sadece ikincil öğeler CSS ile kısa bir girişle gelir.
 */
export function Hero({ settings, socialLinks, latestPost, postCount }: HeroProps) {
  const lead = tidy(settings.tagline) || tidy(settings.bio);
  const location = tidy(settings.location);
  const initials = `${settings.firstName.trim()[0] ?? ""}${settings.lastName.trim()[0] ?? ""}`;

  const stats = [
    { icon: Briefcase, value: tidy(settings.statYearsValue), label: tidy(settings.statYearsLabel) },
    { icon: Layers, value: tidy(settings.statProjValue), label: tidy(settings.statProjLabel) },
    { icon: Newspaper, value: postCount > 0 ? String(postCount) : "", label: "Blog yazısı" },
  ].filter((stat) => stat.value && stat.label);

  return (
    <section id="hero" className="relative isolate overflow-hidden">
      <div aria-hidden className="hero-aurora -z-10" />
      <div aria-hidden className="hero-grid -z-10" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 pb-14 pt-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-12 md:pb-20 md:pt-16">
        <div className="min-w-0">
          {latestPost && (
            <Link
              href={`/blog/${latestPost.slug}`}
              className="fade-up group inline-flex max-w-full items-center gap-2.5 rounded-full border border-border bg-surface/70 py-1 pl-1 pr-3 text-sm shadow-sm backdrop-blur transition-colors hover:border-accent-ink/50"
              style={delay(0)}
            >
              <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-on-accent">
                Yeni yazı
              </span>
              <span className="truncate text-ink-2 group-hover:text-ink">{latestPost.title}</span>
              <ArrowRight
                size={14}
                aria-hidden
                className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          )}

          {settings.roleTitle && (
            <p className="eyebrow fade-up mt-8" style={delay(60)}>
              {tidy(settings.roleTitle)}
            </p>
          )}

          <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {settings.firstName}{" "}
            {settings.lastName && <span className="text-gradient">{settings.lastName}</span>}
          </h1>

          {lead && (
            <p
              className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-ink-2 md:text-xl"
              style={delay(120)}
            >
              {lead}
            </p>
          )}

          <div className="fade-up mt-9 flex flex-wrap gap-3" style={delay(180)}>
            <Link href="/blog" className="btn btn-primary">
              Blog yazılarını oku
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link href="/#contact" className="btn btn-secondary">
              İletişime geç
            </Link>
          </div>

          {(location || socialLinks.length > 0) && (
            <div
              className="fade-up mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted"
              style={delay(240)}
            >
              {location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={16} aria-hidden className="text-accent-ink" />
                  {location}
                </span>
              )}
              {location && socialLinks.length > 0 && (
                <span aria-hidden className="hidden h-4 w-px bg-border-hover sm:block" />
              )}
              {socialLinks.length > 0 && (
                <ul className="flex items-center gap-2">
                  {socialLinks.map((social) => (
                    <li key={social.id}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer me"
                        aria-label={getSocialMeta(social.platform).label}
                        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface/60 text-ink-2 transition-colors hover:border-accent-ink/60 hover:text-accent-ink"
                      >
                        <SocialIcon platform={social.platform} size={17} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-[22rem] pb-10 md:max-w-sm">
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-accent/45 via-accent/5 to-accent-2/30 blur-3xl"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-surface shadow-2xl shadow-black/30">
            {settings.profileImage ? (
              <Image
                src={settings.profileImage}
                alt={`${settings.firstName} ${settings.lastName}`.trim()}
                fill
                sizes="(min-width: 768px) 384px, 88vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/30 to-accent-2/20 font-serif text-7xl text-ink">
                {initials}
              </div>
            )}
          </div>

          {stats.length > 0 && (
            <dl
              className="fade-up absolute inset-x-4 -bottom-2 grid divide-x divide-border rounded-2xl border border-border bg-surface/85 py-3 shadow-xl backdrop-blur-xl"
              style={{ ...delay(200), gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5 px-2 text-center">
                  <stat.icon size={16} aria-hidden className="order-1 mb-1 text-accent-ink" />
                  <dt className="order-3 text-[0.7rem] font-medium uppercase tracking-wider text-muted">
                    {stat.label}
                  </dt>
                  <dd className="order-2 font-serif text-2xl font-semibold leading-none text-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}

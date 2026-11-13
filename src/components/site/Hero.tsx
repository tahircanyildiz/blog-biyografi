import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Experience, SiteSettings, SocialLink } from "@prisma/client";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getSocialMeta } from "@/lib/social";
import { isOngoing, tidy } from "@/lib/site";

interface HeroProps {
  settings: SiteSettings;
  socialLinks: SocialLink[];
  experience: Experience[];
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * Sunucu bileşeni: isim (h1) ve fotoğraf (LCP) ilk HTML'de animasyonsuz
 * görünür; yalnızca ikincil öğeler kısa bir girişle gelir. Gradyan isim,
 * parlayan arka plan ve istatistik şeridi bilinçli olarak yok.
 */
export function Hero({ settings, socialLinks, experience }: HeroProps) {
  const name = `${settings.firstName} ${settings.lastName}`.trim();
  const lead = tidy(settings.tagline) || tidy(settings.bio);
  const location = tidy(settings.location);
  const initials = `${settings.firstName.trim()[0] ?? ""}${settings.lastName.trim()[0] ?? ""}`;
  const current = experience.find((item) => isOngoing(item.endDate));

  return (
    <section id="hero" className="mx-auto max-w-6xl px-6 pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:gap-16">
        <div className="min-w-0">
          <p className="fade-up text-[1.0625rem] font-medium text-accent-ink" style={delay(0)}>
            Merhaba, ben
          </p>

          <h1 className="mt-3 font-serif text-5xl font-bold leading-[1.02] tracking-[-0.025em] text-ink [overflow-wrap:break-word] sm:text-6xl lg:text-[4.75rem]">
            {name}
          </h1>

          {lead && (
            <p
              className="fade-up mt-6 max-w-[37rem] text-lg leading-relaxed text-ink-2 md:text-[1.3125rem] md:leading-[1.6]"
              style={delay(80)}
            >
              {lead}
            </p>
          )}

          <div className="fade-up mt-9 flex flex-wrap items-center gap-3" style={delay(160)}>
            <Link href="/blog" className="btn btn-primary">
              Blogu oku
            </Link>
            <Link href="/#about" className="btn btn-secondary">
              Hakkımda
            </Link>
            {socialLinks.length > 0 && (
              <ul className="ml-1 flex items-center gap-1">
                {socialLinks.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={getSocialMeta(social.platform).label}
                      className="inline-flex size-11 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      <SocialIcon platform={social.platform} size={19} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[22rem] md:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.125rem] border border-border bg-surface">
            {settings.profileImage ? (
              <Image
                src={settings.profileImage}
                alt={name}
                fill
                sizes="(min-width: 768px) 384px, 88vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-serif text-7xl text-muted">
                {initials}
              </div>
            )}
          </div>

          {(current || location) && (
            <div
              className="fade-up relative mx-4 -mt-14 max-w-[17rem] rounded-xl border border-border bg-surface px-4 py-3.5 md:absolute md:-left-9 md:bottom-7 md:m-0"
              style={delay(200)}
            >
              {current && (
                <>
                  <p className="text-[0.8125rem] text-muted">Şu an</p>
                  <p className="mt-0.5 font-semibold leading-snug text-ink">
                    {tidy(current.role)}, {tidy(current.company)}
                  </p>
                </>
              )}
              {location && <p className={`text-sm text-ink-2 ${current ? "mt-0.5" : ""}`}>{location}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

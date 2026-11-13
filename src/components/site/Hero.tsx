import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteSettings, SocialLink } from "@prisma/client";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getSocialMeta } from "@/lib/social";
import { tidy } from "@/lib/site";

interface HeroProps {
  settings: SiteSettings;
  socialLinks: SocialLink[];
}

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Sunucu bileşeni. İsim (h1) ve fotoğraf (LCP) ilk HTML'de animasyonsuz
 * görünür; yalnızca giriş cümlesi ve bağlantılar kısa bir yerleşme hareketiyle
 * gelir. Arka plan efekti, gradyan isim ve istatistik şeridi bilinçli olarak yok:
 * sayfanın ağırlığı tipografide ve yazılarda.
 */
export function Hero({ settings, socialLinks }: HeroProps) {
  const name = `${settings.firstName} ${settings.lastName}`.trim();
  const lead = tidy(settings.tagline) || tidy(settings.bio);
  const role = tidy(settings.roleTitle);
  const location = tidy(settings.location);
  const initials = `${settings.firstName.trim()[0] ?? ""}${settings.lastName.trim()[0] ?? ""}`;

  return (
    <section id="hero" className="mx-auto max-w-6xl px-6 pb-12 pt-10 md:pb-16 md:pt-20">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_15rem] md:items-end md:gap-14 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <h1 className="font-serif text-[3.25rem] font-medium leading-[0.98] tracking-[-0.03em] text-ink [overflow-wrap:break-word] sm:text-7xl lg:text-[5.5rem]">
            {name}
          </h1>

          {lead && (
            <p
              className="settle mt-7 max-w-[34rem] text-xl leading-relaxed text-ink-2 md:text-[1.375rem] md:leading-[1.55]"
              style={step(1)}
            >
              {lead}
            </p>
          )}

          <div className="settle mt-8 flex flex-wrap items-center gap-x-7 gap-y-4" style={step(2)}>
            <Link href="/blog" className="btn btn-primary">
              Yazıları oku
            </Link>
            <Link href="/#contact" className="text-link">
              Bana yazın
            </Link>
          </div>
        </div>

        <figure className="flex items-end gap-5 md:block">
          <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-lg bg-surface-2 sm:w-36 md:w-full">
            {settings.profileImage ? (
              <Image
                src={settings.profileImage}
                alt={name}
                fill
                sizes="(min-width: 1024px) 288px, (min-width: 768px) 240px, 144px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-serif text-5xl text-muted">
                {initials}
              </div>
            )}
          </div>

          <figcaption className="min-w-0 md:mt-4">
            {role && <p className="font-medium text-ink">{role}</p>}
            {location && <p className="mt-0.5 text-sm text-muted">{location}</p>}
            {socialLinks.length > 0 && (
              <ul className="-ml-2 mt-3 flex flex-wrap items-center">
                {socialLinks.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={getSocialMeta(social.platform).label}
                      className="inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:text-accent-ink"
                    >
                      <SocialIcon platform={social.platform} size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

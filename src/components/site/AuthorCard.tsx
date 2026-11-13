import Image from "next/image";
import Link from "next/link";
import type { SiteSettings, SocialLink } from "@prisma/client";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getSocialMeta } from "@/lib/social";
import { fullName, tidy, truncate } from "@/lib/site";

interface AuthorCardProps {
  settings: SiteSettings;
  socialLinks: SocialLink[];
}

/**
 * Yazı sonundaki yazar kutusu — içeriğin arkasındaki gerçek kişiyi,
 * uzmanlığını ve profillerini gösterir (E-E-A-T sinyali). JSON-LD'deki
 * `author` ile aynı kişiye işaret eder.
 */
export function AuthorCard({ settings, socialLinks }: AuthorCardProps) {
  const name = fullName(settings);
  const bio = truncate(settings.bio, 260);

  return (
    <aside aria-label="Yazar hakkında" className="rounded-lg bg-surface p-6 md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row">
        {settings.profileImage && (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-md">
            <Image src={settings.profileImage} alt={name} fill sizes="80px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm text-muted">Yazar</p>
          <p className="mt-0.5 font-serif text-2xl font-medium text-ink">
            <Link href="/#about" rel="author" className="hover:text-accent-ink">
              {name}
            </Link>
          </p>
          {settings.roleTitle && (
            <p className="mt-0.5 text-sm text-ink-2">{tidy(settings.roleTitle)}</p>
          )}
          {bio && <p className="mt-3 leading-relaxed text-ink-2">{bio}</p>}

          <div className="-ml-2.5 mt-4 flex flex-wrap items-center">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={getSocialMeta(social.platform).label}
                className="inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:text-accent-ink"
              >
                <SocialIcon platform={social.platform} size={17} />
              </a>
            ))}
            <Link href="/#contact" className="text-link ml-auto text-sm">
              Bana yazın
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <aside aria-label="Yazar hakkında" className="card relative overflow-hidden p-6 md:p-8">
      <div className="relative flex flex-col gap-5 sm:flex-row">
        {settings.profileImage && (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-border">
            <Image src={settings.profileImage} alt={name} fill sizes="80px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm text-muted">Yazar</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-ink">
            <Link href="/#about" rel="author" className="hover:text-accent-ink">
              {name}
            </Link>
          </p>
          {settings.roleTitle && (
            <p className="mt-0.5 text-sm font-medium text-accent-ink">{tidy(settings.roleTitle)}</p>
          )}
          {bio && <p className="mt-3 leading-relaxed text-ink-2">{bio}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={getSocialMeta(social.platform).label}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-accent-ink/60 hover:text-accent-ink"
              >
                <SocialIcon platform={social.platform} size={15} />
              </a>
            ))}
            <Link href="/#contact" className="btn btn-secondary btn-sm ml-auto">
              İletişime geç
              <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

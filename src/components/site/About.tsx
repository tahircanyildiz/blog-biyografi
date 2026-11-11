import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  MapPin,
  Newspaper,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Education, Experience, SiteSettings, SkillGroup } from "@prisma/client";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isOngoing, tidy } from "@/lib/site";

interface AboutProps {
  settings: SiteSettings;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  postCount: number;
}

interface Fact {
  icon: LucideIcon;
  label: string;
  title: string;
  detail?: string;
  href?: string;
}

/**
 * Bento düzeninde kısa künye. Bio, hero'da zaten gösteriliyorsa (tagline
 * boşken hero bio'yu gösterir) burada tekrar edilmez — aynı paragrafın
 * sayfada iki kez geçmesi hem okuru hem arama motorunu yoruyordu.
 */
export function About({ settings, experience, education, skills, postCount }: AboutProps) {
  const bio = tidy(settings.bio);
  const showBio = Boolean(tidy(settings.tagline)) && Boolean(bio);

  const current = experience.find((item) => isOngoing(item.endDate)) ?? experience[0];
  const school = education[0];
  const location = tidy(settings.location);
  const focusAreas = Array.from(new Set(skills.map((group) => tidy(group.category)))).slice(0, 3);

  const facts = [
    current && {
      icon: Briefcase,
      label: isOngoing(current.endDate) ? "Şu an" : "Son pozisyon",
      title: tidy(current.role),
      detail: tidy(current.company),
    },
    school && {
      icon: GraduationCap,
      label: "Eğitim",
      title: tidy(school.institution) || tidy(school.title),
      detail: tidy(school.type) || tidy(school.title),
    },
    location && { icon: MapPin, label: "Konum", title: location },
    focusAreas.length > 0 && {
      icon: Sparkles,
      label: "Odak alanları",
      title: focusAreas.join(" · "),
    },
    postCount > 0 && {
      icon: Newspaper,
      label: "Blog",
      title: `${postCount} yazı yayında`,
      detail: "Tüm yazıları oku",
      href: "/blog",
    },
  ].filter(Boolean) as Fact[];

  if (!showBio && facts.length === 0) return null;

  return (
    <section id="about" aria-labelledby="about-heading" className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <SectionHeading id="about-heading" eyebrow="Tanışalım" title="Hakkımda" />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {showBio && (
          <div className="reveal card relative overflow-hidden p-8 sm:col-span-2 lg:row-span-2 md:p-10">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 size-64 rounded-full bg-accent/15 blur-3xl"
            />
            <p className="relative font-serif text-2xl leading-snug text-ink md:text-[1.7rem]">
              “{tidy(settings.tagline)}”
            </p>
            <p className="relative mt-6 text-lg leading-relaxed text-ink-2">{bio}</p>
          </div>
        )}

        {facts.map((fact, index) => {
          const wideLast = !showBio && facts.length % 3 === 2 && index === facts.length - 1;
          const content = (
            <>
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/12 text-accent-ink ring-1 ring-accent/20">
                <fact.icon size={20} aria-hidden />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {fact.label}
              </p>
              <p className="mt-1.5 text-lg font-semibold leading-snug text-ink">{fact.title}</p>
              {fact.detail && (
                <p
                  className={`mt-1 text-sm ${
                    fact.href ? "inline-flex items-center gap-1 font-semibold text-accent-ink" : "text-muted"
                  }`}
                >
                  {fact.detail}
                  {fact.href && (
                    <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
                  )}
                </p>
              )}
            </>
          );

          const className = `reveal card p-6 ${wideLast ? "lg:col-span-2" : ""}`;

          return fact.href ? (
            <Link key={fact.label} href={fact.href} className={`group card-hover block ${className}`}>
              {content}
            </Link>
          ) : (
            <div key={fact.label} className={className}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

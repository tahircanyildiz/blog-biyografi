import Link from "next/link";
import { Briefcase, GraduationCap, MapPin, Newspaper, Target, type LucideIcon } from "lucide-react";
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
  value: string;
  detail?: string;
  href?: string;
}

/**
 * Biyografi (solda) + kısa künye (sağda). Tagline hero'da gösterildiği için
 * burada tekrar edilmez; tagline boşsa hero bio'yu gösterir, o durumda bio da
 * burada tekrar edilmez.
 */
export function About({ settings, experience, education, skills, postCount }: AboutProps) {
  // Admin'de boş satırla ayrılan paragraflar ayrı <p> olarak gösterilir.
  const bioParagraphs = (settings.bio ?? "").split(/\n\s*\n/).map(tidy).filter(Boolean);
  const showBio = Boolean(tidy(settings.tagline)) && bioParagraphs.length > 0;

  const current = experience.find((item) => isOngoing(item.endDate)) ?? experience[0];
  const school = education[0];
  const location = tidy(settings.location);
  const focusAreas = Array.from(new Set(skills.map((group) => tidy(group.category)))).slice(0, 3);
  const years = tidy(settings.statYearsValue);

  const facts = [
    current && {
      icon: Briefcase,
      label: isOngoing(current.endDate) ? "Şu an" : "Son pozisyon",
      value: tidy(current.role),
      detail: [tidy(current.company), years && `${years} yıl deneyim`].filter(Boolean).join(", "),
    },
    school && {
      icon: GraduationCap,
      label: "Eğitim",
      value: tidy(school.institution) || tidy(school.title),
      detail: tidy(school.institution) ? tidy(school.title) : tidy(school.type),
    },
    location && { icon: MapPin, label: "Konum", value: location },
    focusAreas.length > 0 && { icon: Target, label: "Odak alanları", value: focusAreas.join(", ") },
    postCount > 0 && {
      icon: Newspaper,
      label: "Blog",
      value: `${postCount} yazı yayında`,
      detail: "Tüm yazıları oku",
      href: "/blog",
    },
  ].filter(Boolean) as Fact[];

  if (!showBio && facts.length === 0) return null;

  return (
    <section id="about" aria-labelledby="about-heading" className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <SectionHeading id="about-heading" title="Hakkımda" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {showBio && (
          <div className="card p-7 md:p-10">
            <div className="max-w-[65ch] space-y-5 text-[1.0625rem] leading-[1.75] text-ink-2 md:text-lg">
              {bioParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {facts.length > 0 && (
          <ul className={`card divide-y divide-border px-6 ${showBio ? "" : "lg:col-span-2"}`}>
            {facts.map((fact) => (
              <li key={fact.label} className="flex gap-3.5 py-4">
                <fact.icon size={18} aria-hidden className="mt-0.5 shrink-0 text-accent-ink" />
                <div className="min-w-0">
                  <p className="text-[0.8125rem] text-muted">{fact.label}</p>
                  <p className="mt-0.5 font-semibold leading-snug text-ink">{fact.value}</p>
                  {fact.detail &&
                    (fact.href ? (
                      <Link href={fact.href} className="text-link text-sm">
                        {fact.detail}
                      </Link>
                    ) : (
                      <p className="text-sm text-ink-2">{fact.detail}</p>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

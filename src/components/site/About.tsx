import type { Education, Experience, SiteSettings, SkillGroup } from "@prisma/client";
import { Section } from "@/components/ui/SectionHeading";
import { isOngoing, tidy } from "@/lib/site";

interface AboutProps {
  settings: SiteSettings;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
}

interface Fact {
  label: string;
  value: string;
  detail?: string;
}

/**
 * Düz metin biyografi + kısa künye (dl). Hero, tagline boşken bio'yu gösterir;
 * o durumda bio burada tekrar edilmez.
 */
export function About({ settings, experience, education, skills }: AboutProps) {
  // Admin'de boş satırla ayrılan paragraflar ayrı <p> olarak gösterilir.
  const bioParagraphs = (settings.bio ?? "").split(/\n\s*\n/).map(tidy).filter(Boolean);
  const showBio = Boolean(tidy(settings.tagline)) && bioParagraphs.length > 0;

  const current = experience.find((item) => isOngoing(item.endDate)) ?? experience[0];
  const school = education[0];
  const focusAreas = Array.from(new Set(skills.map((group) => tidy(group.category)))).slice(0, 3);

  const facts = [
    current && {
      label: isOngoing(current.endDate) ? "Şu an" : "Son pozisyon",
      value: tidy(current.role),
      detail: tidy(current.company),
    },
    school && {
      label: "Eğitim",
      value: tidy(school.institution) || tidy(school.title),
      detail: tidy(school.institution) ? tidy(school.title) : tidy(school.type),
    },
    focusAreas.length > 0 && { label: "Odak alanları", value: focusAreas.join(", ") },
  ].filter(Boolean) as Fact[];

  if (!showBio && facts.length === 0) return null;

  return (
    <Section id="about" title="Hakkımda">
      {showBio && (
        <div className="max-w-[65ch] space-y-5 text-lg leading-[1.7] text-ink-2">
          {bioParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}

      {facts.length > 0 && (
        <dl className={`grid gap-x-10 sm:grid-cols-3 ${showBio ? "mt-10" : ""}`}>
          {facts.map((fact) => (
            <div key={fact.label} className="border-t border-border py-4">
              <dt className="text-sm text-muted">{fact.label}</dt>
              <dd className="mt-1 font-medium leading-snug text-ink">{fact.value}</dd>
              {fact.detail && <dd className="text-sm text-ink-2">{fact.detail}</dd>}
            </div>
          ))}
        </dl>
      )}
    </Section>
  );
}

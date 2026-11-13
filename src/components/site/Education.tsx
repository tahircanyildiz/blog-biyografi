import type { Education as EducationItem } from "@prisma/client";
import { Section } from "@/components/ui/SectionHeading";
import { splitLines } from "@/lib/content";
import { tidy } from "@/lib/site";

interface EducationProps {
  items: EducationItem[];
}

export function Education({ items }: EducationProps) {
  if (items.length === 0) return null;

  return (
    <Section id="education" title="Eğitim">
      <ol>
        {items.map((edu) => {
          const bullets = splitLines(edu.bullets);
          // "Üniversite" gibi genel bir başlık girilmişse okulu öne çıkar.
          const headline = tidy(edu.institution) || tidy(edu.title);
          const subline = [tidy(edu.institution) ? tidy(edu.title) : "", tidy(edu.type)]
            .filter(Boolean)
            .join(", ");

          return (
            <li key={edu.id} className="border-t border-border first:border-t-0 first:pt-0 py-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-semibold text-ink">{headline}</h3>
                {edu.period && <p className="tabular text-sm text-muted">{tidy(edu.period)}</p>}
              </div>
              {subline && <p className="mt-0.5 text-ink-2">{subline}</p>}

              {bullets.length > 0 && (
                <ul className="mt-4 max-w-[65ch] list-disc space-y-1.5 pl-5 leading-relaxed text-ink-2 marker:text-muted">
                  {bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

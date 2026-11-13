import type { Experience as ExperienceItem } from "@prisma/client";
import { Section } from "@/components/ui/SectionHeading";
import { splitTags } from "@/lib/content";
import { tidy } from "@/lib/site";

interface ExperienceProps {
  items: ExperienceItem[];
}

/** Özgeçmiş düzeni: her pozisyon bir satır, aralarında ince çizgi. */
export function Experience({ items }: ExperienceProps) {
  if (items.length === 0) return null;

  return (
    <Section id="experience" title="Deneyim">
      <ol>
        {items.map((exp) => {
          const stats = [
            { label: exp.stat1Label, value: exp.stat1Value },
            { label: exp.stat2Label, value: exp.stat2Value },
            { label: exp.stat3Label, value: exp.stat3Value },
          ].filter((stat) => stat.label && stat.value);
          const where = [tidy(exp.company), tidy(exp.employment)].filter(Boolean).join(", ");
          const tags = exp.tags ? splitTags(exp.tags) : [];

          return (
            <li key={exp.id} className="border-t border-border first:border-t-0 first:pt-0 py-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-semibold text-ink">{tidy(exp.role)}</h3>
                <p className="tabular text-sm text-muted">
                  {tidy(exp.startDate)} – {tidy(exp.endDate)}
                </p>
              </div>
              {where && <p className="mt-0.5 text-ink-2">{where}</p>}

              {exp.description && (
                <p className="mt-4 max-w-[65ch] leading-relaxed text-ink-2">{tidy(exp.description)}</p>
              )}

              {stats.length > 0 && (
                <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex gap-2">
                      <dt className="text-muted">{stat.label}</dt>
                      <dd className="tabular font-medium text-ink">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {tags.length > 0 && (
                <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-muted">
                  <span className="sr-only">Kullanılan teknolojiler: </span>
                  {tags.join(", ")}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

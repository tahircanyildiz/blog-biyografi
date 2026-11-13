import type { Experience as ExperienceItem } from "@prisma/client";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { splitTags } from "@/lib/content";
import { isOngoing, tidy } from "@/lib/site";

interface ExperienceProps {
  items: ExperienceItem[];
}

export function Experience({ items }: ExperienceProps) {
  if (items.length === 0) return null;

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="mx-auto max-w-6xl px-6 py-14 md:py-20"
    >
      <SectionHeading id="experience-heading" title="Deneyim" />

      <ol className="relative mt-8 space-y-5 border-l border-border pl-7 md:ml-2 md:pl-10">
        {items.map((exp) => {
          const ongoing = isOngoing(exp.endDate);
          const stats = [
            { label: exp.stat1Label, value: exp.stat1Value },
            { label: exp.stat2Label, value: exp.stat2Value },
            { label: exp.stat3Label, value: exp.stat3Value },
          ].filter((stat) => stat.label && stat.value);
          const meta = [tidy(exp.company), tidy(exp.employment)].filter(Boolean);

          return (
            <li key={exp.id} className="relative">
              <span
                aria-hidden
                className={`absolute -left-[calc(1.75rem+6.5px)] top-8 size-3 rounded-full ring-4 ring-bg md:-left-[calc(2.5rem+6.5px)] ${
                  ongoing ? "bg-accent" : "bg-border-hover"
                }`}
              />

              <article className="card p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-ink">{tidy(exp.role)}</h3>
                    {meta.length > 0 && (
                      <p className="mt-1 text-sm text-muted">
                        {meta.map((part, index) => (
                          <span key={part}>
                            {index > 0 && ", "}
                            <span className={index === 0 ? "font-medium text-ink-2" : "capitalize"}>
                              {part}
                            </span>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {ongoing && (
                      <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent-ink">
                        Güncel
                      </span>
                    )}
                    <span className="tabular text-sm text-muted">
                      {tidy(exp.startDate)} – {tidy(exp.endDate)}
                    </span>
                  </div>
                </div>

                {exp.description && (
                  <p className="mt-5 max-w-3xl leading-relaxed text-ink-2">{tidy(exp.description)}</p>
                )}

                {exp.tags && (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Kullanılan teknolojiler">
                    {splitTags(exp.tags).map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                {stats.length > 0 && (
                  <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-5">
                    {stats.map((stat) => (
                      <div key={stat.label} className="flex flex-col">
                        <dt className="order-2 text-xs text-muted">{stat.label}</dt>
                        <dd className="order-1 font-serif text-2xl font-semibold text-ink">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

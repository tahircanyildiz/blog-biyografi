import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { splitTags } from "@/lib/content";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  employment: string;
  startDate: string;
  endDate: string;
  description: string;
  tags: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
}

interface ExperienceProps {
  items: ExperienceItem[];
}

export function Experience({ items }: ExperienceProps) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-20">
      <RevealOnScroll>
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Deneyim
        </h2>
      </RevealOnScroll>

      <div className="mt-12 space-y-12 border-l border-border pl-8">
        {items.map((exp, index) => {
          const stats = [
            { label: exp.stat1Label, value: exp.stat1Value },
            { label: exp.stat2Label, value: exp.stat2Value },
            { label: exp.stat3Label, value: exp.stat3Value },
          ].filter((s) => s.label && s.value);

          return (
            <RevealOnScroll key={exp.id} delay={Math.min(index * 0.05, 0.2)}>
              <div className="relative">
                <span className="absolute -left-[2.55rem] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg" />

                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-ink">
                    {exp.role} · {exp.company}
                  </h3>
                  <span className="text-sm text-muted">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>

                {exp.employment && (
                  <p className="mt-1 text-sm text-muted">{exp.employment}</p>
                )}

                {exp.description && (
                  <p className="mt-3 max-w-prose text-muted leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {exp.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {splitTags(exp.tags).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {stats.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-6">
                    {stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="text-base font-semibold text-ink">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}

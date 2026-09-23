import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DecorativeLine } from "@/components/ui/DecorativeLine";
import { splitLines } from "@/lib/content";

interface EducationItem {
  id: string;
  icon: string;
  title: string;
  institution: string;
  period: string;
  type: string;
  bullets: string;
}

interface EducationProps {
  items: EducationItem[];
}

const ICON_MAP: Record<string, string> = {
  graduation: "🎓",
  award: "🏆",
  certificate: "🏆",
  mobile: "📱",
  code: "💻",
};

export function Education({ items }: EducationProps) {
  if (items.length === 0) return null;

  return (
    <section id="education" className="relative mx-auto max-w-5xl px-6 py-20">
      <DecorativeLine />

      <RevealOnScroll>
        <SectionHeading eyebrow="Akademik Geçmiş" title="Eğitim" />
      </RevealOnScroll>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((edu, index) => {
          const emoji = ICON_MAP[edu.icon] ?? "🎓";
          const bullets = splitLines(edu.bullets);
          const highlighted = bullets.length > 0;

          return (
            <RevealOnScroll key={edu.id} delay={Math.min(index * 0.05, 0.2)}>
              <div
                className={`h-full rounded-2xl bg-surface p-6 md:p-8 ${
                  highlighted ? "border border-ink/30" : "border border-border"
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {emoji}
                </span>

                <h3 className="mt-4 text-base font-semibold text-ink">{edu.title}</h3>
                <p className="mt-1 text-sm text-muted">{edu.institution}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {edu.period && (
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs uppercase tracking-[0.1em] text-muted">
                      {edu.period}
                    </span>
                  )}
                  {edu.type && (
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs uppercase tracking-[0.1em] text-muted">
                      {edu.type}
                    </span>
                  )}
                </div>

                {bullets.length > 0 && (
                  <ul className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-muted">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="text-muted" aria-hidden>
                          •
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}

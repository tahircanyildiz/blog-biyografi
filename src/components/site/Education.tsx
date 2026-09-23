import { Award, GraduationCap, type LucideIcon } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
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

const ICONS: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  award: Award,
};

export function Education({ items }: EducationProps) {
  if (items.length === 0) return null;

  return (
    <section id="education" className="mx-auto max-w-5xl px-6 py-20">
      <RevealOnScroll>
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Eğitim
        </h2>
      </RevealOnScroll>

      <div className="mt-12 space-y-8">
        {items.map((edu, index) => {
          const Icon = ICONS[edu.icon] ?? GraduationCap;
          const bullets = splitLines(edu.bullets);

          return (
            <RevealOnScroll key={edu.id} delay={Math.min(index * 0.05, 0.2)}>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-surface">
                  <Icon size={18} className="text-accent" aria-hidden />
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-base font-semibold text-ink">
                      {edu.title}
                    </h3>
                    {edu.type && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                        {edu.type}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {edu.institution}
                    {edu.period ? ` · ${edu.period}` : ""}
                  </p>
                  {bullets.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                      {bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}

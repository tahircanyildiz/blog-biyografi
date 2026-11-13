import {
  Award,
  Code2,
  GraduationCap,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { Education as EducationItem } from "@prisma/client";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { splitLines } from "@/lib/content";
import { tidy } from "@/lib/site";

interface EducationProps {
  items: EducationItem[];
}

// Admin'deki "icon" alanı değerleri — emoji yerine tutarlı çizgi ikonlar.
const ICON_MAP: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  award: Award,
  certificate: Award,
  mobile: Smartphone,
  code: Code2,
};

export function Education({ items }: EducationProps) {
  if (items.length === 0) return null;

  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="mx-auto max-w-6xl px-6 py-14 md:py-20"
    >
      <SectionHeading id="education-heading" title="Eğitim" />

      <div className={`mt-8 grid gap-5 ${items.length > 1 ? "md:grid-cols-2" : ""}`}>
        {items.map((edu) => {
          const Icon = ICON_MAP[edu.icon] ?? GraduationCap;
          const bullets = splitLines(edu.bullets);
          // "Üniversite" gibi genel bir başlık girilmişse okulu öne çıkar.
          const headline = tidy(edu.institution) || tidy(edu.title);
          const subline = tidy(edu.institution) ? tidy(edu.title) : "";

          return (
            <article key={edu.id} className="card flex gap-5 p-6 md:p-8">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-accent-ink">
                <Icon size={22} aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-ink">{headline}</h3>
                {(subline || edu.type) && (
                  <p className="mt-1 text-ink-2">
                    {[subline, edu.type && tidy(edu.type)].filter(Boolean).join(", ")}
                  </p>
                )}
                {edu.period && <p className="tabular mt-2 text-sm text-muted">{tidy(edu.period)}</p>}

                {bullets.length > 0 && (
                  <ul className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-ink-2">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5">
                        <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-muted" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

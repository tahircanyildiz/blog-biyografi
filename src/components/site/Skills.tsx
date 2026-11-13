import {
  ChartColumn,
  ClipboardCheck,
  Code2,
  Cpu,
  Database,
  FlaskConical,
  Gauge,
  GitBranch,
  Layers,
  Monitor,
  Server,
  ShieldCheck,
  Smartphone,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { SkillGroup } from "@prisma/client";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { splitTags } from "@/lib/content";
import { tidy } from "@/lib/site";

interface SkillsProps {
  groups: SkillGroup[];
}

// Kategori adına göre anlamlı ikon — önceden sıra numarasına göre
// döngüsel atandığı için "Frontend" kartında veritabanı ikonu çıkabiliyordu.
const ICON_RULES: [RegExp, LucideIcon][] = [
  [/api\s*test/i, Workflow],
  [/performans|yük|load|perf/i, Gauge],
  [/e2e|ui test|uçtan uca/i, ShieldCheck],
  [/otomasyon|automation/i, Cpu],
  [/rapor|report/i, ChartColumn],
  [/yönetim|metodoloji|süreç|management/i, ClipboardCheck],
  [/yaklaşım|pattern|mimari/i, Layers],
  [/devops|ci\/cd|\bci\b|\bcd\b|bulut|cloud/i, GitBranch],
  [/veri|data|veritaban|önbellek|cache/i, Database],
  [/mobil|mobile/i, Smartphone],
  [/frontend|arayüz|ön yüz/i, Monitor],
  [/backend|api|sunucu|server/i, Server],
  [/araç|tool|proje/i, Wrench],
  [/test|qa|kalite/i, FlaskConical],
];

function iconFor(category: string): LucideIcon {
  return ICON_RULES.find(([pattern]) => pattern.test(category))?.[1] ?? Code2;
}

export function Skills({ groups }: SkillsProps) {
  if (groups.length === 0) return null;

  const categories = new Map<string, SkillGroup[]>();
  for (const group of groups) {
    const key = tidy(group.category);
    const list = categories.get(key) ?? [];
    list.push(group);
    categories.set(key, list);
  }

  return (
    <section id="skills" aria-labelledby="skills-heading" className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <SectionHeading
        id="skills-heading"
        eyebrow="Teknik yetkinlikler"
        title="Yetenekler"
        description="Günlük işimde kullandığım araçlar, diller ve yöntemler."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from(categories.entries()).map(([category, items]) => {
          const Icon = iconFor(category);

          return (
            <div key={category} className="reveal card card-hover p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent-ink ring-1 ring-accent/20">
                  <Icon size={19} aria-hidden />
                </span>
                <h3 className="text-base font-semibold text-ink">{category}</h3>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                {items.map((group) => (
                  <div key={group.id}>
                    {group.subcategory && (
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                        {group.subcategory}
                      </p>
                    )}
                    <ul className="flex flex-wrap gap-1.5">
                      {splitTags(group.items).map((skill) => (
                        <li key={skill} className="chip">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

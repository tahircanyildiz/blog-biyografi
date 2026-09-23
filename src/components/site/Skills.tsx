import { Code2, Database, Layers, Wrench } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DecorativeLine } from "@/components/ui/DecorativeLine";
import { splitTags } from "@/lib/content";

interface SkillGroupItem {
  id: string;
  category: string;
  subcategory: string;
  items: string;
}

interface SkillsProps {
  groups: SkillGroupItem[];
}

const CATEGORY_STYLES = [
  { border: "border-cat-indigo/30", text: "text-cat-indigo", chip: "border-cat-indigo/30 text-cat-indigo/90" },
  { border: "border-cat-teal/30", text: "text-cat-teal", chip: "border-cat-teal/30 text-cat-teal/90" },
  { border: "border-cat-orange/30", text: "text-cat-orange", chip: "border-cat-orange/30 text-cat-orange/90" },
  { border: "border-cat-blue/30", text: "text-cat-blue", chip: "border-cat-blue/30 text-cat-blue/90" },
];

const CATEGORY_ICONS = [Code2, Database, Layers, Wrench];

export function Skills({ groups }: SkillsProps) {
  if (groups.length === 0) return null;

  const categories = new Map<string, SkillGroupItem[]>();
  for (const group of groups) {
    const list = categories.get(group.category) ?? [];
    list.push(group);
    categories.set(group.category, list);
  }
  const cards = Array.from(categories.entries());

  return (
    <section id="skills" className="relative mx-auto max-w-5xl px-6 py-20">
      <DecorativeLine />

      <RevealOnScroll>
        <SectionHeading eyebrow="Teknik Yetkinlikler" title="Yetenekler" />
      </RevealOnScroll>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map(([category, items], index) => {
          const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];
          const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];

          return (
            <RevealOnScroll key={category} delay={Math.min(index * 0.05, 0.2)}>
              <div className={`h-full rounded-2xl border bg-surface p-6 md:p-8 ${style.border}`}>
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <Icon size={16} className={style.text} aria-hidden />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink">
                    {category}
                  </h3>
                </div>

                <div className="mt-5 flex flex-col gap-5">
                  {items.map((group) => (
                    <div key={group.id}>
                      {group.subcategory && (
                        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-muted">
                          {group.subcategory}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {splitTags(group.items).map((skill) => (
                          <span
                            key={skill}
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${style.chip}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}

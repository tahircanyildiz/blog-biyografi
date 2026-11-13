import type { SkillGroup } from "@prisma/client";
import { Section } from "@/components/ui/SectionHeading";
import { splitTags } from "@/lib/content";
import { tidy } from "@/lib/site";

interface SkillsProps {
  groups: SkillGroup[];
}

/**
 * Kategori → araçlar listesi, tanım listesi (dl) olarak. İkonlu kart ızgarası
 * yerine okunabilir satırlar: kategori solda, araçlar virgülle sağda.
 */
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
    <Section id="skills" title="Yetenekler" aside={<p>Günlük işimde kullandığım diller, araçlar ve yöntemler.</p>}>
      <dl>
        {Array.from(categories.entries()).map(([category, items]) => (
          <div
            key={category}
            className="grid gap-2 border-t border-border first:border-t-0 first:pt-0 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6"
          >
            <dt className="font-medium text-ink">{category}</dt>
            <dd className="space-y-2 leading-relaxed text-ink-2">
              {items.map((group) => (
                <p key={group.id}>
                  {group.subcategory && <span className="text-muted">{tidy(group.subcategory)}: </span>}
                  {splitTags(group.items).join(", ")}
                </p>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

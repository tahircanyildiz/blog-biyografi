import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
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

export function Skills({ groups }: SkillsProps) {
  if (groups.length === 0) return null;

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <RevealOnScroll>
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Yetenekler
        </h2>
      </RevealOnScroll>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {groups.map((group, index) => (
          <RevealOnScroll key={group.id} delay={Math.min(index * 0.05, 0.2)}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
                {group.category}
              </h3>
              {group.subcategory && (
                <p className="mt-1 text-xs text-muted">{group.subcategory}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {splitTags(group.items).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

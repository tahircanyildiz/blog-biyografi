import Image from "next/image";
import type { Project } from "@prisma/client";
import { Section } from "@/components/ui/SectionHeading";
import { splitTags } from "@/lib/content";

interface ProjectsProps {
  items: Project[];
}

export function Projects({ items }: ProjectsProps) {
  if (items.length === 0) return null;

  return (
    <Section id="projects" title="Projeler">
      <ul>
        {items.map((project) => {
          const details = [
            { label: "Amaç", value: project.mission },
            { label: "Öne çıkan özellik", value: project.keyFeature },
            { label: "Müşteri", value: project.clientName },
          ].filter((detail) => detail.value);
          const kind = [project.eyebrow1, project.eyebrow2].filter(Boolean).join(", ");

          return (
            <li
              key={project.id}
              className={`grid gap-6 border-t border-border first:border-t-0 first:pt-0 py-8 ${
                project.coverImage ? "md:grid-cols-[16rem_minmax(0,1fr)]" : ""
              }`}
            >
              {project.coverImage && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface-2">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 256px, 100vw"
                    className="object-cover"
                  />
                </div>
              )}

              <article className="min-w-0">
                <h3 className="text-lg font-semibold text-ink">{project.title}</h3>
                {kind && <p className="mt-0.5 text-ink-2">{kind}</p>}

                {project.description && (
                  <p className="mt-4 max-w-[65ch] leading-relaxed text-ink-2">{project.description}</p>
                )}

                {details.length > 0 && (
                  <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-3">
                    {details.map((detail) => (
                      <div key={detail.label}>
                        <dt className="text-sm text-muted">{detail.label}</dt>
                        <dd className="mt-0.5 text-sm text-ink">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {project.tags && (
                  <p className="mt-4 text-sm text-muted">{splitTags(project.tags).join(", ")}</p>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link mt-4 inline-block text-sm"
                  >
                    Projeyi incele<span className="sr-only">: {project.title}</span>
                  </a>
                )}
              </article>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

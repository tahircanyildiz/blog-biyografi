import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@prisma/client";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { splitTags } from "@/lib/content";

interface ProjectsProps {
  items: Project[];
}

export function Projects({ items }: ProjectsProps) {
  if (items.length === 0) return null;

  return (
    <section id="projects" aria-labelledby="projects-heading" className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <SectionHeading id="projects-heading" eyebrow="Seçili işler" title="Projeler" />

      <div className="mt-12 grid gap-6">
        {items.map((project, index) => {
          const details = [
            { label: "Amaç", value: project.mission },
            { label: "Öne çıkan özellik", value: project.keyFeature },
            { label: "Müşteri", value: project.clientName },
          ].filter((detail) => detail.value);

          return (
            <div key={project.id} className="reveal">
              <GlowCard className="overflow-hidden">
                <article className="flex flex-col md:flex-row">
                  {project.coverImage && (
                    <div className="relative aspect-[16/9] w-full shrink-0 bg-surface-2 md:aspect-auto md:w-80">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 320px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-mono text-xs text-accent-ink">
                          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                        </span>
                        <h3 className="mt-1 text-xl font-semibold text-ink">{project.title}</h3>
                        {(project.eyebrow1 || project.eyebrow2) && (
                          <p className="mt-1 text-sm text-muted">
                            {[project.eyebrow1, project.eyebrow2].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm shrink-0"
                        >
                          İncele
                          <ArrowUpRight size={16} aria-hidden />
                          <span className="sr-only">: {project.title}</span>
                        </a>
                      )}
                    </div>

                    {project.description && (
                      <p className="mt-4 max-w-prose leading-relaxed text-ink-2">{project.description}</p>
                    )}

                    {details.length > 0 && (
                      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                        {details.map((detail) => (
                          <div key={detail.label}>
                            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                              {detail.label}
                            </dt>
                            <dd className="mt-1 text-sm text-ink">{detail.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    {project.tags && (
                      <ul className="mt-5 flex flex-wrap gap-1.5">
                        {splitTags(project.tags).map((tag) => (
                          <li key={tag} className="chip">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </GlowCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}

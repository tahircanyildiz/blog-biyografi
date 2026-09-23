import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DecorativeLine } from "@/components/ui/DecorativeLine";
import { splitTags } from "@/lib/content";

interface ProjectItem {
  id: string;
  title: string;
  eyebrow1: string;
  eyebrow2: string;
  description: string;
  tags: string;
  mission: string;
  keyFeature: string;
  clientName: string;
  coverImage: string;
  liveUrl: string;
}

interface ProjectsProps {
  items: ProjectItem[];
}

export function Projects({ items }: ProjectsProps) {
  if (items.length === 0) return null;

  return (
    <section id="projects" className="relative mx-auto max-w-5xl px-6 py-20">
      <DecorativeLine />

      <RevealOnScroll>
        <SectionHeading eyebrow="Seçili Projeler" title="Projeler" />
      </RevealOnScroll>

      <div className="mt-16 space-y-6">
        {items.map((project, index) => (
          <RevealOnScroll key={project.id} delay={Math.min(index * 0.05, 0.2)}>
            <GlowCard className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {project.coverImage && (
                  <div className="relative h-48 w-full flex-shrink-0 md:h-auto md:w-72">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      sizes="(min-width: 768px) 288px, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs text-accent">
                        {String(index + 1).padStart(2, "0")}/
                        {String(items.length).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1 text-lg font-semibold text-ink">
                        {project.title}
                      </h3>
                      {(project.eyebrow1 || project.eyebrow2) && (
                        <p className="mt-1 text-xs text-muted">
                          {[project.eyebrow1, project.eyebrow2]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                    </div>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-ink transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        Detayları Gör
                        <ArrowUpRight size={16} aria-hidden />
                      </a>
                    )}
                  </div>

                  {project.description && (
                    <p className="mt-3 max-w-prose text-sm text-muted leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {project.mission && (
                      <div>
                        <dt className="text-xs text-muted">Mission</dt>
                        <dd className="mt-0.5 text-sm text-ink">
                          {project.mission}
                        </dd>
                      </div>
                    )}
                    {project.keyFeature && (
                      <div>
                        <dt className="text-xs text-muted">Key Feature</dt>
                        <dd className="mt-0.5 text-sm text-ink">
                          {project.keyFeature}
                        </dd>
                      </div>
                    )}
                    {project.clientName && (
                      <div>
                        <dt className="text-xs text-muted">Client</dt>
                        <dd className="mt-0.5 text-sm text-ink">
                          {project.clientName}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {project.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {splitTags(project.tags).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </GlowCard>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

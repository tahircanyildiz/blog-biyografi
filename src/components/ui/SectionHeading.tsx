import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Sağ üstte gösterilecek bağlantı/aksiyon ("Tüm yazılar →" gibi). */
  action?: ReactNode;
  id?: string;
}

export function SectionHeading({ eyebrow, title, description, action, id }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2
          id={id}
          className="mt-4 font-serif text-4xl font-semibold tracking-tight text-balance text-ink md:text-5xl"
        >
          {title}
        </h2>
        {description && <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

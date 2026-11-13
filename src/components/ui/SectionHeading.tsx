import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  /** Sağda gösterilecek bağlantı/aksiyon ("Tüm yazılar" gibi). */
  action?: ReactNode;
  id?: string;
}

/** Bölüm başlığı: başlık + kısa açıklama, sağda isteğe bağlı bağlantı. Başlık üstü etiket yok. */
export function SectionHeading({ title, description, action, id }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 id={id} className="font-serif text-3xl font-bold tracking-[-0.02em] text-ink md:text-[2.375rem]">
          {title}
        </h2>
        {description && <p className="mt-2.5 text-[1.0625rem] leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

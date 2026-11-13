import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  /** Başlığın altında, sol sütunda duran kısa not veya bağlantılar. */
  aside?: ReactNode;
  children: ReactNode;
}

/**
 * Ana sayfa bölümlerinin ortak iskeleti: üstte ince çizgi, solda başlık,
 * sağda içerik. Geniş ekranda başlık, içerik kayarken görünür kalır.
 * Bölümler kart ızgarası ve başlık üstü etiketle değil, bu düzenle ayrışır.
 */
export function Section({ id, title, aside, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <div className="grid gap-6 border-t border-border pt-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-12 md:pt-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="md:sticky md:top-24 md:self-start">
          <h2 id={headingId} className="font-serif text-[1.75rem] font-medium leading-tight tracking-[-0.015em] text-ink">
            {title}
          </h2>
          {aside && <div className="mt-3 text-sm leading-relaxed text-muted">{aside}</div>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

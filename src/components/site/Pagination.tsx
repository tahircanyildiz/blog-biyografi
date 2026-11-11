import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageCount: number;
}

export function pageHref(page: number): string {
  return page <= 1 ? "/blog" : `/blog?sayfa=${page}`;
}

/** Taranabilir, gerçek <a> bağlantılı sayfalama (JS gerektirmez). */
export function Pagination({ page, pageCount }: PaginationProps) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const base =
    "inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors";

  return (
    <nav aria-label="Sayfalar" className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={pageHref(page - 1)} className={`${base} border-border text-ink-2 hover:border-accent-ink/60 hover:text-accent-ink`}>
          <ArrowLeft size={16} aria-hidden />
          Daha yeni
        </Link>
      )}

      {pages.map((number) =>
        number === page ? (
          <span key={number} aria-current="page" className={`${base} border-accent bg-accent text-on-accent`}>
            {number}
          </span>
        ) : (
          <Link
            key={number}
            href={pageHref(number)}
            aria-label={`Sayfa ${number}`}
            className={`${base} border-border text-ink-2 hover:border-accent-ink/60 hover:text-accent-ink`}
          >
            {number}
          </Link>
        )
      )}

      {page < pageCount && (
        <Link href={pageHref(page + 1)} className={`${base} border-border text-ink-2 hover:border-accent-ink/60 hover:text-accent-ink`}>
          Daha eski
          <ArrowRight size={16} aria-hidden />
        </Link>
      )}
    </nav>
  );
}

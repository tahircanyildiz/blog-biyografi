import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  name: string;
  path: string;
}

/** Görünür breadcrumb — JSON-LD BreadcrumbList ile aynı öğeleri kullanır. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Konum" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.path} className="flex min-w-0 items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="line-clamp-1 text-ink-2">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="transition-colors hover:text-accent-ink">
                    {item.name}
                  </Link>
                  <ChevronRight size={14} aria-hidden className="shrink-0 opacity-60" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

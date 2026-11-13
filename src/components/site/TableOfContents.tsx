"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

/**
 * Geniş ekranda yazının yanında sabit duran içindekiler. Okunan bölüm
 * IntersectionObserver ile işaretlenir; JS kapalıysa liste yine çalışır.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="İçindekiler" className="text-sm">
      <p className="font-semibold text-ink">İçindekiler</p>
      <ol className="mt-3 space-y-1 border-l border-border">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1 leading-snug transition-colors ${
                  item.level === 3 ? "pl-6" : "pl-3.5"
                } ${
                  isActive
                    ? "border-accent text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

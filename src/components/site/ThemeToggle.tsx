"use client";

import { Moon, Sun } from "lucide-react";

/**
 * Tema durumu React state'inde değil, <html data-theme> üzerinde tutulur
 * (layout'taki inline script ilk boyamadan önce yazar). İkonlar da CSS
 * `light:` varyantıyla değiştiği için hydration uyuşmazlığı oluşmaz.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Gizli mod vb. — tercih sadece bu sayfa için geçerli olur.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Açık/koyu temayı değiştir"
      title="Temayı değiştir"
      className={`inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:text-ink ${className}`}
    >
      <Sun size={18} aria-hidden className="hidden light:block" />
      <Moon size={18} aria-hidden className="block light:hidden" />
    </button>
  );
}

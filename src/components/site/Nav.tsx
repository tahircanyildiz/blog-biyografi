"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

// "/#about" gibi mutlak yol + hash kullanılıyor çünkü bu Nav /blog ve
// /blog/[slug] sayfalarında da render ediliyor — sadece "#about" o
// sayfalarda anasayfaya gitmek yerine mevcut URL'e hash ekler.
const LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/#about", label: "Hakkımda" },
  { href: "/#experience", label: "Deneyim" },
  { href: "/#skills", label: "Yetenekler" },
  { href: "/#contact", label: "İletişim" },
];

interface NavProps {
  name: string;
  roleTitle?: string;
}

export function Nav({ name, roleTitle }: NavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  const isActive = (href: string) => href === "/blog" && pathname.startsWith("/blog");

  return (
    <header
      className={`sticky top-0 z-50 bg-bg transition-[border-color] duration-200 ${
        scrolled || menuOpen ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Ana menü"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6"
      >
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label={`${name} — ana sayfa`}>
          <span className="logo-tile size-10 shrink-0 p-1">
            <Image src="/logo-96.png" alt="" width={32} height={30} className="size-8 object-contain" priority />
          </span>
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate text-sm font-semibold text-ink">{name}</span>
            {roleTitle && <span className="truncate text-xs text-muted">{roleTitle}</span>}
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`py-2 text-sm transition-colors ${
                  active
                    ? "text-ink underline decoration-accent-ink decoration-2 underline-offset-[10px]"
                    : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-10 items-center justify-center rounded-md border border-border text-ink md:hidden"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-border px-6 pb-6 pt-3 md:hidden">
          <div className="flex flex-col">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="border-b border-border py-3.5 text-base font-medium text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

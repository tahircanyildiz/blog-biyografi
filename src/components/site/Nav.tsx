"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

// "/#about" gibi mutlak yol + hash kullanılıyor çünkü bu Nav /blog ve
// /blog/[slug] sayfalarında da render ediliyor — sadece "#about" o
// sayfalarda anasayfaya gitmek yerine mevcut URL'e hash ekler.
const SECTIONS = [
  { href: "/#about", label: "Hakkımda" },
  { href: "/#experience", label: "Deneyim" },
  { href: "/#projects", label: "Projeler" },
  { href: "/#skills", label: "Yetenekler" },
  { href: "/#education", label: "Eğitim" },
];

export function Nav() {
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

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Ana sayfa" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={SECTIONS[0].href}
              className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-bg transition-opacity hover:opacity-90"
            >
              {SECTIONS[0].label}
            </Link>
            {SECTIONS.slice(1).map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink"
              >
                {section.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/#contact"
            className="hidden text-xs font-semibold uppercase tracking-[0.15em] text-accent transition-opacity hover:opacity-80 md:inline"
          >
            İletişime Geç
          </Link>
          <Link
            href="/blog"
            className="hidden text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink md:inline"
          >
            Blog
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-md p-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:hidden"
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-border bg-bg px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {section.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-accent"
            >
              İletişime Geç
            </Link>
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-ink"
            >
              Blog
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

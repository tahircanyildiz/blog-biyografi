"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const SECTIONS = [
  { href: "#about", label: "Hakkımda" },
  { href: "#experience", label: "Deneyim" },
  { href: "#projects", label: "Projeler" },
  { href: "#skills", label: "Yetenekler" },
  { href: "#education", label: "Eğitim" },
  { href: "#contact", label: "İletişim" },
];

interface NavProps {
  name: string;
}

export function Nav({ name }: NavProps) {
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
        <Link href="/" className="font-semibold tracking-tight text-ink">
          {name || "Portfolio"}
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {section.label}
            </a>
          ))}
          <Link
            href="/blog"
            className="rounded-full border border-border px-4 py-1.5 text-sm text-ink transition-colors hover:border-border-hover"
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
              <a
                key={section.href}
                href={section.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {section.label}
              </a>
            ))}
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

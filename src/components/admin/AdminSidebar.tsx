"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";

const LINKS = [
  { href: "/admin/hero", label: "Hero / About" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/contact", label: "Contact & Mesajlar" },
];

const BLOG_ADMIN_URL = "https://blogservice.lobsterlead.com/admin/sites/mrpurposeless";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex flex-shrink-0 flex-col border-b border-border bg-surface/40 md:w-60 md:border-b-0 md:border-r">
      <div className="px-6 py-6">
        <span className="text-sm font-semibold text-ink">Admin Panel</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-surface text-ink"
                  : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        <a
          href={BLOG_ADMIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          Blog (Lobster Lead)
          <ExternalLink size={14} aria-hidden />
        </a>
      </nav>

      <div className="p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <LogOut size={16} aria-hidden />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}

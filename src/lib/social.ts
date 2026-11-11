import {
  AtSign,
  Camera,
  Globe,
  Link2,
  Mail,
  PenLine,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";

/** Marka SVG'si elimizde olan platformlar (bkz. components/ui/SocialIcon.tsx). */
export type BrandKey = "github" | "linkedin" | "x";

export interface SocialMeta {
  /** Ekranda gösterilecek düzgün yazılmış ad ("Linkedin" → "LinkedIn"). */
  label: string;
  brand?: BrandKey;
  /** Marka SVG'si yoksa kullanılacak genel ikon. */
  fallback: LucideIcon;
}

export function getSocialMeta(platform: string): SocialMeta {
  const key = platform.trim().toLowerCase();

  if (key.includes("github")) return { label: "GitHub", brand: "github", fallback: Link2 };
  if (key.includes("linkedin")) return { label: "LinkedIn", brand: "linkedin", fallback: Link2 };
  if (key.includes("twitter") || key === "x" || key.startsWith("x ") || key.includes("(x)")) {
    return { label: "X", brand: "x", fallback: AtSign };
  }
  if (key.includes("instagram")) return { label: "Instagram", fallback: Camera };
  if (key.includes("youtube")) return { label: "YouTube", fallback: PlayCircle };
  if (key.includes("medium") || key.includes("blog")) return { label: platform.trim(), fallback: PenLine };
  if (key.includes("mail") || key.includes("e-posta")) return { label: platform.trim(), fallback: Mail };
  if (key.includes("web") || key.includes("site")) return { label: platform.trim(), fallback: Globe };

  return { label: platform.trim(), fallback: Link2 };
}

/** Geriye dönük uyumluluk için: sadece genel ikon gereken yerler. */
export function getSocialIcon(platform: string): LucideIcon {
  return getSocialMeta(platform).fallback;
}

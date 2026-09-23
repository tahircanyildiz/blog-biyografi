import {
  AtSign,
  Briefcase,
  Camera,
  Globe,
  Link2,
  type LucideIcon,
} from "lucide-react";

/**
 * lucide-react bu sürümde marka ikonlarını (Github/Linkedin/Instagram vb.)
 * içermiyor, bu yüzden platform adına göre en yakın anlamı taşıyan generic
 * bir ikon seçiyoruz.
 */
export function getSocialIcon(platform: string): LucideIcon {
  const key = platform.toLowerCase();

  if (key.includes("instagram")) return Camera;
  if (key.includes("linkedin")) return Briefcase;
  if (key.includes("twitter") || key === "x" || key.includes(" x ")) return AtSign;
  if (key.includes("web") || key.includes("site")) return Globe;

  return Link2;
}

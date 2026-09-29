import { cache } from "react";
import { prisma } from "@/lib/prisma";

// `cache()` requests içinde tekilleştirir — root layout ve sayfa
// component'i aynı istekte ikisi de çağırsa tek DB sorgusu yeterli olur.
export const getSiteSettings = cache(async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
});

export function getSocialLinks() {
  return prisma.socialLink.findMany({ orderBy: { order: "asc" } });
}

export async function getHomePageData() {
  const [settings, experience, projects, skills, education, socialLinks] =
    await Promise.all([
      getSiteSettings(),
      // En güncel deneyim en üstte — bkz. /api/experience/route.ts notu.
      prisma.experience.findMany({ orderBy: { order: "desc" } }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.skillGroup.findMany({ orderBy: { order: "asc" } }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      getSocialLinks(),
    ]);

  return { settings, experience, projects, skills, education, socialLinks };
}

export function splitTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

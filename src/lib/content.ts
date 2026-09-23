import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

export async function getHomePageData() {
  const [settings, experience, projects, skills, education] =
    await Promise.all([
      getSiteSettings(),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.skillGroup.findMany({ orderBy: { order: "asc" } }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
    ]);

  return { settings, experience, projects, skills, education };
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

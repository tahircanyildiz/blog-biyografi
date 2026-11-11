import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";
import { homeDescription, siteName } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  const name = siteName(settings);

  return {
    name,
    short_name: settings.firstName.trim() || name,
    description: homeDescription(settings),
    lang: "tr",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0d14",
    theme_color: "#0a0d14",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

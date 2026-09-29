import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { GoogleAnalytics } from "@/components/site/GoogleAnalytics";
import { getSiteSettings } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

// Root layout artık her istekte SiteSettings okuyor (GA4/GSC ayarları
// için). Bu, altındaki tüm route'ları dinamik yapar — Docker build
// aşamasında henüz DATABASE_URL/SQLite dosyası mevcut olmadığı için
// statik prerender denemesi bu sorguyla çöküyordu.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Portfolio",
    description: "Kişisel portfolyo, biyografi ve blog sitesi",
    verification: settings.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html lang="tr" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased">
        {settings.googleAnalyticsId && (
          <GoogleAnalytics measurementId={settings.googleAnalyticsId} />
        )}
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

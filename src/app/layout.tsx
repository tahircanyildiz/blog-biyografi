import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { GoogleAnalytics } from "@/components/site/GoogleAnalytics";
import { getSiteSettings } from "@/lib/content";
import { SITE_LOCALE, SITE_URL, absoluteUrl } from "@/lib/site";
import { homeDescription, homeTitle, siteName } from "@/lib/seo";
import "./globals.css";

// Türkçe karakterler (ı, ş, ğ, İ) "latin-ext" alt kümesinde; olmadan bu
// harfler sistem fontuyla çiziliyor ve metin karışık görünüyordu.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["600"],
});

// Root layout artık her istekte SiteSettings okuyor (GA4/GSC ayarları
// için). Bu, altındaki tüm route'ları dinamik yapar — Docker build
// aşamasında henüz DATABASE_URL/SQLite dosyası mevcut olmadığı için
// statik prerender denemesi bu sorguyla çöküyordu.
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0d14" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
  ],
  colorScheme: "dark light",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = siteName(settings);
  const description = homeDescription(settings);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: homeTitle(settings),
      template: `%s | ${name}`,
    },
    description,
    applicationName: name,
    authors: [{ name, url: absoluteUrl("/") }],
    creator: name,
    publisher: name,
    alternates: {
      types: {
        "application/rss+xml": [{ url: "/rss.xml", title: `${name} — Blog RSS` }],
      },
    },
    openGraph: {
      type: "website",
      siteName: name,
      locale: SITE_LOCALE,
      title: homeTitle(settings),
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: homeTitle(settings),
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { telephone: false, email: false, address: false },
    verification: settings.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
  };
}

// İlk boyamadan ÖNCE çalışır: kayıtlı tema yoksa sistem tercihini uygular,
// böylece sayfa yanlış temada parlayıp sonra değişmez (FOUC yok).
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t}catch(e){}})();`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="tr"
      className={`${inter.variable} ${fraunces.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Blog kapak görselleri bu alan adından geliyor (LCP öğesi). */}
        <link rel="preconnect" href="https://storage.googleapis.com" crossOrigin="" />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <a href="#main" className="skip-link">
          İçeriğe geç
        </a>
        {settings.googleAnalyticsId && (
          <GoogleAnalytics measurementId={settings.googleAnalyticsId} />
        )}
        {children}
      </body>
    </html>
  );
}

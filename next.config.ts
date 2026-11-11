import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    // Görsel optimizasyonu açık: 450 KB'lık profil PNG'si ve 1600px blog
    // kapakları cihaza uygun boyutta WebP olarak sunulur (mobil LCP).
    // Not: Önceki "sharp kurulu değil" teşhisi yanlıştı — sharp'ın Alpine
    // (linuxmusl) ikilisi package-lock'ta var. Asıl sorun Next'in sonradan
    // yüklenen public/uploads dosyalarını görmemesiydi; bkz.
    // src/app/uploads/[file]/route.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/lobsterlead-storage/**",
      },
      // Elle yazılan blog yazılarının kapakları sitenin kendi /uploads
      // klasöründe barındırılıyor (Google Görseller'de itibar bu alan adına).
      {
        protocol: "https",
        hostname: "www.tahircanyildiz.com",
        pathname: "/uploads/**",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Varsayılan 16 genişlik yerine 9: her <img> srcset'i (HTML'e iki kez
    // gömülüyor) ve sunucuda üretilen görsel varyantı sayısı azalır.
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Self-hosted (Docker/standalone) ortamda `sharp` paketi kurulu değil;
    // onsuz Next'in image optimization endpoint'i üretimde hata verip
    // görselleri kırık gösteriyor. Küçük/düşük trafikli bir site için
    // optimize edilmemiş orijinal dosyayı sunmak yeterli ve daha sağlam.
    unoptimized: true,
  },
};

export default nextConfig;

import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Next.js production'da `public/` klasörünü SADECE sunucu açılırken tarar;
 * admin panelden sonradan yüklenen görseller (public/uploads) container
 * yeniden başlatılana kadar 404 veriyordu — hem doğrudan hem de görsel
 * optimizasyonu (/_next/image) üzerinden. Açılışta var olan dosyaları Next
 * yine kendisi servis eder; bu route sadece sonradan eklenenleri karşılar.
 */
const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

// Upload API'si dosyaları `<uuid>.<uzantı>` olarak kaydediyor; path traversal'a kapalı.
const SAFE_NAME = /^[A-Za-z0-9_-]+\.(jpe?g|png|webp|gif)$/;

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!SAFE_NAME.test(file)) {
    return new Response("Not found", { status: 404 });
  }

  const extension = file.split(".").pop()!.toLowerCase();

  try {
    const data = await readFile(path.join(process.cwd(), "public", "uploads", file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": CONTENT_TYPES[extension],
        // Dosya adları UUID — içerik hiç değişmez.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const PUBLIC_DIR = path.join(process.cwd(), "public");

/**
 * next/og'un gömülü fontu sadece "latin" alt kümesini içeriyor; ı/ş/ğ/İ
 * gibi Türkçe harfler kutucuk olarak çiziliyordu. latin + latin-ext WOFF
 * dosyaları public/fonts/og altında (OFL lisanslı, bkz. LICENSE-*.txt).
 */
async function loadFonts() {
  const file = (name: string) => readFile(path.join(PUBLIC_DIR, "fonts", "og", name));
  const [inter400, inter400Ext, inter600, inter600Ext, fraunces, fraunces600Ext] = await Promise.all([
    file("inter-latin-400-normal.woff"),
    file("inter-latin-ext-400-normal.woff"),
    file("inter-latin-600-normal.woff"),
    file("inter-latin-ext-600-normal.woff"),
    file("fraunces-latin-600-normal.woff"),
    file("fraunces-latin-ext-600-normal.woff"),
  ]);

  return [
    { name: "Inter", data: inter400, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: inter400Ext, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: inter600, weight: 600 as const, style: "normal" as const },
    { name: "Inter", data: inter600Ext, weight: 600 as const, style: "normal" as const },
    { name: "Fraunces", data: fraunces, weight: 600 as const, style: "normal" as const },
    { name: "Fraunces", data: fraunces600Ext, weight: 600 as const, style: "normal" as const },
  ];
}

/** /public altındaki bir görseli data URL'e çevirir (satori uzak dosya beklemesin). */
async function publicImageDataUrl(publicPath: string): Promise<string | null> {
  if (!publicPath.startsWith("/") || publicPath.includes("..")) return null;
  const ext = path.extname(publicPath).toLowerCase();
  const mime =
    ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : null;
  // satori webp/gif desteklemiyor; o durumda fotoğrafsız tasarıma düşülür.
  if (!mime) return null;

  try {
    const data = await readFile(path.join(PUBLIC_DIR, publicPath));
    return `data:${mime};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

interface OgImageInput {
  eyebrow: string;
  title: string;
  description: string;
  footer: string;
  photo?: string;
  badge?: string;
}

export async function renderOgImage({ eyebrow, title, description, footer, photo, badge }: OgImageInput) {
  const [fonts, logo, photoUrl] = await Promise.all([
    loadFonts(),
    publicImageDataUrl("/logo.png"),
    photo ? publicImageDataUrl(photo) : Promise.resolve(null),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a0d14",
          borderTop: "8px solid #3b5bdb",
          fontFamily: "Inter",
          color: "#eef2f8",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {logo && (
              <div
                style={{
                  display: "flex",
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  backgroundColor: "#ffffff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} width={52} height={52} alt="" style={{ objectFit: "contain" }} />
              </div>
            )}
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: "#cdd5e2",
              }}
            >
              {eyebrow}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 48,
              fontFamily: "Fraunces",
              fontSize: title.length > 26 ? 72 : 88,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#cdd5e2",
              maxWidth: photoUrl ? 680 : 960,
            }}
          >
            {description}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "auto" }}>
            {badge && (
              <div
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "2px solid #34405a",
                  color: "#eef2f8",
                  fontSize: 24,
                }}
              >
                {badge}
              </div>
            )}
            <div style={{ display: "flex", fontSize: 26, color: "#9aa4b8" }}>{footer}</div>
          </div>
        </div>

        {photoUrl && (
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              marginLeft: 48,
              width: 340,
              height: 420,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl} width={340} height={420} alt="" style={{ objectFit: "cover" }} />
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts }
  );
}

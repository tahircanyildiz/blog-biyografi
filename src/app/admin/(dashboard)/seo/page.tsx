"use client";

import { useEffect, useState, type FormEvent } from "react";
import { TextAreaField, TextField } from "@/components/admin/FormField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import { pickFields } from "@/lib/pickFields";

interface SeoForm {
  seoTitle: string;
  seoDescription: string;
  blogTitle: string;
  blogDescription: string;
  googleSiteVerification: string;
  googleAnalyticsId: string;
}

const EMPTY_FORM: SeoForm = {
  seoTitle: "",
  seoDescription: "",
  blogTitle: "",
  blogDescription: "",
  googleSiteVerification: "",
  googleAnalyticsId: "",
};

/** Google'ın arama sonucunda genelde kestiği yaklaşık uzunluklar. */
function LengthHint({ value, min, max }: { value: string; min: number; max: number }) {
  const length = value.trim().length;
  const tone =
    length === 0 ? "text-muted" : length < min || length > max ? "text-amber-500" : "text-emerald-500";
  return (
    <span className={`text-xs font-medium ${tone}`}>
      {length} karakter · önerilen {min}–{max}
    </span>
  );
}

export default function AdminSeoPage() {
  const [form, setForm] = useState<SeoForm>(EMPTY_FORM);
  const [fallbacks, setFallbacks] = useState({ name: "", role: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setForm(pickFields(data, EMPTY_FORM));
        setFallbacks({
          name: [data.firstName, data.lastName].filter(Boolean).join(" "),
          role: data.roleTitle ?? "",
          bio: data.tagline || data.bio || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof SeoForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    try {
      // Sadece bu sayfanın alanları gönderilir; API gönderilmeyen alanlara
      // dokunmaz.
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (loading) {
    return <p className="text-muted">Yükleniyor...</p>;
  }

  const defaultTitle = [fallbacks.name, fallbacks.role].filter(Boolean).join(" | ");

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold tracking-tight text-ink">SEO & Analytics</h1>
      <p className="mt-2 text-sm text-muted">
        Boş bıraktığınız alanlarda otomatik bir varsayılan kullanılır. Başlık ve açıklama,
        Google sonuçlarında ve LinkedIn/WhatsApp paylaşımlarında görünen metindir — tıklanma
        oranını doğrudan etkiler.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink">
            Ana sayfa
          </legend>
          <div>
            <TextField
              label="Sayfa başlığı (title)"
              name="seoTitle"
              value={form.seoTitle}
              onChange={(v) => set("seoTitle", v)}
              placeholder={defaultTitle || "Ad Soyad | Unvan"}
            />
            <div className="mt-1.5 flex flex-wrap justify-between gap-2">
              <span className="text-xs text-muted">Öneri: Ad Soyad | Unvan & uzmanlık alanı</span>
              <LengthHint value={form.seoTitle} min={30} max={60} />
            </div>
          </div>
          <div>
            <TextAreaField
              label="Meta açıklama (description)"
              name="seoDescription"
              value={form.seoDescription}
              onChange={(v) => set("seoDescription", v)}
              placeholder={fallbacks.bio.slice(0, 158) || "Kim olduğunuzu ve ne yaptığınızı 1–2 cümlede anlatın."}
              rows={3}
            />
            <div className="mt-1.5 flex justify-end">
              <LengthHint value={form.seoDescription} min={120} max={160} />
            </div>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink">Blog</legend>
          <div>
            <TextField
              label="Blog sayfası başlığı"
              name="blogTitle"
              value={form.blogTitle}
              onChange={(v) => set("blogTitle", v)}
              placeholder="Blog"
            />
            <div className="mt-1.5 flex flex-wrap justify-between gap-2">
              <span className="text-xs text-muted">
                Sayfada H1 olarak da görünür; sonuna otomatik “| {fallbacks.name || "Ad Soyad"}” eklenir.
              </span>
              <LengthHint value={form.blogTitle} min={15} max={40} />
            </div>
          </div>
          <div>
            <TextAreaField
              label="Blog açıklaması"
              name="blogDescription"
              value={form.blogDescription}
              onChange={(v) => set("blogDescription", v)}
              placeholder="Blogun hangi konuları kapsadığını ve okura ne kazandırdığını anlatın."
              rows={3}
            />
            <div className="mt-1.5 flex justify-end">
              <LengthHint value={form.blogDescription} min={120} max={160} />
            </div>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <legend className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink">
            Google araçları
          </legend>
          <div>
            <TextField
              label="Google Search Console Doğrulama Kodu"
              name="googleSiteVerification"
              value={form.googleSiteVerification}
              onChange={(v) => set("googleSiteVerification", v)}
              placeholder="örn. AbCdEfGh1234..."
            />
            <p className="mt-1.5 text-xs text-muted">
              Search Console&apos;da &quot;HTML etiketi&quot; doğrulama yöntemini seçtiğinizde size
              şöyle bir satır verilir:{" "}
              <code className="rounded bg-surface px-1 py-0.5">
                {'<meta name="google-site-verification" content="BURASI" />'}
              </code>{" "}
              — sadece <code className="rounded bg-surface px-1 py-0.5">content=&quot;...&quot;</code>{" "}
              içindeki kodu buraya yapıştırın, tüm etiketi değil. Doğrulamadan sonra Search
              Console&apos;a <code className="rounded bg-surface px-1 py-0.5">/sitemap.xml</code>{" "}
              adresini gönderin.
            </p>
          </div>

          <div>
            <TextField
              label="Google Analytics Ölçüm Kimliği (GA4)"
              name="googleAnalyticsId"
              value={form.googleAnalyticsId}
              onChange={(v) => set("googleAnalyticsId", v)}
              placeholder="G-XXXXXXXXXX"
            />
            <p className="mt-1.5 text-xs text-muted">
              Google Analytics&apos;te Admin → Veri Akışları → (siteniz) → &quot;Ölçüm Kimliği&quot;
              (Measurement ID) — <code className="rounded bg-surface px-1 py-0.5">G-</code> ile
              başlar. Bu alan boşken hiçbir analytics script&apos;i yüklenmez.
            </p>
          </div>
        </fieldset>

        <SaveBar status={status} />
      </form>
    </div>
  );
}

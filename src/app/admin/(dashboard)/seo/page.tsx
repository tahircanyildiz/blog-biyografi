"use client";

import { useEffect, useState, type FormEvent } from "react";
import { TextField } from "@/components/admin/FormField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";

interface SeoForm {
  googleSiteVerification: string;
  googleAnalyticsId: string;
}

const EMPTY_FORM: SeoForm = {
  googleSiteVerification: "",
  googleAnalyticsId: "",
};

export default function AdminSeoPage() {
  const [form, setForm] = useState<SeoForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => setForm({ ...EMPTY_FORM, ...data }))
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof SeoForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    try {
      // Diğer SiteSettings alanlarını mevcut haliyle koru, sadece bu
      // sayfanın alanlarını güncelle.
      const current = await fetch("/api/content").then((res) => res.json());
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, ...form }),
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

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold tracking-tight text-ink">
        SEO & Analytics
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        <div>
          <TextField
            label="Google Search Console Doğrulama Kodu"
            name="googleSiteVerification"
            value={form.googleSiteVerification}
            onChange={(v) => set("googleSiteVerification", v)}
            placeholder="örn. AbCdEfGh1234..."
          />
          <p className="mt-1.5 text-xs text-muted">
            Search Console&apos;da &quot;HTML etiketi&quot; doğrulama yöntemini
            seçtiğinizde size şöyle bir satır verilir:{" "}
            <code className="rounded bg-surface px-1 py-0.5">
              {'<meta name="google-site-verification" content="BURASI" />'}
            </code>{" "}
            — sadece <code className="rounded bg-surface px-1 py-0.5">content=&quot;...&quot;</code>{" "}
            içindeki kodu buraya yapıştırın, tüm etiketi değil.
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
            Google Analytics&apos;te Admin → Veri Akışları → (siteniz) →
            &quot;Ölçüm Kimliği&quot; (Measurement ID) — <code className="rounded bg-surface px-1 py-0.5">G-</code>{" "}
            ile başlar. Bu alan boşken hiçbir analytics script&apos;i yüklenmez.
          </p>
        </div>

        <SaveBar status={status} />
      </form>
    </div>
  );
}

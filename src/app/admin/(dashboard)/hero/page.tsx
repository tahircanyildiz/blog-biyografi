"use client";

import { useEffect, useState, type FormEvent } from "react";
import { TextField, TextAreaField } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";

interface SiteSettingsForm {
  firstName: string;
  lastName: string;
  roleTitle: string;
  tagline: string;
  bio: string;
  statYearsLabel: string;
  statYearsValue: string;
  statProjLabel: string;
  statProjValue: string;
  statLocLabel: string;
  location: string;
  profileImage: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  footerNote: string;
}

const EMPTY_FORM: SiteSettingsForm = {
  firstName: "",
  lastName: "",
  roleTitle: "",
  tagline: "",
  bio: "",
  statYearsLabel: "",
  statYearsValue: "",
  statProjLabel: "",
  statProjValue: "",
  statLocLabel: "",
  location: "",
  profileImage: "",
  email: "",
  githubUrl: "",
  linkedinUrl: "",
  footerNote: "",
};

export default function AdminHeroPage() {
  const [form, setForm] = useState<SiteSettingsForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => setForm({ ...EMPTY_FORM, ...data }))
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof SiteSettingsForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    try {
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

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold tracking-tight text-ink">
        Hero / About
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Ad" name="firstName" value={form.firstName} onChange={(v) => set("firstName", v)} />
          <TextField label="Soyad" name="lastName" value={form.lastName} onChange={(v) => set("lastName", v)} />
        </div>

        <TextField label="Rol Başlığı" name="roleTitle" value={form.roleTitle} onChange={(v) => set("roleTitle", v)} />
        <TextField label="Tagline" name="tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
        <TextAreaField label="Biyografi" name="bio" value={form.bio} onChange={(v) => set("bio", v)} rows={5} />

        <ImageUploadField
          label="Profil Fotoğrafı"
          value={form.profileImage}
          onChange={(url) => set("profileImage", url)}
        />

        <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink">
          İstatistik Kartları
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Stat 1 Etiket" name="statYearsLabel" value={form.statYearsLabel} onChange={(v) => set("statYearsLabel", v)} />
          <TextField label="Stat 1 Değer" name="statYearsValue" value={form.statYearsValue} onChange={(v) => set("statYearsValue", v)} />
          <TextField label="Stat 2 Etiket" name="statProjLabel" value={form.statProjLabel} onChange={(v) => set("statProjLabel", v)} />
          <TextField label="Stat 2 Değer" name="statProjValue" value={form.statProjValue} onChange={(v) => set("statProjValue", v)} />
          <TextField label="Stat 3 Etiket" name="statLocLabel" value={form.statLocLabel} onChange={(v) => set("statLocLabel", v)} />
        </div>

        <p className="mt-2 text-xs text-muted">
          Lokasyon, e-posta, GitHub/LinkedIn ve footer notu &quot;Contact &amp; Mesajlar&quot;
          sayfasından düzenlenir.
        </p>

        <SaveBar status={status} />
      </form>
    </div>
  );
}

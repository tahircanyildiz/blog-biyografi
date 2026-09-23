"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Yükleme başarısız");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Yükleme sırasında bir hata oluştu");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm text-muted">{label}</span>

      {value && (
        <div className="relative mb-3 h-32 w-32 overflow-hidden rounded-lg border border-border">
          <Image src={value} alt="" fill className="object-cover" />
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border file:border-border file:bg-surface file:px-4 file:py-2 file:text-sm file:text-ink"
      />

      {uploading && <p className="mt-1 text-xs text-muted">Yükleniyor...</p>}
      {error && (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

interface CopyLinkButtonProps {
  url: string;
  title: string;
  className?: string;
}

/** Mobilde yerel paylaşım menüsünü açar, masaüstünde bağlantıyı kopyalar. */
export function CopyLinkButton({ url, title, className = "" }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Kullanıcı paylaşımı iptal etti ya da pano izni yok — sessizce geç.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? "Bağlantı kopyalandı" : "Bağlantıyı kopyala"}
      title={copied ? "Kopyalandı" : "Bağlantıyı kopyala"}
      className={className}
    >
      {copied ? <Check size={16} aria-hidden /> : <Link2 size={16} aria-hidden />}
      <span role="status" className="sr-only">
        {copied ? "Bağlantı kopyalandı" : ""}
      </span>
    </button>
  );
}

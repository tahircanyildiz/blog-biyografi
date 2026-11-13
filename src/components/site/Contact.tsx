"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, MapPin, Send } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getSocialMeta } from "@/lib/social";

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
}

interface ContactProps {
  email: string;
  location: string;
  socialLinks: SocialLinkItem[];
}

type SubmitState = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-border-hover";

export function Contact({ email, location, socialLinks }: ContactProps) {
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      if (!response.ok) throw new Error("Gönderim başarısız");

      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <SectionHeading id="contact-heading" title="İletişim" />

      <div className="card mt-8 p-6 sm:p-10">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="max-w-md text-lg leading-relaxed text-ink-2">
              Bir yazıyla ilgili sorunuz, düzeltme öneriniz ya da bir iş teklifiniz varsa formu
              doldurun veya doğrudan e-posta gönderin.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="group inline-flex items-center gap-3 text-ink transition-colors hover:text-accent-ink"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-2 text-accent-ink">
                      <Mail size={18} aria-hidden />
                    </span>
                    <span className="break-all">{email}</span>
                  </a>
                </li>
              )}
              {location && (
                <li className="inline-flex items-center gap-3 text-ink">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-2 text-accent-ink">
                    <MapPin size={18} aria-hidden />
                  </span>
                  {location}
                </li>
              )}
            </ul>

            {socialLinks.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {socialLinks.map((social) => {
                  const meta = getSocialMeta(social.platform);
                  return (
                    <li key={social.id}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="chip transition-colors hover:border-accent-ink/60 hover:text-accent-ink"
                      >
                        <SocialIcon platform={social.platform} size={15} />
                        {meta.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {state === "success" ? (
            <div
              role="status"
              className="flex flex-col items-center justify-center rounded-xl bg-surface-2 p-10 text-center"
            >
              <CheckCircle2 size={44} aria-hidden className="text-accent-ink" />
              <p className="mt-4 text-xl font-semibold text-ink">Mesajınız iletildi. Teşekkürler.</p>
              <p className="mt-2 text-muted">Yanıtım, formda yazdığınız e-posta adresine gelecek.</p>
              <button
                type="button"
                onClick={() => setState("idle")}
                className="btn btn-secondary btn-sm mt-6"
              >
                Yeni mesaj yaz
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                    Adınız
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Ad Soyad"
                    required
                    maxLength={120}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                    E-posta
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ornek@eposta.com"
                    required
                    maxLength={200}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Kısaca nasıl yardımcı olabileceğimi anlatın…"
                  required
                  rows={5}
                  maxLength={5000}
                  className={`${inputClass} resize-y`}
                />
              </div>

              {/* Bot tuzağı (honeypot): insanlar görmez/doldurmaz, botlar doldurur. */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Web siteniz</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <button type="submit" disabled={state === "loading"} className="btn btn-primary mt-1 w-full disabled:opacity-60">
                {state === "loading" ? "Gönderiliyor…" : "Mesajı gönder"}
                <Send size={16} aria-hidden />
              </button>

              {state === "error" && (
                <p className="text-sm text-red-400 light:text-red-700" role="alert">
                  Mesaj gönderilemedi. Tekrar deneyin ya da doğrudan e-posta gönderin.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

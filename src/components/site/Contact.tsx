"use client";

import { useState, type FormEvent } from "react";
import { Section } from "@/components/ui/SectionHeading";
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
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-base text-ink transition-colors hover:border-border-hover";

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
    <Section id="contact" title="İletişim">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div>
          <p className="max-w-[46ch] text-lg leading-relaxed text-ink-2">
            Bir yazıyla ilgili sorunuz, düzeltme öneriniz ya da bir iş teklifiniz varsa formu doldurun
            veya doğrudan e-posta gönderin.
          </p>

          <dl className="mt-8 space-y-4">
            {email && (
              <div>
                <dt className="text-sm text-muted">E-posta</dt>
                <dd className="mt-0.5">
                  <a href={`mailto:${email}`} className="text-link break-all">
                    {email}
                  </a>
                </dd>
              </div>
            )}
            {location && (
              <div>
                <dt className="text-sm text-muted">Konum</dt>
                <dd className="mt-0.5 text-ink">{location}</dd>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div>
                <dt className="text-sm text-muted">Profiller</dt>
                <dd className="mt-0.5 flex flex-wrap gap-x-5 gap-y-1">
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="text-link"
                    >
                      {getSocialMeta(social.platform).label}
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {state === "success" ? (
          <div role="status" className="self-start rounded-lg border border-border bg-surface p-8">
            <p className="text-lg font-semibold text-ink">Mesajınız iletildi. Teşekkürler.</p>
            <p className="mt-2 text-muted">Yanıtım, formda yazdığınız e-posta adresine gelecek.</p>
            <button type="button" onClick={() => setState("idle")} className="btn btn-secondary btn-sm mt-6">
              Yeni mesaj yaz
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                  Adınız
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
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
                  inputMode="email"
                  autoComplete="email"
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
                required
                rows={6}
                maxLength={5000}
                className={`${inputClass} resize-y`}
              />
            </div>

            {/* Bot tuzağı (honeypot): insanlar görmez/doldurmaz, botlar doldurur. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Web siteniz</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={state === "loading"} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-55">
                {state === "loading" ? "Gönderiliyor…" : "Mesajı gönder"}
              </button>
              {state === "error" && (
                <p className="text-sm text-red-400 light:text-red-700" role="alert">
                  Mesaj gönderilemedi. Tekrar deneyin ya da doğrudan e-posta gönderin.
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}

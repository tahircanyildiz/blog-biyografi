"use client";

import { useState, type FormEvent } from "react";
import { ExternalLink, Link2, Mail, MapPin } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DecorativeLine } from "@/components/ui/DecorativeLine";

interface ContactProps {
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  location: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export function Contact({ email, githubUrl, linkedinUrl, location }: ContactProps) {
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
    <section id="contact" className="relative mx-auto max-w-5xl px-6 py-20">
      <DecorativeLine />

      <RevealOnScroll>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="İletişime Geçin" title="Birlikte Çalışalım" />

            <p className="mt-6 max-w-prose text-muted leading-relaxed">
              Yeni projeleri, yaratıcı fikirleri konuşmaya her zaman açığım.
              İletişime geçmekten çekinmeyin!
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm text-ink transition-colors hover:text-accent"
                >
                  <Mail size={18} className="text-muted" aria-hidden />
                  {email}
                </a>
              )}
              {location && (
                <div className="flex items-center gap-3 text-sm text-ink">
                  <MapPin size={18} className="text-muted" aria-hidden />
                  {location}
                </div>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-ink transition-colors hover:text-accent"
                >
                  <Link2 size={18} className="text-muted" aria-hidden />
                  GitHub
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-ink transition-colors hover:text-accent"
                >
                  <ExternalLink size={18} className="text-muted" aria-hidden />
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-ink">
                İsim
              </label>
              <input
                id="name"
                name="name"
                placeholder="İsim"
                required
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-ink placeholder:text-muted outline-none transition-colors focus-visible:border-border-hover"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-ink">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="E-posta"
                required
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-ink placeholder:text-muted outline-none transition-colors focus-visible:border-border-hover"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm text-ink">
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Mesaj"
                required
                rows={5}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-ink placeholder:text-muted outline-none transition-colors focus-visible:border-border-hover"
              />
            </div>

            <button
              type="submit"
              disabled={state === "loading"}
              className="mt-2 w-full rounded-lg bg-ink px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {state === "loading" ? "Gönderiliyor..." : "Mesajı Gönder"}
            </button>

            {state === "success" && (
              <p className="text-sm text-accent" role="status">
                Mesajınız gönderildi, teşekkürler!
              </p>
            )}
            {state === "error" && (
              <p className="text-sm text-red-400" role="alert">
                Bir hata oluştu, lütfen tekrar deneyin.
              </p>
            )}
          </form>
        </div>
      </RevealOnScroll>
    </section>
  );
}

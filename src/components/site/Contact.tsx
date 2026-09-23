"use client";

import { useState, type FormEvent } from "react";
import { ExternalLink, Link2, Mail, MapPin } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

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
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <RevealOnScroll>
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          İletişim
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
                Ad
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink outline-none transition-colors focus-visible:border-accent"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink outline-none transition-colors focus-visible:border-accent"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
                Mesaj
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink outline-none transition-colors focus-visible:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={state === "loading"}
              className="mt-2 w-fit rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {state === "loading" ? "Gönderiliyor..." : "Gönder"}
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

          <div className="flex flex-col gap-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
              >
                <Mail size={18} className="text-accent" aria-hidden />
                {email}
              </a>
            )}
            {location && (
              <div className="flex items-center gap-3 text-sm text-muted">
                <MapPin size={18} className="text-accent" aria-hidden />
                {location}
              </div>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
              >
                <Link2 size={18} className="text-accent" aria-hidden />
                GitHub
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
              >
                <ExternalLink size={18} className="text-accent" aria-hidden />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}

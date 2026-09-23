"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Mail, Trash2 } from "lucide-react";
import { TextField } from "@/components/admin/FormField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";

interface ContactSettingsForm {
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  footerNote: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const EMPTY_FORM: ContactSettingsForm = {
  location: "",
  email: "",
  githubUrl: "",
  linkedinUrl: "",
  footerNote: "",
};

export default function AdminContactPage() {
  const [form, setForm] = useState<ContactSettingsForm>(EMPTY_FORM);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    Promise.all([
      fetch("/api/content").then((res) => res.json()),
      fetch("/api/contact-messages").then((res) => res.json()),
    ])
      .then(([settings, msgs]) => {
        setForm({ ...EMPTY_FORM, ...settings });
        setMessages(msgs);
      })
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof ContactSettingsForm>(key: K, value: string) {
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

  async function markRead(id: string) {
    await fetch(`/api/contact-messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  }

  async function deleteMessage(id: string) {
    await fetch(`/api/contact-messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  if (loading) {
    return <p className="text-muted">Yükleniyor...</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight text-ink">
        Contact & Mesajlar
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex max-w-xl flex-col gap-4">
        <TextField label="Lokasyon" name="location" value={form.location} onChange={(v) => set("location", v)} />
        <TextField label="E-posta" name="email" value={form.email} onChange={(v) => set("email", v)} />
        <TextField label="GitHub URL" name="githubUrl" value={form.githubUrl} onChange={(v) => set("githubUrl", v)} />
        <TextField label="LinkedIn URL" name="linkedinUrl" value={form.linkedinUrl} onChange={(v) => set("linkedinUrl", v)} />
        <TextField label="Footer Notu" name="footerNote" value={form.footerNote} onChange={(v) => set("footerNote", v)} />
        <SaveBar status={status} />
      </form>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wide text-ink">
        Gelen Mesajlar
      </h2>

      {messages.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Henüz mesaj yok.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl border p-4 ${
                message.read ? "border-border bg-surface/50" : "border-accent/50 bg-surface"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-ink">
                    <Mail size={14} className="text-accent" aria-hidden />
                    {message.name}
                    <span className="text-xs font-normal text-muted">
                      {message.email}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{message.message}</p>
                  <time className="mt-2 block text-xs text-muted">
                    {new Date(message.createdAt).toLocaleString("tr-TR")}
                  </time>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  {!message.read && (
                    <button
                      type="button"
                      onClick={() => markRead(message.id)}
                      className="rounded-full border border-border px-3 py-1 text-xs text-ink hover:border-border-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      Okundu işaretle
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteMessage(message.id)}
                    aria-label="Sil"
                    className="rounded-md p-1.5 text-muted hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

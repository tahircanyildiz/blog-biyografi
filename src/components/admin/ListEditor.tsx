"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TextAreaField, TextField } from "@/components/admin/FormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export interface FieldConfig<T> {
  key: keyof T & string;
  label: string;
  type?: "text" | "textarea" | "image";
}

interface ListEditorProps<T extends { id: string; order: number }> {
  resource: string;
  itemLabel: string;
  fields: FieldConfig<T>[];
  titleField: keyof T & string;
  emptyItem: Omit<T, "id" | "order">;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function ListEditor<T extends { id: string; order: number }>({
  resource,
  itemLabel,
  fields,
  titleField,
  emptyItem,
}: ListEditorProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});
  const [newItem, setNewItem] = useState<Record<string, string>>(
    emptyItem as Record<string, string>
  );
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch(`/api/${resource}`)
      .then((res) => res.json())
      .then((data: T[]) => setItems(data))
      .finally(() => setLoading(false));
  }, [resource]);

  function updateItem(id: string, key: keyof T, value: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  }

  async function saveItem(item: T) {
    setSaveStates((prev) => ({ ...prev, [item.id]: "saving" }));
    try {
      const response = await fetch(`/api/${resource}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error();
      setSaveStates((prev) => ({ ...prev, [item.id]: "saved" }));
    } catch {
      setSaveStates((prev) => ({ ...prev, [item.id]: "error" }));
    }
  }

  async function deleteItem(id: string) {
    if (!confirm(`Bu ${itemLabel.toLowerCase()} kaydını silmek istediğinize emin misiniz?`)) {
      return;
    }
    await fetch(`/api/${resource}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function moveItem(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setItems(next);

    await fetch(`/api/${resource}/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((item) => item.id) }),
    });
  }

  async function createItem() {
    setCreating(true);
    try {
      const response = await fetch(`/api/${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error();
      const created: T = await response.json();
      setItems((prev) => [...prev, created]);
      setNewItem(emptyItem as Record<string, string>);
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return <p className="text-muted">Yükleniyor...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-ink">
              {String(item[titleField]) || `${itemLabel} #${index + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                aria-label="Yukarı taşı"
                className="rounded-md p-1.5 text-muted hover:text-ink disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <ChevronUp size={16} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Aşağı taşı"
                className="rounded-md p-1.5 text-muted hover:text-ink disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <ChevronDown size={16} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                aria-label="Sil"
                className="rounded-md p-1.5 text-muted hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <Trash2 size={16} aria-hidden />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => {
              if (field.type === "textarea") {
                return (
                  <div key={field.key} className="sm:col-span-2">
                    <TextAreaField
                      label={field.label}
                      name={`${item.id}-${field.key}`}
                      value={String(item[field.key] ?? "")}
                      onChange={(v) => updateItem(item.id, field.key, v)}
                    />
                  </div>
                );
              }
              if (field.type === "image") {
                return (
                  <div key={field.key} className="sm:col-span-2">
                    <ImageUploadField
                      label={field.label}
                      value={String(item[field.key] ?? "")}
                      onChange={(v) => updateItem(item.id, field.key, v)}
                    />
                  </div>
                );
              }
              return (
                <TextField
                  key={field.key}
                  label={field.label}
                  name={`${item.id}-${field.key}`}
                  value={String(item[field.key] ?? "")}
                  onChange={(v) => updateItem(item.id, field.key, v)}
                />
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => saveItem(item)}
              disabled={saveStates[item.id] === "saving"}
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {saveStates[item.id] === "saving" ? "Kaydediliyor..." : "Kaydet"}
            </button>
            {saveStates[item.id] === "saved" && (
              <span className="text-sm text-accent">Kaydedildi.</span>
            )}
            {saveStates[item.id] === "error" && (
              <span className="text-sm text-red-400">Hata oluştu.</span>
            )}
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-dashed border-border p-5">
        <span className="text-sm font-medium text-ink">Yeni {itemLabel} Ekle</span>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            if (field.type === "textarea") {
              return (
                <div key={field.key} className="sm:col-span-2">
                  <TextAreaField
                    label={field.label}
                    name={`new-${field.key}`}
                    value={String(newItem[field.key] ?? "")}
                    onChange={(v) =>
                      setNewItem((prev) => ({ ...prev, [field.key]: v }))
                    }
                  />
                </div>
              );
            }
            if (field.type === "image") {
              return (
                <div key={field.key} className="sm:col-span-2">
                  <ImageUploadField
                    label={field.label}
                    value={String(newItem[field.key] ?? "")}
                    onChange={(v) =>
                      setNewItem((prev) => ({ ...prev, [field.key]: v }))
                    }
                  />
                </div>
              );
            }
            return (
              <TextField
                key={field.key}
                label={field.label}
                name={`new-${field.key}`}
                value={String(newItem[field.key] ?? "")}
                onChange={(v) =>
                  setNewItem((prev) => ({ ...prev, [field.key]: v }))
                }
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={createItem}
          disabled={creating}
          className="mt-4 rounded-full border border-border px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-border-hover disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {creating ? "Ekleniyor..." : "Ekle"}
        </button>
      </div>
    </div>
  );
}

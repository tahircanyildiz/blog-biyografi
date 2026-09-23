"use client";

import { ListEditor, type FieldConfig } from "@/components/admin/ListEditor";

interface SocialLinkItem {
  id: string;
  order: number;
  platform: string;
  url: string;
}

const fields: FieldConfig<SocialLinkItem>[] = [
  { key: "platform", label: "Platform (örn. GitHub, LinkedIn, Instagram)" },
  { key: "url", label: "URL" },
];

const emptyItem: Omit<SocialLinkItem, "id" | "order"> = {
  platform: "",
  url: "",
};

export default function AdminSocialPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold tracking-tight text-ink">
        Sosyal Medya
      </h1>
      <p className="mt-1 text-sm text-muted">
        Buraya eklediğiniz linkler sitenin İletişim bölümünde ve footer&apos;da
        görünür.
      </p>
      <div className="mt-6">
        <ListEditor<SocialLinkItem>
          resource="social"
          itemLabel="Sosyal Medya Linki"
          fields={fields}
          titleField="platform"
          emptyItem={emptyItem}
        />
      </div>
    </div>
  );
}

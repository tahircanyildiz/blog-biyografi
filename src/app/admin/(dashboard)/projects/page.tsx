"use client";

import { ListEditor, type FieldConfig } from "@/components/admin/ListEditor";

interface ProjectItem {
  id: string;
  order: number;
  title: string;
  eyebrow1: string;
  eyebrow2: string;
  description: string;
  tags: string;
  mission: string;
  keyFeature: string;
  clientName: string;
  coverImage: string;
  liveUrl: string;
}

const fields: FieldConfig<ProjectItem>[] = [
  { key: "title", label: "Başlık" },
  { key: "eyebrow1", label: "Üst Etiket 1" },
  { key: "eyebrow2", label: "Üst Etiket 2" },
  { key: "description", label: "Açıklama", type: "textarea" },
  { key: "tags", label: "Etiketler (virgülle ayrılmış)" },
  { key: "mission", label: "Mission" },
  { key: "keyFeature", label: "Key Feature" },
  { key: "clientName", label: "Client" },
  { key: "coverImage", label: "Kapak Görseli", type: "image" },
  { key: "liveUrl", label: "Canlı Link" },
];

const emptyItem: Omit<ProjectItem, "id" | "order"> = {
  title: "",
  eyebrow1: "",
  eyebrow2: "",
  description: "",
  tags: "",
  mission: "",
  keyFeature: "",
  clientName: "",
  coverImage: "",
  liveUrl: "",
};

export default function AdminProjectsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight text-ink">Projects</h1>
      <div className="mt-6">
        <ListEditor<ProjectItem>
          resource="projects"
          itemLabel="Proje"
          fields={fields}
          titleField="title"
          emptyItem={emptyItem}
        />
      </div>
    </div>
  );
}

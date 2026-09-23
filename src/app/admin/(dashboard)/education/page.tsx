"use client";

import { ListEditor, type FieldConfig } from "@/components/admin/ListEditor";

interface EducationItem {
  id: string;
  order: number;
  icon: string;
  title: string;
  institution: string;
  period: string;
  type: string;
  bullets: string;
}

const fields: FieldConfig<EducationItem>[] = [
  { key: "icon", label: "İkon (graduation | award)" },
  { key: "title", label: "Başlık" },
  { key: "institution", label: "Kurum" },
  { key: "period", label: "Tarih Aralığı" },
  { key: "type", label: "Tip (Bachelor's / Certification vb.)" },
  { key: "bullets", label: "Madde Listesi (her satır bir madde)", type: "textarea" },
];

const emptyItem: Omit<EducationItem, "id" | "order"> = {
  icon: "graduation",
  title: "",
  institution: "",
  period: "",
  type: "",
  bullets: "",
};

export default function AdminEducationPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight text-ink">Education</h1>
      <div className="mt-6">
        <ListEditor<EducationItem>
          resource="education"
          itemLabel="Eğitim"
          fields={fields}
          titleField="title"
          emptyItem={emptyItem}
        />
      </div>
    </div>
  );
}

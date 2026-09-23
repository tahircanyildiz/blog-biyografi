"use client";

import { ListEditor, type FieldConfig } from "@/components/admin/ListEditor";

interface ExperienceItem {
  id: string;
  order: number;
  role: string;
  company: string;
  employment: string;
  startDate: string;
  endDate: string;
  description: string;
  tags: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
}

const fields: FieldConfig<ExperienceItem>[] = [
  { key: "role", label: "Rol" },
  { key: "company", label: "Şirket" },
  { key: "employment", label: "Çalışma Şekli" },
  { key: "startDate", label: "Başlangıç Tarihi" },
  { key: "endDate", label: "Bitiş Tarihi" },
  { key: "description", label: "Açıklama", type: "textarea" },
  { key: "tags", label: "Etiketler (virgülle ayrılmış)" },
  { key: "stat1Label", label: "Stat 1 Etiket" },
  { key: "stat1Value", label: "Stat 1 Değer" },
  { key: "stat2Label", label: "Stat 2 Etiket" },
  { key: "stat2Value", label: "Stat 2 Değer" },
  { key: "stat3Label", label: "Stat 3 Etiket" },
  { key: "stat3Value", label: "Stat 3 Değer" },
];

const emptyItem: Omit<ExperienceItem, "id" | "order"> = {
  role: "",
  company: "",
  employment: "",
  startDate: "",
  endDate: "",
  description: "",
  tags: "",
  stat1Label: "",
  stat1Value: "",
  stat2Label: "",
  stat2Value: "",
  stat3Label: "",
  stat3Value: "",
};

export default function AdminExperiencePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight text-ink">Experience</h1>
      <div className="mt-6">
        <ListEditor<ExperienceItem>
          resource="experience"
          itemLabel="Deneyim"
          fields={fields}
          titleField="role"
          emptyItem={emptyItem}
        />
      </div>
    </div>
  );
}

"use client";

import { ListEditor, type FieldConfig } from "@/components/admin/ListEditor";

interface SkillGroupItem {
  id: string;
  order: number;
  category: string;
  subcategory: string;
  items: string;
}

const fields: FieldConfig<SkillGroupItem>[] = [
  { key: "category", label: "Kategori (örn. Core Languages)" },
  { key: "subcategory", label: "Alt Kategori" },
  { key: "items", label: "Öğeler (virgülle ayrılmış)", type: "textarea" },
];

const emptyItem: Omit<SkillGroupItem, "id" | "order"> = {
  category: "",
  subcategory: "",
  items: "",
};

export default function AdminSkillsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold tracking-tight text-ink">Skills</h1>
      <div className="mt-6">
        <ListEditor<SkillGroupItem>
          resource="skills"
          itemLabel="Yetenek Grubu"
          fields={fields}
          titleField="category"
          emptyItem={emptyItem}
        />
      </div>
    </div>
  );
}

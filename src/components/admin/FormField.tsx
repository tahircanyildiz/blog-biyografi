import type { ChangeEvent } from "react";

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export function TextField({ label, name, value, onChange, placeholder, type = "text" }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink outline-none transition-colors focus-visible:border-accent"
      />
    </div>
  );
}

interface TextAreaFieldProps extends FieldProps {
  rows?: number;
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-muted">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink outline-none transition-colors focus-visible:border-accent"
      />
    </div>
  );
}

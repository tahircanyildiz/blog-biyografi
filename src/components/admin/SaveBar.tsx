export type SaveStatus = "idle" | "saving" | "success" | "error";

interface SaveBarProps {
  status: SaveStatus;
  errorMessage?: string;
  label?: string;
}

export function SaveBar({ status, errorMessage, label = "Kaydet" }: SaveBarProps) {
  return (
    <div className="mt-6 flex items-center gap-4">
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        {status === "saving" ? "Kaydediliyor..." : label}
      </button>

      {status === "success" && (
        <span className="text-sm text-accent" role="status">
          Kaydedildi.
        </span>
      )}
      {status === "error" && (
        <span className="text-sm text-red-400" role="alert">
          {errorMessage ?? "Bir hata oluştu."}
        </span>
      )}
    </div>
  );
}

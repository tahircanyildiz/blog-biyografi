import { CopyLinkButton } from "./CopyLinkButton";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const linkClass =
  "inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-ink-2 transition-colors hover:border-accent-ink/60 hover:text-accent-ink";

/** Harici script yüklemeden paylaşım bağlantıları (performans + gizlilik). */
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-ink">Bu yazıyı paylaş</span>
      <div className="flex items-center gap-2">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn'de paylaş"
          className={linkClass}
        >
          <SocialIcon platform="linkedin" size={16} />
        </a>
        <a
          href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X'te paylaş"
          className={linkClass}
        >
          <SocialIcon platform="x" size={15} />
        </a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp'ta paylaş"
          className={linkClass}
        >
          <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </a>
        <CopyLinkButton url={url} title={title} className={linkClass} />
      </div>
    </div>
  );
}

import { getSocialIcon } from "@/lib/social";

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
}

interface FooterProps {
  firstName: string;
  lastName: string;
  footerNote: string;
  socialLinks?: SocialLinkItem[];
}

export function Footer({
  firstName,
  lastName,
  footerNote,
  socialLinks = [],
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <span>
          © {year} {firstName} {lastName}
        </span>

        {socialLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = getSocialIcon(social.platform);
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="text-muted transition-colors hover:text-ink"
                >
                  <Icon size={16} aria-hidden />
                </a>
              );
            })}
          </div>
        )}

        {footerNote && <span>{footerNote}</span>}
      </div>
    </footer>
  );
}

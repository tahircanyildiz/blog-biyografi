interface FooterProps {
  firstName: string;
  lastName: string;
  footerNote: string;
}

export function Footer({ firstName, lastName, footerNote }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <span>
          © {year} {firstName} {lastName}
        </span>
        {footerNote && <span>{footerNote}</span>}
      </div>
    </footer>
  );
}

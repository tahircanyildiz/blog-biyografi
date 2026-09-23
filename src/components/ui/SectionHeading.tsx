interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

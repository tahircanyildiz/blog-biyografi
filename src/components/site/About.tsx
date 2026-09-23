import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface AboutProps {
  bio: string;
}

export function About({ bio }: AboutProps) {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <RevealOnScroll>
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Hakkımda
        </h2>
        <p className="mt-6 max-w-prose text-muted leading-relaxed">{bio}</p>
      </RevealOnScroll>
    </section>
  );
}

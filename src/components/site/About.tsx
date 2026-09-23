import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface AboutProps {
  bio: string;
}

export function About({ bio }: AboutProps) {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <RevealOnScroll>
        <SectionHeading eyebrow="Tanışalım" title="Hakkımda" />
        <p className="mt-8 max-w-prose text-muted leading-relaxed">{bio}</p>
      </RevealOnScroll>
    </section>
  );
}

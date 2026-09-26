import { approach } from "@/lib/content";
import { Rise, ScrollInk } from "@/components/ui/Reveal";

export function Philosophy() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="scroll-mt-10 px-5 py-32 md:px-10 md:py-56 lg:px-16">
      <p className="label mb-10 text-ink-2 md:mb-16">Our approach</p>
      <Rise>
        <h2 id="approach-title" className="display text-[clamp(3.2rem,10.5vw,11rem)]">
          <span className="block text-ink-3">Simple outside.</span>
          <span className="block">Serious inside.</span>
        </h2>
      </Rise>

      <div className="mt-32 grid gap-12 md:mt-56 md:grid-cols-12">
        <p className="label text-ink-2 md:col-span-3">How we work</p>
        <div className="space-y-2 md:col-span-9 md:space-y-3">
          {approach.map((line) => (
            <ScrollInk key={line} className="text-[clamp(1.9rem,4.4vw,4.4rem)] font-medium leading-[1.08] tracking-[-0.04em]">
              {line}
            </ScrollInk>
          ))}
        </div>
      </div>

      <Rise className="mt-40 md:mt-64">
        <p className="display text-[clamp(3.2rem,10.5vw,11rem)]">
          Until it feels right<span className="text-violet">.</span>
        </p>
      </Rise>
    </section>
  );
}

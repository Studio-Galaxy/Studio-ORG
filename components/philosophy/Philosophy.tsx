import { Rise } from "@/components/ui/Reveal";
import { HowWeWork } from "./HowWeWork";

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

      <div className="mt-24 md:mt-40">
        <HowWeWork />
      </div>

      <Rise className="mt-16 md:mt-24">
        <p className="display text-[clamp(3.2rem,10.5vw,11rem)]">
          Until it feels right<span className="text-violet">.</span>
        </p>
      </Rise>
    </section>
  );
}

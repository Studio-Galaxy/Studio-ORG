import { site } from "@/lib/content";
import { Pill } from "@/components/ui/Pill";
import { Rise } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";

export function FinalStatement() {
  return (
    <section aria-label="Our promise" className="px-5 pb-24 pt-40 md:px-10 md:pb-40 md:pt-64 lg:px-16">
      <Rise>
        <h2 className="display text-[clamp(2.9rem,8.6vw,9rem)]">
          Your idea shouldn&apos;t look like everyone else&apos;s.
        </h2>
      </Rise>
      <Rise delay={0.15}>
        <p className="mt-10 text-[clamp(1.5rem,3vw,2.8rem)] font-medium tracking-[-0.035em] text-ink-2 md:mt-14">We&apos;ll help you make it real.</p>
      </Rise>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-10 px-5 pb-24 pt-24 md:px-10 md:pb-40 md:pt-40 lg:px-16">
      <div className="rounded-[32px] bg-paper px-6 py-16 ring-1 ring-line md:rounded-[48px] md:px-16 md:py-28 lg:px-24">
        <Rise>
          <h2 id="contact-title" className="display text-[clamp(3.4rem,11vw,11.5rem)]">
            Have an idea?
          </h2>
          <p className="display text-[clamp(3.4rem,11vw,11.5rem)] text-violet">Let&apos;s build it.</p>
        </Rise>

        <div className="mt-14 flex flex-col gap-8 md:mt-20 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-[clamp(1.15rem,1.6vw,1.45rem)] leading-snug tracking-[-0.02em] text-ink-2">
            Tell us what you&apos;re imagining.
            <br />
            We&apos;ll figure out the rest.
          </p>
          <Pill href="#form">Start a conversation</Pill>
        </div>

        <div className="mt-24 grid gap-12 border-t border-line pt-14 md:mt-32 md:grid-cols-12 md:pt-20">
          <div className="md:col-span-4">
            <p className="label text-ink-2">Or write to us</p>
            <a href={`mailto:${site.email}`} className="link-line mt-4 inline-block text-[clamp(1.2rem,1.8vw,1.6rem)] font-medium tracking-[-0.02em]">
              {site.email}
            </a>
          </div>
          <div className="md:col-span-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

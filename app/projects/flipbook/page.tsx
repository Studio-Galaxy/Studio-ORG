import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/footer/Footer";
import { Rise } from "@/components/ui/Reveal";
import { Pill } from "@/components/ui/Pill";
import { BrochureReader } from "@/components/flipbook/BrochureReader";

export const metadata: Metadata = {
  title: "Flipbook — Studio Galaxy",
  description: "Our studio brochure as a living flipbook: realistic page curl, two-page spreads, zoom and gestures — built with the Studio Galaxy Flipbook SDK.",
  alternates: { canonical: "/projects/flipbook" },
};

// Facts from the SDK's own README.
const FEATURES = [
  ["Real page curl", "Pages bend under your finger or cursor, with soft paper shadows."],
  ["Two-page spreads", "A real book on wide screens, one page on phones — it switches as you resize."],
  ["Zoom", "Pinch, double-tap or trackpad zoom up to 4×, with crisp re-rendering."],
  ["Natural gestures", "Drag, flick, lift a corner. Quick flicks turn page after page."],
  ["Page-turn sound", "A soft paper sound when a page lands — optional."],
  ["Any PDF, any app", "Works from a URL or a file, in React, Next.js or plain web pages."],
];
const USES = ["Brochures", "Catalogues", "Magazines", "Menus", "Reports", "Lookbooks"];

export default function Flipbook() {
  return (
    <>
      <Nav />
      <main>
        <section id="top" className="px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48 lg:px-16">
          <p className="label mb-8 text-ink-2">Projects · Flipbook</p>
          <h1 className="display text-[clamp(3.1rem,10vw,10.5rem)]">
            Turn the page<span className="text-violet">.</span>
          </h1>
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-[clamp(1.15rem,1.6vw,1.45rem)] leading-snug tracking-[-0.02em] text-ink-2">
              Our studio brochure, as a living book. Drag a corner, flick through, zoom in — the room changes with every chapter.
            </p>
            <a href="#book" className="group flex shrink-0 items-center gap-2 text-[17px] font-medium">
              <span className="link-line">Open the book</span>
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-y-1">↓</span>
            </a>
          </div>
        </section>

        <BrochureReader />

        <section aria-labelledby="sdk-title" className="px-5 py-24 md:px-10 md:py-40 lg:px-16">
          <div className="grid gap-8 md:grid-cols-12">
            <p className="label text-ink-2 md:col-span-3">The project</p>
            <Rise className="md:col-span-9">
              <h2 id="sdk-title" className="display text-[clamp(2.6rem,6.4vw,6.6rem)]">
                Made with our
                <br />
                <span className="text-ink-3">Flipbook SDK.</span>
              </h2>
            </Rise>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-line ring-1 ring-line md:mt-24 md:grid-cols-3">
            {FEATURES.map(([title, text], i) => (
              <div key={title} className="bg-cream p-7 md:p-9">
                <p className="font-mono text-[11px] text-violet">{`0${i + 1}`}</p>
                <p className="mt-4 text-[22px] font-semibold tracking-[-0.03em]">{title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-10 md:mt-24 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label text-ink-2">Perfect for</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {USES.map((u) => (
                  <li key={u} className="rounded-full bg-cream-2 px-4 py-2 text-[15px]">{u}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <p className="display text-[clamp(1.8rem,3vw,2.8rem)]">Want one for your brand?</p>
              <Pill href="/#contact">Let’s build it</Pill>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { capabilities } from "@/lib/content";
import { Rise } from "@/components/ui/Reveal";

export function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="cap-title" className="scroll-mt-10 px-5 py-24 md:px-10 md:py-40 lg:px-16">
      <div className="mb-16 grid gap-8 md:mb-28 md:grid-cols-12">
        <p className="label text-ink-2 md:col-span-3">Capabilities</p>
        <Rise className="md:col-span-9">
          <h2 id="cap-title" className="display text-[clamp(2.8rem,7vw,7.2rem)]">Everything an idea needs.</h2>
        </Rise>
      </div>

      <div className="border-b border-line">
        {capabilities.map((c, i) => (
          <Rise key={c.group}>
            <div className="group grid gap-6 border-t border-line py-8 md:grid-cols-12 md:py-12">
              <div className="flex items-baseline gap-5 md:col-span-5">
                <span className="font-mono text-[12px] text-ink-3 transition-colors duration-500 group-hover:text-violet">{`0${i + 1}`}</span>
                <h3 className="text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-none tracking-[-0.045em]">{c.group}</h3>
              </div>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:col-span-7 md:pt-2">
                {c.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[clamp(1.05rem,1.7vw,1.6rem)] tracking-[-0.02em] text-ink-2 transition-colors duration-300 hover:text-ink">
                    <span className="size-1 shrink-0 rounded-full bg-ink/30 transition-all duration-500 group-hover:bg-violet" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Rise>
        ))}
      </div>
    </section>
  );
}

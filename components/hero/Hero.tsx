import { Orb } from "./Orb";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-x-clip px-5 pb-8 pt-32 md:px-10 md:pb-10 lg:px-16">
      <Orb className="absolute right-[18%] top-[22%] md:right-[16%] md:top-[26%]" />

      <div className="my-auto max-w-[1400px]">
        <p className="label anim-fade mb-8 text-ink-2 md:mb-10" style={{ animationDelay: "0.5s" }}>
          Studio Galaxy — Development Studio
        </p>
        <h1 className="display text-[clamp(3.1rem,11.2vw,11.5rem)]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="anim-rise block">We build things</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="anim-rise block" style={{ animationDelay: "0.12s" }}>
              worth{" "}
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="anim-sweep absolute inset-x-[-0.04em] bottom-[0.06em] top-[0.46em] -z-10 rounded-[0.08em] bg-lavender"
                  style={{ animationDelay: "0.75s" }}
                />
                experiencing.
              </span>
            </span>
          </span>
        </h1>
      </div>

      <div className="anim-fade mt-16 flex items-end justify-between gap-6 border-t border-line pt-5" style={{ animationDelay: "0.9s" }}>
        <p className="max-w-[18rem] text-[15px] leading-snug text-ink-2 md:max-w-none md:text-[17px]">
          Digital products, experiences &amp; intelligent systems.
        </p>
        <a href="#idea" className="group flex shrink-0 items-center gap-2 text-[15px] font-medium md:text-[17px]">
          <span className="link-line">Explore</span>
          <span aria-hidden className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-y-1">↓</span>
        </a>
      </div>
    </section>
  );
}

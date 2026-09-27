"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { capabilities } from "@/lib/content";
import { Rise } from "@/components/ui/Reveal";
import { SPECIMENS } from "./Specimens";

const ease = [0.16, 1, 0.3, 1] as const;

// A drawer of specimens: open a discipline to see each capability working.
export function Capabilities() {
  const [open, setOpen] = useState(0);

  return (
    <section id="capabilities" aria-labelledby="cap-title" className="scroll-mt-10 px-5 py-24 md:px-10 md:py-40 lg:px-16">
      <div className="mb-16 grid gap-8 md:mb-28 md:grid-cols-12">
        <p className="label text-ink-2 md:col-span-3">Capabilities</p>
        <Rise className="md:col-span-9">
          <h2 id="cap-title" className="display text-[clamp(2.8rem,7vw,7.2rem)]">Everything an idea needs.</h2>
        </Rise>
      </div>

      <div className="border-b border-line">
        {capabilities.map((c, i) => {
          const active = open === i;
          return (
            <div key={c.group} className="border-t border-line">
              <h3>
                <button
                  type="button"
                  aria-expanded={active}
                  aria-controls={`cap-${i}`}
                  onClick={() => setOpen(active ? -1 : i)}
                  className="group grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-5 py-7 text-left md:grid-cols-12 md:gap-8 md:py-10"
                >
                  <span className={`font-mono text-[12px] transition-colors duration-500 md:col-span-1 ${active ? "text-violet" : "text-ink-3 group-hover:text-violet"}`}>
                    {`0${i + 1}`}
                  </span>
                  <span
                    className={`text-[clamp(2rem,5vw,4.6rem)] font-semibold leading-none tracking-[-0.045em] transition-[color,transform] duration-500 ease-out-expo md:col-span-5 ${
                      active ? "text-ink" : "text-ink/35 group-hover:translate-x-2 group-hover:text-ink"
                    }`}
                  >
                    {c.group}
                  </span>
                  <span className="hidden text-[15px] text-ink-2 transition-opacity duration-500 md:col-span-5 md:block" style={{ opacity: active ? 0 : 1 }}>
                    {c.items.join(" · ")}
                  </span>
                  <span
                    aria-hidden
                    className={`flex size-10 items-center justify-center justify-self-end rounded-full border transition-all duration-500 ease-out-expo md:col-span-1 ${
                      active ? "rotate-45 border-ink bg-ink text-cream" : "border-line text-ink group-hover:border-ink"
                    }`}
                  >
                    +
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {active && (
                  <motion.div
                    id={`cap-${i}`}
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.7, ease }}
                    className="overflow-hidden"
                  >
                    <ul className="grid grid-cols-2 gap-3 pb-10 md:grid-cols-4 md:gap-4 md:pb-14">
                      {c.items.map((item, k) => {
                        const Specimen = SPECIMENS[item];
                        return (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.08 + k * 0.07, ease }}
                            className="@container group/card relative flex aspect-[4/3.6] flex-col overflow-hidden rounded-[20px] bg-paper ring-1 ring-line transition-shadow duration-500 hover:shadow-[0_20px_40px_-24px_rgb(36_34_32/0.35)] md:rounded-[24px]"
                          >
                            <div aria-hidden className="min-h-0 flex-1">
                              <Specimen />
                            </div>
                            <p className="flex items-center justify-between border-t border-line px-4 py-3 text-[13px] font-medium tracking-[-0.01em] md:text-[14px]">
                              {item}
                              <span className="font-mono text-[10px] font-normal text-ink-3">{`${i + 1}.${k + 1}`}</span>
                            </p>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

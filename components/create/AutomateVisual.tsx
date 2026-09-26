"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Panel } from "@/components/ui/Panel";

const STEPS = ["Request comes in", "Understand what's needed", "Draft the work", "Check against the rules", "Done — and filed"];

// A task handling itself, on a loop, while nobody watches.
export function AutomateVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  const run = Math.floor(tick / (STEPS.length + 1)) + 1;
  const active = reduce ? STEPS.length : tick % (STEPS.length + 1);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 1150);
    return () => clearInterval(id);
  }, [inView, reduce]);

  return (
    <Panel ref={ref} aria-hidden className="bg-lilac">
      <div className="absolute inset-0 flex items-center justify-center p-[6cqw]">
        <div className="w-full max-w-[64cqw]">
          <div className="mb-[3cqw] flex items-center justify-between font-mono text-[1.6cqw] uppercase tracking-[0.12em] text-ink-2">
            <span>Workflow</span>
            <AnimatePresence mode="popLayout">
              <motion.span key={run} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                Run #{String(run).padStart(3, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
          <ol className="relative space-y-[1.4cqw]">
            <span className="absolute bottom-[3cqw] left-[3.9cqw] top-[3cqw] w-px bg-ink/15" />
            {STEPS.map((s, i) => {
              const done = i < active;
              const now = i === active;
              return (
                <motion.li
                  key={s}
                  animate={{ opacity: done || now ? 1 : 0.45, x: now ? "1.2cqw" : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex items-center gap-[2.4cqw] rounded-[2.2cqw] px-[2.4cqw] py-[1.8cqw] text-[2.1cqw] font-medium tracking-[-0.01em] ${now ? "bg-white shadow-[0_1.6cqw_4cqw_-1.6cqw_rgb(116_71_255/0.45)]" : "bg-white/55"}`}
                >
                  <span className={`relative flex size-[3cqw] shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${done ? "bg-violet" : now ? "bg-ink" : "border border-ink/20 bg-white"}`}>
                    {done && (
                      <svg viewBox="0 0 12 12" className="w-[55%]">
                        <path d="M2.5 6.2 5 8.5 9.5 3.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {now && <span className="absolute inset-0 animate-ping rounded-full bg-ink/40" />}
                  </span>
                  {s}
                  {i === 1 && <span className="ml-auto rounded-full bg-lilac px-[1.2cqw] py-[0.3cqw] font-mono text-[1.4cqw] text-violet">agent</span>}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </Panel>
  );
}

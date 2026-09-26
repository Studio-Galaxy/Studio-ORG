"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { idea } from "@/lib/content";
import { plateaus, peak } from "@/lib/scroll";

// Pinned chapter: one line at a time, while a small shape guesses what the idea could be.
export function IdeaStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = plateaus(idea.length, 0.55);
  const stage = useTransform(scrollYProgress, p.input, p.output);

  // point → app → website → unknown → point
  const w = useTransform(stage, [0, 1, 2, 3, 4], [14, 58, 150, 104, 14]);
  const h = useTransform(stage, [0, 1, 2, 3, 4], [14, 104, 96, 104, 14]);
  const r = useTransform(stage, [0, 1, 2, 3, 4], [7, 16, 12, 52, 7]);
  const fill = useTransform(stage, [0, 0.6, 3.4, 4], [1, 0, 0, 1]);
  const dashed = useTransform(stage, [2.4, 3, 3.6], [0, 1, 0]);
  const glow = useTransform(stage, [3.4, 4], [0, 1]);

  return (
    <section id="idea" ref={ref} aria-label="The idea" className="relative h-[520vh]">
      <h2 className="sr-only">{idea.join(" ")}</h2>
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5">
        <div aria-hidden className="relative mb-12 flex h-28 items-center justify-center md:mb-16">
          <motion.div style={{ width: w, height: h, borderRadius: r }} className="relative border-[1.5px] border-ink">
            <motion.div style={{ opacity: fill, borderRadius: r }} className="absolute -inset-px bg-ink" />
            <motion.div style={{ opacity: dashed, borderRadius: r }} className="absolute -inset-[7px] border-[1.5px] border-dashed border-violet" />
            <motion.div
              style={{ opacity: glow, borderRadius: r }}
              className="absolute -inset-px bg-violet shadow-[0_0_30px_8px_rgb(116_71_255/0.45)]"
            />
          </motion.div>
        </div>

        <div className="relative h-[3.2em] w-full max-w-[1200px] text-center text-[clamp(2.4rem,7.6vw,7.4rem)]">
          {idea.map((line, i) => (
            <Line key={line} stage={stage} i={i} last={i === idea.length - 1}>
              {line}
            </Line>
          ))}
        </div>
      </div>
    </section>
  );
}

function Line({ stage, i, last, children }: { stage: MotionValue<number>; i: number; last: boolean; children: string }) {
  const reduce = useReducedMotion();
  const d = reduce ? 0 : 1;
  const o = peak(i, last, 0.5);
  const opacity = useTransform(stage, o.input, o.output);
  const y = useTransform(stage, [i - 0.5, i, i + 0.5], [50 * d, 0, -50 * d]);
  const blur = useTransform(stage, [i - 0.5, i, i + 0.5], [10 * d, 0, last ? 0 : 10 * d]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.p
      aria-hidden
      style={{ opacity, y, filter }}
      className="display absolute inset-0 flex items-center justify-center"
    >
      {children}
    </motion.p>
  );
}

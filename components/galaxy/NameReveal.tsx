"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { js } from "@/lib/scroll";

// Pinned reveal: a point → a horizon → the name rises out of it → the horizon
// pulls back into the full stop. The idea's point becomes the brand's period.
const NAME = [..."Studio Galaxy"];

export function NameReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const dot = useTransform(p, js([0.02, 0.1, 0.16, 0.2], [0, 1, 1, 0]));
  const grow = useTransform(p, js([0.12, 0.3], [0, 1]));
  const growOpacity = useTransform(p, js([0.12, 0.14, 0.66, 0.67], [0, 1, 1, 0]));
  const retract = useTransform(p, js([0.66, 0.84], [1, 0]));
  const retractOpacity = useTransform(p, js([0.655, 0.665, 0.83, 0.85], [0, 1, 1, 0]));
  const period = useTransform(p, js([0.8, 0.88], [0, 1]));
  const spacing = useTransform(p, js([0.3, 0.8], ["0.02em", "-0.055em"]));
  const tag = useTransform(p, js([0.86, 0.95], [0, 1]));
  const tagY = useTransform(p, js([0.86, 0.95], [16, 0]));

  return (
    <section aria-labelledby="studio-name" className="relative">
      <div ref={ref} className="relative h-[240vh] md:h-[280vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-4">
          <h2 id="studio-name" className="sr-only">
            Studio Galaxy. An idea can become an entire universe.
          </h2>

          <motion.p
            aria-hidden
            style={{ letterSpacing: spacing }}
            className="display relative flex items-end whitespace-nowrap text-[clamp(2.8rem,12.5vw,15rem)] leading-[0.9]"
          >
            <span className="relative">
              <span className="flex overflow-hidden pb-[0.14em]">
                {NAME.map((ch, i) => (
                  <Letter key={i} p={p} i={i}>
                    {ch}
                  </Letter>
                ))}
              </span>
              {/* the horizon sits exactly on the edge the letters rise from */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[max(2px,0.012em)]">
                <motion.span style={{ opacity: dot, scale: dot }} className="absolute left-1/2 top-1/2 size-[0.09em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet shadow-[0_0_24px_6px_rgb(116_71_255/0.35)]" />
                <motion.span style={{ scaleX: grow, opacity: growOpacity }} className="absolute inset-0 origin-center rounded-full bg-violet" />
                <motion.span style={{ scaleX: retract, opacity: retractOpacity }} className="absolute inset-0 origin-right rounded-full bg-violet" />
              </span>
            </span>
            <motion.span style={{ scale: period }} className="mb-[0.14em] inline-block origin-bottom-left text-violet">
              .
            </motion.span>
          </motion.p>

          <motion.p style={{ opacity: tag, y: tagY }} className="label mt-8 text-ink-2 md:mt-10">
            An idea can become an entire universe.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function Letter({ p, i, children }: { p: MotionValue<number>; i: number; children: string }) {
  const s = 0.28 + (i / NAME.length) * 0.34;
  const y = useTransform(p, js([s, s + 0.12], ["110%", "0%"]));
  return (
    <motion.span style={{ y }} className="inline-block">
      {children === " " ? " " : children}
    </motion.span>
  );
}

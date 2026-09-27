"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { possibilities } from "@/lib/content";
import { peak, plateaus } from "@/lib/scroll";
import { ExperimentScreen, FlowScreen, PhoneScreen } from "./Screens";
import { WebScreen } from "./WebScreen";

// Frame size per stage: [w, h, radius]. Stage 0 is the question alone.
const DESKTOP = { box: [760, 580], sizes: [[270, 560, 46], [270, 560, 46], [740, 480, 20], [700, 460, 30], [500, 500, 250]] };
const MOBILE = { box: [340, 500], sizes: [[250, 500, 42], [250, 500, 42], [340, 440, 18], [340, 440, 24], [320, 320, 160]] };
const BG = ["#141217", "#141217", "#fbf7f1", "#141217", "#1b1428"];
const screens: ReactNode[] = [<PhoneScreen key="p" />, <WebScreen key="w" />, <FlowScreen key="f" />, <ExperimentScreen key="e" />];

export function Possibilities() {
  const ref = useRef<HTMLElement>(null);
  const stageBox = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = plateaus(5, 0.5);
  const stage = useTransform(scrollYProgress, p.input, p.output);
  const [mobile, setMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const cfg = mobile ? MOBILE : DESKTOP;

  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    const onMq = () => setMobile(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    const el = stageBox.current!;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / cfg.box[0], el.clientHeight / cfg.box[1])));
    ro.observe(el);
    return () => ro.disconnect();
  }, [cfg]);

  const ks = [0, 1, 2, 3, 4];
  const w = useTransform(stage, ks, cfg.sizes.map((s) => s[0]));
  const h = useTransform(stage, ks, cfg.sizes.map((s) => s[1]));
  const r = useTransform(stage, ks, cfg.sizes.map((s) => s[2]));
  const bg = useTransform(stage, ks, BG);
  const frameIn = useTransform(stage, [0.3, 1], [0, 1]);
  const frameY = useTransform(stage, [0.3, 1], [120, 0]);
  const qOpacity = useTransform(stage, [0, 0.6], [1, 0]);
  const qScale = useTransform(stage, [0, 0.6], [1, 0.92]);
  const smallQ = useTransform(stage, [0.5, 1], [0, 1]);

  return (
    <section ref={ref} aria-labelledby="poss-title" className="relative h-[560vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-5 pb-8 pt-24 md:px-10 lg:px-16">
        <motion.p style={{ opacity: smallQ }} aria-hidden className="label text-ink-2">
          What could we build?
        </motion.p>

        <motion.h2
          id="poss-title"
          style={{ opacity: qOpacity, scale: qScale }}
          className="display pointer-events-none absolute inset-0 flex items-center justify-center px-5 text-center text-[clamp(3rem,10vw,10rem)]"
        >
          What could we build?
        </motion.h2>

        <div className="grid flex-1 grid-rows-[1fr_auto] gap-6 md:grid-cols-[5fr_7fr] md:grid-rows-1 md:items-center md:gap-10">
          <div className="relative order-2 h-[7.5rem] md:order-1 md:h-[14rem]">
            {possibilities.map((line, i) => (
              <Caption key={line} stage={stage} i={i + 1}>
                {line}
              </Caption>
            ))}
          </div>

          <div ref={stageBox} className="relative order-1 min-h-0 md:order-2 md:h-full md:max-h-[600px]">
            <motion.div
              style={{ opacity: frameIn, y: frameY, scale }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                style={{ width: w, height: h, borderRadius: r, backgroundColor: bg }}
                className="@container relative overflow-hidden shadow-[0_40px_80px_-40px_rgb(36_34_32/0.55),0_0_0_1px_rgb(36_34_32/0.08)]"
              >
                {screens.map((s, i) => (
                  <Layer key={i} stage={stage} i={i + 1}>
                    {s}
                  </Layer>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Caption({ stage, i, children }: { stage: MotionValue<number>; i: number; children: string }) {
  const o = peak(i, i === 4, 0.5);
  const opacity = useTransform(stage, o.input, o.output);
  const y = useTransform(stage, [i - 0.5, i, i + 0.5], [30, 0, -30]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-0">
      <p className="label mb-4 text-ink-2 md:mb-6">{`0${i} / 04`}</p>
      <p className="display text-[clamp(2.1rem,4.6vw,4.8rem)]">{children}</p>
    </motion.div>
  );
}

function Layer({ stage, i, children }: { stage: MotionValue<number>; i: number; children: ReactNode }) {
  const o = peak(i, i === 4, 0.45);
  const opacity = useTransform(stage, o.input, o.output);
  const visibility = useTransform(opacity, (v) => (v < 0.01 ? "hidden" : "visible"));
  return (
    <motion.div style={{ opacity, visibility }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

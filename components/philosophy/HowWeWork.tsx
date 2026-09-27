"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState, type ComponentType } from "react";
import { approach } from "@/lib/content";
import { js } from "@/lib/scroll";

// Pinned chapter: each line acts out its own verb as it becomes the active line.

type Fx = ComponentType<{ t: MotionValue<number>; word: string }>;
const N = approach.length;

export function HowWeWork() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const count = useTransform(scrollYProgress, (v) => `0${Math.min(N, Math.floor(v * N) + 1)}`);

  return (
    <div ref={ref} className="relative h-[520vh]">
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="grid w-full gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="label text-ink-2">How we work</p>
            <p className="label mt-3 text-ink-3" aria-hidden>
              <motion.span className="text-ink">{count}</motion.span> / 0{N}
            </p>
          </div>
          <div className="space-y-3 md:col-span-9 md:space-y-4">
            <p className="sr-only">{approach.map(([pre, word]) => `${pre} ${word}.`).join(" ")}</p>
            {approach.map(([pre, word], k) => (
              <Line key={word} p={scrollYProgress} k={k} pre={pre} word={word} Fx={FX[k]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Line({ p, k, pre, word, Fx }: { p: MotionValue<number>; k: number; pre: string; word: string; Fx: Fx }) {
  const start = k / N;
  const t = useTransform(p, js([start, start + 0.8 / N], [0, 1]));
  const opacity = useTransform(p, js([Math.max(0, start - 0.08), start + 0.04], [0.14, 1]));
  const dot = useTransform(p, js([start + 0.75 / N, start + 0.8 / N], ["#242220", k === N - 1 ? "#7447ff" : "#242220"]));
  return (
    <motion.p aria-hidden style={{ opacity }} className="text-[clamp(1.9rem,4.4vw,4.4rem)] font-medium leading-[1.12] tracking-[-0.04em]">
      {pre} <Fx t={t} word={word} />
      <motion.span style={{ color: dot }}>.</motion.span>
    </motion.p>
  );
}

// 01 — problem: tangled letters settle into place
function hash(i: number, s: number) {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function Tangle({ t, word }: { t: MotionValue<number>; word: string }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {[...word].map((ch, i) => (
        <TangleChar key={i} t={t} i={i} n={word.length} ch={ch} />
      ))}
    </span>
  );
}

function TangleChar({ t, i, n, ch }: { t: MotionValue<number>; i: number; n: number; ch: string }) {
  const s = (i / n) * 0.35;
  const e = useTransform(t, [s, s + 0.6], [0, 1]);
  const x = useTransform(e, (v) => `${(1 - v) * (hash(i, 1) - 0.5) * 1.2}em`);
  const y = useTransform(e, (v) => `${(1 - v) * (hash(i, 2) - 0.5) * 1.1}em`);
  const rotate = useTransform(e, (v) => (1 - v) * (hash(i, 3) - 0.5) * 90);
  const color = useTransform(e, [0, 1], ["#7447ff", "#242220"]);
  return (
    <motion.span style={{ x, y, rotate, color }} className="inline-block">
      {ch}
    </motion.span>
  );
}

// 02 — experience: a highlight follows someone's cursor through the word
function Sweep({ t, word }: { t: MotionValue<number>; word: string }) {
  const scaleX = useTransform(t, [0.1, 0.9], [0, 1]);
  const left = useTransform(scaleX, (v) => `${v * 100}%`);
  const cursor = useTransform(t, [0, 0.12, 0.9, 1], [0, 1, 1, 0]);
  return (
    <span className="relative isolate inline-block whitespace-nowrap">
      <motion.span style={{ scaleX }} className="absolute inset-x-[-0.05em] bottom-[0.08em] top-[0.5em] -z-10 origin-left rounded-[0.08em] bg-lavender" />
      {word}
      <motion.svg style={{ left, opacity: cursor }} viewBox="0 0 16 20" className="absolute bottom-[-0.35em] w-[0.32em] drop-shadow">
        <path d="M1 1 L15 11 L8.5 12 L5 19 Z" fill="#242220" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      </motion.svg>
    </span>
  );
}

// 03 — system: a design frame, handles and guides draw around the word
function Guides({ t, word }: { t: MotionValue<number>; word: string }) {
  const top = useTransform(t, [0.05, 0.23], [0, 1]);
  const right = useTransform(t, [0.2, 0.38], [0, 1]);
  const bottom = useTransform(t, [0.35, 0.53], [0, 1]);
  const left = useTransform(t, [0.5, 0.68], [0, 1]);
  const done = useTransform(t, [0.65, 0.8], [0, 1]);
  const guides = useTransform(t, [0.1, 0.5, 1], [0, 0.5, 0.35]);
  const line = "absolute bg-violet";
  return (
    <span className="relative inline-block whitespace-nowrap">
      <motion.span style={{ opacity: guides }} className="pointer-events-none absolute -left-[100vw] -right-[100vw] top-[0.26em] border-t border-dashed border-violet/60" />
      <motion.span style={{ opacity: guides }} className="pointer-events-none absolute -left-[100vw] -right-[100vw] bottom-[0.2em] border-t border-dashed border-violet/60" />
      <span className="pointer-events-none absolute -inset-x-[0.08em] bottom-[0.06em] top-[0.14em]">
        <motion.span style={{ scaleX: top }} className={`${line} inset-x-0 top-0 h-px origin-left`} />
        <motion.span style={{ scaleY: right }} className={`${line} inset-y-0 right-0 w-px origin-top`} />
        <motion.span style={{ scaleX: bottom }} className={`${line} inset-x-0 bottom-0 h-px origin-right`} />
        <motion.span style={{ scaleY: left }} className={`${line} inset-y-0 left-0 w-px origin-bottom`} />
        {["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] -bottom-[3px]", "-right-[3px] -bottom-[3px]"].map((c) => (
          <motion.span key={c} style={{ opacity: done, scale: done }} className={`absolute size-[7px] border border-violet bg-white ${c}`} />
        ))}
        <motion.span
          style={{ opacity: done }}
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-[4px] bg-violet px-1.5 py-0.5 font-mono text-[11px] tracking-normal text-white"
        >
          Frame · Auto layout
        </motion.span>
      </span>
      {word}
    </span>
  );
}

// 04 — technology: code resolves into the word, left to right
const GLYPHS = "01<>/{}[]#$%&*+=_;:";
function Decode({ t, word }: { t: MotionValue<number>; word: string }) {
  const [v, setV] = useState(0);
  useMotionValueEvent(t, "change", setV);
  const frame = Math.floor(v * 60);
  return (
    <span className="inline-block whitespace-nowrap">
      {[...word].map((ch, i) => {
        const locked = v >= 0.1 + (i / word.length) * 0.8;
        return locked ? (
          <span key={i}>{ch}</span>
        ) : (
          <span key={i} className="inline-block w-[0.56em] text-center font-mono font-normal text-violet">
            {GLYPHS[Math.floor(hash(i, frame) * GLYPHS.length)]}
          </span>
        );
      })}
    </span>
  );
}

// 05 — detail: spacing tightens under a loupe until it is right
function Kern({ t, word }: { t: MotionValue<number>; word: string }) {
  const letterSpacing = useTransform(t, [0.05, 0.85], ["0.32em", "-0.01em"]);
  const left = useTransform(t, [0.05, 0.85], ["0%", "100%"]);
  const loupe = useTransform(t, [0, 0.1, 0.8, 0.95], [0, 1, 1, 0]);
  return (
    <span className="relative inline-block whitespace-nowrap">
      <motion.span style={{ letterSpacing }} className="inline-block">
        {word}
      </motion.span>
      <motion.span
        style={{ left, opacity: loupe }}
        className="pointer-events-none absolute top-1/2 size-[1.15em] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-violet bg-violet/5 shadow-[0_8px_24px_-8px_rgb(116_71_255/0.5)]"
      >
        <span className="absolute -bottom-[0.28em] -right-[0.22em] h-[0.1em] w-[0.36em] rotate-45 rounded-full bg-violet" />
      </motion.span>
    </span>
  );
}

const FX: Fx[] = [Tangle, Sweep, Guides, Decode, Kern];

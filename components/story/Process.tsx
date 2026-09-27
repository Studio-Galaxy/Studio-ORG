"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { process } from "@/lib/content";
import { peak, plateaus } from "@/lib/scroll";

type P = [x: number, y: number, r: number];

// Nine points, five arrangements. Point 0 is the idea itself.
const LAYOUTS: P[][] = [
  // idea — one point
  Array.from({ length: 9 }, (_, i) => [200, 200, i === 0 ? 7 : 0]),
  // design — construction geometry
  [[200, 200, 4], [200, 80, 4], [320, 200, 4], [200, 320, 4], [80, 200, 4], [115, 115, 4], [285, 115, 4], [285, 285, 4], [115, 285, 4]],
  // engineering — status dots of a real-shaped system
  [[207, 101, 3.5], [299, 101, 2.8], [285, 137, 2.8], [141, 293, 2.8], [115, 101, 2.8], [29, 107, 2.8], [207, 137, 2.8], [231, 293, 2.8], [301, 293, 2.8]],
  // intelligence — layered network
  [[200, 200, 6], [200, 98, 5], [306, 202, 5], [200, 302, 5], [94, 204, 5], [96, 124, 5], [304, 122, 5], [302, 282, 5], [98, 280, 5]],
  // experience — an interface
  [[160, 296, 4], [102, 252, 5], [300, 124, 7], [296, 222, 4], [102, 220, 5], [102, 188, 5], [122, 88, 3.5], [108, 88, 3.5], [94, 88, 3.5]],
];

// Point 0 stays violet, then turns white on the button.
const FILLS = LAYOUTS[0].map((_, i) => (i === 0 ? ["#7447ff", "#7447ff", "#7447ff", "#7447ff", "#ffffff"] : Array(5).fill("#242220")));

// Engineering: an asymmetric system. [label, x, y, w, h?, tone?]
type M = [string, number, number, number, number?, ("ai" | "bus")?];
const MODS: M[] = [
  ["web", 20, 96, 62], ["ios", 20, 128, 62], ["android", 20, 160, 62],
  ["gateway", 106, 90, 60, 92],
  ["api", 198, 90, 70], ["auth", 290, 90, 78],
  ["search", 198, 126, 64], ["agents", 276, 126, 92, 22, "ai"],
  ["jobs", 198, 162, 54], ["notify", 266, 162, 62],
  ["event bus", 198, 200, 170, 18, "bus"],
  ["postgres", 132, 282, 78], ["cache", 222, 282, 58], ["vector", 292, 282, 76],
  ["blob", 132, 312, 66], ["replica", 222, 312, 72],
  ["metrics", 20, 290, 76], ["logs", 20, 320, 56],
];
const ZONES: [string, number, number, number, number][] = [
  ["clients", 12, 70, 78, 122], ["services", 186, 64, 196, 164], ["data", 120, 254, 262, 88], ["observe", 12, 264, 92, 86],
];
const WIRES = [
  "M82 107 H106", "M82 139 H106", "M82 171 H106",
  "M166 101 H198", "M166 137 H198", "M268 101 H290", "M262 112 V119 H300 V126",
  "M225 184 V200", "M297 184 V200", "M340 148 V200",
  "M240 218 V240 H171 V282", "M251 218 V282", "M368 137 H376 V293 H368",
  "M190 304 V323 H222", "M120 182 V250 H58 V290", "M76 331 H110 V240 H198 V218",
];
const LIVE = [0, 3, 6, 12, 10];

const NET_IN = [5, 4, 8];
const NET_MID = [1, 0, 3];
const NET_OUT = [6, 2, 7];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = plateaus(process.length, 0.5);
  const stage = useTransform(scrollYProgress, p.input, p.output);

  return (
    <section ref={ref} aria-labelledby="process-title" className="relative h-[600vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-5 pb-8 pt-24 md:px-10 lg:px-16">
        <p id="process-title" className="label text-ink-2">
          From idea to reality
        </p>

        <div className="grid flex-1 grid-rows-[auto_1fr] items-center gap-6 md:grid-cols-[1fr_1fr] md:grid-rows-1 md:gap-10">
          <ol className="order-2 md:order-1">
            {process.map((s, i) => (
              <Word key={s.word} stage={stage} i={i}>
                {s.word}
              </Word>
            ))}
          </ol>

          <div className="order-1 flex flex-col items-center md:order-2">
            <Visual stage={stage} />
            <div className="relative mt-4 h-6 w-full text-center">
              {process.map((s, i) => (
                <Note key={s.note} stage={stage} i={i}>
                  {`0${i + 1} — ${s.note}`}
                </Note>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Word({ stage, i, children }: { stage: MotionValue<number>; i: number; children: string }) {
  const opacity = useTransform(stage, [i - 1, i, i + 1], [0.13, 1, 0.13]);
  const x = useTransform(stage, [i - 1, i, i + 1], [0, 14, 0]);
  const dot = useTransform(stage, [i - 0.5, i, i + 0.5], [0, 1, 0]);
  return (
    <motion.li style={{ opacity, x }} className="display relative flex items-center text-[clamp(2.1rem,7vw,6.4rem)] leading-[1.02]">
      <motion.span aria-hidden style={{ opacity: dot, scale: dot }} className="absolute -left-4 size-2 rounded-full bg-violet md:-left-6 md:size-2.5" />
      {children}
    </motion.li>
  );
}

function Note({ stage, i, children }: { stage: MotionValue<number>; i: number; children: string }) {
  const o = peak(i, i === process.length - 1, 0.4);
  const opacity = useTransform(stage, o.input, o.output);
  return (
    <motion.p aria-hidden style={{ opacity }} className="label absolute inset-x-0 text-ink-2">
      {children}
    </motion.p>
  );
}

function useLayer(stage: MotionValue<number>, k: number, last = false) {
  const o = peak(k, last, 0.7);
  return useTransform(stage, o.input, o.output);
}

function Visual({ stage }: { stage: MotionValue<number> }) {
  const idea = useLayer(stage, 0);
  const design = useLayer(stage, 1);
  const eng = useLayer(stage, 2);
  const intel = useLayer(stage, 3);
  const exp = useLayer(stage, 4, true);
  const draw = useTransform(stage, [0.3, 1], [0, 1]);
  const frameScale = useTransform(stage, [3.3, 4], [0.9, 1]);
  const wire = useTransform(stage, [1.3, 2], [0, 1]);

  const at = (i: number, k: number) => LAYOUTS[k][i];
  const curve = (a: P, b: P) => `M${a[0]} ${a[1]} C${(a[0] + b[0]) / 2} ${a[1]} ${(a[0] + b[0]) / 2} ${b[1]} ${b[0]} ${b[1]}`;

  return (
    <svg viewBox="0 0 400 400" aria-hidden className="w-[min(78vw,44svh)] overflow-visible md:w-[min(40vw,68svh)]">
      <defs>
        <radialGradient id="p-glow">
          <stop offset="0" stopColor="#7447ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7447ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* idea: glow */}
      <motion.circle cx="200" cy="200" r="120" fill="url(#p-glow)" style={{ opacity: idea }} />

      {/* design: construction lines */}
      <motion.g style={{ opacity: design }} fill="none" stroke="#242220" strokeOpacity="0.32" strokeWidth="1">
        <motion.circle cx="200" cy="200" r="120" style={{ pathLength: draw }} />
        <motion.circle cx="200" cy="200" r="60" strokeDasharray="2 5" />
        <motion.rect x="115" y="115" width="170" height="170" style={{ pathLength: draw }} />
        <motion.path d="M200 80 L320 200 L200 320 L80 200 Z" style={{ pathLength: draw }} />
        <path d="M60 200 H340 M200 60 V340" strokeDasharray="2 5" />
        <text x="326" y="72" fontSize="9" fill="#6f6961" stroke="none" fontFamily="var(--font-mono)">r 120</text>
      </motion.g>

      {/* engineering: an asymmetric system, wired up */}
      <motion.g style={{ opacity: eng }} fontFamily="var(--font-mono)">
        {ZONES.map(([name, x, y, w, h]) => (
          <g key={name}>
            <rect x={x} y={y} width={w} height={h} rx="12" fill="#242220" fillOpacity="0.025" stroke="#242220" strokeOpacity="0.2" strokeDasharray="3 4" />
            <text x={x + 8} y={y - 5} fontSize="7.5" fill="#a39b91" letterSpacing="0.08em">{name.toUpperCase()}</text>
          </g>
        ))}
        <g fill="none" stroke="#242220" strokeOpacity="0.35" strokeLinejoin="round">
          {WIRES.map((d) => <motion.path key={d} d={d} style={{ pathLength: wire }} />)}
        </g>
        <g fill="none" stroke="#7447ff" strokeWidth="1.4" strokeLinejoin="round">
          {LIVE.map((k, i) => <path key={k} d={WIRES[k]} className="anim-flow" style={{ animationDelay: `${i * -0.3}s` }} />)}
        </g>
        {MODS.map(([label, x, y, w, h = 22, tone]) => (
          <g key={label}>
            <rect
              x={x} y={y} width={w} height={h} rx="7"
              fill={tone === "ai" ? "#ebe3ff" : tone === "bus" ? "#d8c9ff" : "#fbf7f1"}
              stroke={tone ? "#7447ff" : "#242220"} strokeOpacity={tone ? 0.5 : 0.45}
            />
            <circle cx={x + 9} cy={y + 11} r="2.6" fill={tone ? "#7447ff" : "#242220"} opacity={tone === "bus" ? 1 : 0.35} />
            <text x={x + 17} y={y + 14} fontSize="8.5" fill="#242220">{label}</text>
          </g>
        ))}
      </motion.g>

      {/* intelligence: weighted links */}
      <motion.g style={{ opacity: intel }} fill="none">
        {NET_IN.flatMap((a) => NET_MID.map((b) => <path key={`${a}${b}`} d={curve(at(a, 3), at(b, 3))} stroke="#242220" strokeOpacity="0.22" />))}
        {NET_MID.flatMap((a) => NET_OUT.map((b) => <path key={`${a}${b}`} d={curve(at(a, 3), at(b, 3))} stroke="#242220" strokeOpacity="0.22" />))}
        <g stroke="#7447ff" strokeWidth="1.5" className="anim-flow">
          <path d={curve(at(5, 3), at(0, 3))} />
          <path d={curve(at(4, 3), at(1, 3))} />
          <path d={curve(at(0, 3), at(2, 3))} />
          <path d={curve(at(3, 3), at(7, 3))} />
          <path d={curve(at(1, 3), at(6, 3))} />
        </g>
        <circle cx="200" cy="200" r="44" fill="url(#p-glow)" />
      </motion.g>

      {/* experience: the interface */}
      <motion.g style={{ opacity: exp, scale: frameScale, transformOrigin: "200px 200px" }}>
        <rect x="68" y="64" width="264" height="276" rx="26" fill="#fbf7f1" stroke="#242220" strokeOpacity="0.12" style={{ filter: "drop-shadow(0 24px 30px rgb(36 34 32 / 0.14))" }} />
        <path d="M68 108 H332" stroke="#242220" strokeOpacity="0.08" />
        <rect x="94" y="124" width="116" height="13" rx="6.5" fill="#242220" />
        <rect x="94" y="145" width="72" height="8" rx="4" fill="#242220" opacity="0.2" />
        <rect x="276" y="113" width="46" height="22" rx="11" fill="#d8c9ff" />
        {[188, 220, 252].map((y, i) => (
          <g key={y}>
            <rect x="116" y={y - 4} width={[132, 104, 118][i]} height="8" rx="4" fill="#242220" opacity="0.72" />
            <rect x="272" y={y - 4} width="36" height="8" rx="4" fill="#242220" opacity="0.12" />
          </g>
        ))}
        <rect x="140" y="278" width="120" height="36" rx="18" fill="#7447ff" />
        <text x="210" y="300" textAnchor="middle" fontSize="11" fontWeight="500" fill="#fff" fontFamily="var(--font-sans)">Get started</text>
      </motion.g>

      {LAYOUTS[0].map((_, i) => (
        <Node key={i} i={i} stage={stage} />
      ))}
    </svg>
  );
}

function Node({ i, stage }: { i: number; stage: MotionValue<number> }) {
  const ks = [0, 1, 2, 3, 4];
  const cx = useTransform(stage, ks, LAYOUTS.map((l) => l[i][0]));
  const cy = useTransform(stage, ks, LAYOUTS.map((l) => l[i][1]));
  const r = useTransform(stage, ks, LAYOUTS.map((l) => l[i][2]));
  // Point 0 marks the api, then becomes the button; it turns white against the violet.
  const fill = useTransform(stage, ks, FILLS[i]);
  return <motion.circle cx={cx} cy={cy} r={r} style={{ fill }} className={i === 0 ? "drop-shadow-[0_0_6px_rgb(116_71_255/0.8)]" : ""} />;
}

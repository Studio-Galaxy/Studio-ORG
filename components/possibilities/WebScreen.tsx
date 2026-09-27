"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState, type PointerEvent } from "react";

// Conceptual web platform. The range toggle genuinely re-plots the chart.

const DATA = {
  week: {
    now: [0.18, 0.26, 0.38, 0.44, 0.4, 0.33, 0.36, 0.52, 0.68, 0.72, 0.64, 0.86],
    prev: [0.1, 0.13, 0.17, 0.2, 0.22, 0.21, 0.2, 0.24, 0.28, 0.3, 0.29, 0.4],
    axis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    total: 2481, delta: "12%", scale: 600, cards: [0.7, 0.45, 0.85],
  },
  month: {
    now: [0.3, 0.22, 0.34, 0.5, 0.46, 0.58, 0.54, 0.62, 0.78, 0.7, 0.84, 0.92],
    prev: [0.2, 0.24, 0.26, 0.3, 0.34, 0.33, 0.4, 0.42, 0.48, 0.46, 0.52, 0.58],
    axis: ["1", "8", "15", "22", "29"],
    total: 11204, delta: "31%", scale: 3000, cards: [0.55, 0.8, 0.62],
  },
};
type Range = keyof typeof DATA;

const W = 400, H = 140;
const y = (v: number) => 128 - v * 110;

// Catmull-Rom through the points, as cubic Béziers. Same command count for
// every dataset, so Motion can morph one path into the other.
function curve(vs: number[]) {
  const p = vs.map((v, i) => [(i / (vs.length - 1)) * W, y(v)]);
  let d = `M${p[0][0]} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [p0, p1, p2, p3] = [p[i - 1] ?? p[i], p[i], p[i + 1], p[i + 2] ?? p[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

const ease = [0.16, 1, 0.3, 1] as const;
const morph = { duration: 0.9, ease };

export function WebScreen() {
  const [range, setRange] = useState<Range>("week");
  const [hover, setHover] = useState<number | null>(null);
  const data = DATA[range];
  const line = curve(data.now);
  const last = data.now[data.now.length - 1];

  const count = useMotionValue(DATA.week.total);
  const shown = useTransform(count, (v) => Math.round(v).toLocaleString("en-US"));
  useEffect(() => {
    const c = animate(count, data.total, morph);
    return () => c.stop();
  }, [count, data.total]);

  function track(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setHover(Math.round(f * (data.now.length - 1)));
  }

  return (
    <div className="flex h-full flex-col text-ink">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => <span key={i} className="size-2.5 rounded-full bg-ink/15" />)}
        </span>
        <span className="mx-auto rounded-full bg-cream-2 px-10 py-1 font-mono text-[10px] text-ink-2">yourproduct.com</span>
      </div>
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-44 shrink-0 flex-col gap-1.5 border-r border-line p-4 @[520px]:flex">
          <span className="mb-4 flex items-center gap-2 text-[13px] font-semibold">
            <span className="size-4 rounded-md bg-ink" /> Product
          </span>
          {["Overview", "Projects", "People", "Insights", "Settings"].map((l, i) => (
            <span key={l} className={`rounded-lg px-2.5 py-1.5 text-[12px] ${i === 0 ? "bg-lilac font-medium text-violet" : "text-ink-2"}`}>{l}</span>
          ))}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[22px] font-semibold tracking-[-0.04em]">Overview</p>
            <div role="group" aria-label="Chart range" className="relative flex rounded-full bg-cream-2 p-0.5 text-[10px]">
              <motion.span
                aria-hidden
                className="absolute bottom-0.5 left-0.5 top-0.5 w-[52px] rounded-full bg-white shadow-sm"
                animate={{ x: range === "month" ? 52 : 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
              {(["week", "month"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={range === r}
                  onClick={() => setRange(r)}
                  className={`relative w-[52px] cursor-pointer rounded-full py-1 capitalize transition-colors duration-300 ${range === r ? "text-ink" : "text-ink-2 hover:text-ink"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-0 flex-1 rounded-2xl border border-line bg-white p-4">
            <div className="flex items-baseline gap-2">
              <p className="text-[11px] text-ink-2">Activity</p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <motion.span className="text-[20px] font-semibold tabular-nums tracking-[-0.04em]">{shown}</motion.span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={range}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-full bg-lilac px-2 py-0.5 text-[10px] font-medium text-violet"
                >
                  ↑ {data.delta} vs last {range}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* plot area: svg for shapes, html overlay for round marks and text */}
            <div className="absolute inset-x-4 bottom-8 top-[4.6rem]">
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#7447ff" stopOpacity="0.25" />
                    <stop offset="1" stopColor="#7447ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[32, 68, 104].map((g) => (
                  <path key={g} d={`M0 ${g} H${W}`} stroke="#242220" strokeOpacity="0.06" vectorEffect="non-scaling-stroke" />
                ))}
                <motion.path initial={false} animate={{ d: `${line} L${W} ${H} L0 ${H} Z` }} transition={morph} fill="url(#area)" />
                <motion.path
                  initial={false}
                  animate={{ d: curve(data.prev) }}
                  transition={{ ...morph, delay: 0.06 }}
                  fill="none" stroke="#242220" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke"
                />
                <motion.path initial={false} animate={{ d: line }} transition={morph} fill="none" stroke="#7447ff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              </svg>

              <div className="absolute inset-0" onPointerMove={track} onPointerLeave={() => setHover(null)}>
                {/* newest value */}
                <motion.span
                  initial={false}
                  animate={{ top: `${(y(last) / H) * 100}%`, opacity: hover === null ? 1 : 0.3 }}
                  transition={morph}
                  className="absolute right-0 size-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white bg-violet shadow-[0_0_0_4px_rgb(116_71_255/0.18)]"
                />
                {hover !== null && (
                  <motion.div
                    className="pointer-events-none absolute inset-y-0 w-px bg-ink/15"
                    initial={false}
                    animate={{ left: `${(hover / (data.now.length - 1)) * 100}%` }}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  >
                    <motion.span
                      initial={false}
                      animate={{ top: `${(y(data.now[hover]) / H) * 100}%` }}
                      transition={morph}
                      className="absolute left-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet"
                    >
                      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-cream">
                        {Math.round(data.now[hover] * data.scale).toLocaleString("en-US")}
                      </span>
                    </motion.span>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="absolute inset-x-4 bottom-2.5 h-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={range}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="flex justify-between font-mono text-[9px] text-ink-3"
                >
                  {data.axis.map((a) => <span key={a}>{a}</span>)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 @[520px]:grid-cols-3">
            {["Projects", "People", "Insights"].map((label, i) => (
              <div key={label} className={`rounded-2xl border border-line bg-white p-3.5 ${i === 2 ? "hidden @[520px]:block" : ""}`}>
                <span className="block text-[10px] text-ink-2">{label}</span>
                <span className="mt-2.5 block h-1.5 rounded-full bg-cream-2">
                  <motion.span
                    className="block h-full rounded-full bg-ink"
                    initial={false}
                    animate={{ width: `${data.cards[i] * 100}%` }}
                    transition={{ ...morph, delay: 0.08 * i }}
                  />
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { motion, useTransform } from "motion/react";
import { useParallax } from "@/components/ui/useParallax";

// Conceptual demonstrations — not client work.

export function PhoneScreen() {
  return (
    <div className="flex h-full flex-col px-5 pb-3 pt-4 text-white">
      <div className="flex items-center justify-between px-2 text-[12px] font-semibold">
        <span>9:41</span>
        <span className="h-[22px] w-[78px] rounded-full bg-black" />
        <span className="flex gap-1">
          <span className="size-1.5 rounded-full bg-white" />
          <span className="size-1.5 rounded-full bg-white/60" />
        </span>
      </div>

      <p className="label mt-6 text-center text-white/45">Now playing</p>

      <div className="mt-5 aspect-square w-full overflow-hidden rounded-[22px] bg-[#221b33]">
        <svg viewBox="0 0 200 200" className="size-full">
          <defs>
            <radialGradient id="art" cx="0.62" cy="0.38">
              <stop offset="0" stopColor="#d8c9ff" />
              <stop offset="0.35" stopColor="#7447ff" />
              <stop offset="1" stopColor="#221b33" />
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill="url(#art)" />
          <g fill="none" stroke="#fff" strokeOpacity="0.35" className="animate-[spin_40s_linear_infinite] [transform-box:fill-box] [transform-origin:center]">
            {[30, 50, 70, 90, 110].map((r) => (
              <ellipse key={r} cx="124" cy="76" rx={r} ry={r * 0.42} transform={`rotate(-24 124 76)`} />
            ))}
          </g>
          <circle cx="124" cy="76" r="5" fill="#fff" />
        </svg>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-[19px] font-semibold tracking-[-0.03em]">Low Orbit</p>
          <p className="text-[12px] text-white/50">Side A — Night Drive</p>
        </div>
        <span className="text-[18px] text-lavender">♥</span>
      </div>

      <div className="mt-4 flex h-8 items-center gap-[3px]">
        {Array.from({ length: 34 }, (_, i) => (
          <span
            key={i}
            className={`w-full origin-center rounded-full ${i < 14 ? "bg-white" : "bg-white/25"}`}
            style={{ height: `${30 + ((i * 37) % 70)}%`, animation: `wave ${0.9 + (i % 5) * 0.18}s ease-in-out ${i * -0.07}s infinite` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-white/40">
        <span>1:24</span>
        <span>3:52</span>
      </div>

      <div className="mt-auto flex items-center justify-center gap-10 pb-4">
        <Skip flip />
        <span className="flex size-14 items-center justify-center rounded-full bg-white">
          <span className="ml-1 border-y-[9px] border-l-[14px] border-y-transparent border-l-[#141217]" />
        </span>
        <Skip />
      </div>
      <span className="mx-auto h-1 w-28 rounded-full bg-white/60" />
    </div>
  );
}

function Skip({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-6 fill-white ${flip ? "-scale-x-100" : ""}`}>
      <path d="M4 5 L14 12 L4 19 Z M13 5 L23 12 L13 19 Z" />
    </svg>
  );
}

export function WebScreen() {
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
            <span className="flex rounded-full bg-cream-2 p-0.5 text-[10px]">
              <span className="rounded-full bg-white px-2.5 py-1 shadow-sm">Week</span>
              <span className="px-2.5 py-1 text-ink-2">Month</span>
            </span>
          </div>
          <div className="relative min-h-0 flex-1 rounded-2xl border border-line bg-white p-4">
            <p className="text-[11px] text-ink-2">Activity</p>
            <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="absolute inset-x-4 bottom-4 h-[70%] w-[calc(100%-2rem)]">
              <defs>
                <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#7447ff" stopOpacity="0.25" />
                  <stop offset="1" stopColor="#7447ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 110 C40 100 60 70 100 76 S160 110 200 80 S260 20 300 36 S360 60 400 18 V140 H0Z" fill="url(#area)" />
              <path d="M0 110 C40 100 60 70 100 76 S160 110 200 80 S260 20 300 36 S360 60 400 18" fill="none" stroke="#7447ff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              <path d="M0 122 C60 118 100 100 160 108 S260 90 320 96 S380 80 400 76" fill="none" stroke="#242220" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-3 @[520px]:grid-cols-3">
            {[0.7, 0.45, 0.85].map((v, i) => (
              <div key={i} className={`rounded-2xl border border-line bg-white p-3.5 ${i === 2 ? "hidden @[520px]:block" : ""}`}>
                <span className="block h-2 w-12 rounded-full bg-ink/15" />
                <span className="mt-3 block h-1.5 rounded-full bg-cream-2">
                  <span className="block h-full rounded-full bg-ink" style={{ width: `${v * 100}%` }} />
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

const FLOW = [
  { id: "in", label: "New message", kind: "Trigger", x: 4, y: 46 },
  { id: "ai", label: "Understand", kind: "AI", x: 38, y: 46 },
  { id: "sum", label: "Summarise", kind: "AI", x: 72, y: 22 },
  { id: "route", label: "Route to team", kind: "Action", x: 72, y: 70 },
];

export function FlowScreen() {
  return (
    <div className="relative h-full bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] bg-[size:18px_18px] font-mono text-white">
      <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/10 px-5 py-3.5 text-[11px]">
        <span className="text-white/60">workflow / inbox</span>
        <span className="flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-lavender">
          <span className="size-1.5 animate-pulse rounded-full bg-lavender" /> live
        </span>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <g fill="none" stroke="#b69cff" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
          {["M28 52 H38", "M62 52 C67 52 67 28 72 28", "M62 52 C67 52 67 76 72 76"].map((d) => (
            <g key={d}>
              <path d={d} strokeOpacity="0.25" vectorEffect="non-scaling-stroke" />
              <path d={d} className="anim-flow" vectorEffect="non-scaling-stroke" />
            </g>
          ))}
        </g>
      </svg>
      {FLOW.map((n) => (
        <div key={n.id} className="absolute w-[24%] rounded-xl border border-white/12 bg-[#1f1c24] p-2.5 shadow-lg" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
          <p className={`text-[9px] uppercase tracking-[0.12em] ${n.kind === "AI" ? "text-lavender" : "text-white/45"}`}>{n.kind}</p>
          <p className="mt-1 truncate font-sans text-[12px] font-medium">{n.label}</p>
        </div>
      ))}
      <p className="absolute bottom-4 left-5 text-[10px] text-white/40">runs on every new message →</p>
    </div>
  );
}

export function ExperimentScreen() {
  const { x, y, bind } = useParallax();
  const rx = useTransform(y, (v) => -18 + v * -14);
  const ry = useTransform(x, (v) => v * 18);
  return (
    <div {...bind} className="relative flex h-full items-center justify-center [perspective:900px]">
      <div className="absolute size-[30%] rounded-full bg-[radial-gradient(circle,rgb(155_123_255/0.8),rgb(116_71_255/0.2)_45%,transparent_70%)] blur-md anim-breathe" />
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative size-[72%] [transform-style:preserve-3d]">
        <div className="absolute inset-0 [transform-style:preserve-3d] animate-[orbit_26s_linear_infinite]">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-full border"
              style={{ transform: `rotateY(${i * 15}deg)`, borderColor: i % 4 === 0 ? "rgb(216 201 255 / 0.7)" : "rgb(255 255 255 / 0.16)" }}
            />
          ))}
          <span className="absolute inset-0 rounded-full border border-white/20 [transform:rotateX(90deg)]" />
        </div>
      </motion.div>
      <span className="absolute size-2 rounded-full bg-white shadow-[0_0_14px_4px_rgb(155_123_255)]" />
    </div>
  );
}

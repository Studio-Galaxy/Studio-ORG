"use client";

import { motion, useTransform } from "motion/react";
import { useParallax } from "@/components/ui/useParallax";

// Conceptual demonstrations — not client work.

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

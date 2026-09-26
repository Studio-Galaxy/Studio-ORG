"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { Panel } from "@/components/ui/Panel";
import { useParallax } from "@/components/ui/useParallax";

// A designer's canvas: type, colour, components — layered at different depths.
export function DesignVisual() {
  const { x, y, bind } = useParallax();
  return (
    <Panel
      {...bind}
      aria-hidden
      className="bg-paper bg-[linear-gradient(rgb(36_34_32/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(36_34_32/0.05)_1px,transparent_1px)] bg-[size:5cqw_5cqw] ring-1 ring-line"
    >
      <Layer x={x} y={y} depth={10} className="left-[6%] top-[9%] w-[40cqw]">
        <div className="rounded-[3cqw] bg-white p-[3.2cqw] shadow-[0_2cqw_5cqw_-2cqw_rgb(36_34_32/0.2)]">
          <p className="text-[15cqw] font-semibold leading-[0.9] tracking-[-0.06em]">Aa</p>
          <p className="mt-[1.4cqw] font-mono text-[1.5cqw] uppercase tracking-[0.12em] text-ink-2">Geist · Display 600</p>
          <div className="mt-[2.6cqw] space-y-[0.9cqw] border-t border-line pt-[2cqw]">
            <p className="text-[3.4cqw] font-semibold leading-none tracking-[-0.04em]">Display</p>
            <p className="text-[2.3cqw] font-medium leading-none tracking-[-0.02em]">Title</p>
            <p className="text-[1.6cqw] leading-none text-ink-2">Body — calm, readable, small.</p>
          </div>
        </div>
      </Layer>

      <Layer x={x} y={y} depth={20} className="right-[6%] top-[16%] w-[40cqw]">
        <div className="space-y-[2.4cqw] rounded-[3cqw] bg-white p-[3cqw] shadow-[0_2.4cqw_6cqw_-2cqw_rgb(36_34_32/0.25)]">
          <div className="flex items-center justify-between">
            <span className="text-[2cqw] font-medium">Notifications</span>
            <span className="flex h-[3.4cqw] w-[6cqw] items-center justify-end rounded-full bg-violet p-[0.4cqw]">
              <span className="size-[2.6cqw] rounded-full bg-white" />
            </span>
          </div>
          <div>
            <div className="mb-[1.2cqw] flex justify-between text-[1.6cqw] text-ink-2">
              <span>Intensity</span>
              <span className="font-mono">64</span>
            </div>
            <div className="relative h-[0.6cqw] rounded-full bg-cream-2">
              <div className="absolute inset-y-0 left-0 w-[64%] rounded-full bg-ink" />
              <div className="absolute left-[64%] top-1/2 size-[2.4cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-white shadow" />
            </div>
          </div>
          <div className="relative">
            <div className="rounded-full bg-ink py-[1.6cqw] text-center text-[1.8cqw] font-medium text-cream">Continue</div>
            <div className="absolute -inset-[0.9cqw] rounded-[1cqw] border border-violet">
              {["-left-[0.5cqw] -top-[0.5cqw]", "-right-[0.5cqw] -top-[0.5cqw]", "-left-[0.5cqw] -bottom-[0.5cqw]", "-right-[0.5cqw] -bottom-[0.5cqw]"].map((c) => (
                <span key={c} className={`absolute size-[1cqw] border border-violet bg-white ${c}`} />
              ))}
            </div>
            <span className="absolute -bottom-[4.4cqw] left-1/2 -translate-x-1/2 rounded-[0.6cqw] bg-violet px-[0.8cqw] py-[0.3cqw] font-mono text-[1.3cqw] text-white">
              320 × 48
            </span>
          </div>
        </div>
      </Layer>

      <Layer x={x} y={y} depth={16} className="bottom-[9%] left-[8%] flex">
        {["bg-ink", "bg-violet", "bg-lavender", "bg-cream-2"].map((c) => (
          <span key={c} className={`-mr-[1.6cqw] size-[7cqw] rounded-full ring-[0.5cqw] ring-paper ${c}`} />
        ))}
      </Layer>

      <Layer x={x} y={y} depth={32} className="bottom-[16%] right-[22%]">
        <motion.div animate={{ x: [0, 18, -6, 0], y: [0, -12, 6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
          <svg viewBox="0 0 16 20" className="w-[2.6cqw] drop-shadow">
            <path d="M1 1 L15 11 L8.5 12 L5 19 Z" fill="#7447ff" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          <span className="ml-[2cqw] mt-[0.3cqw] inline-block rounded-full bg-violet px-[1.2cqw] py-[0.4cqw] text-[1.4cqw] font-medium text-white">Studio</span>
        </motion.div>
      </Layer>
    </Panel>
  );
}

function Layer({ x, y, depth, className, children }: { x: MotionValue<number>; y: MotionValue<number>; depth: number; className: string; children: ReactNode }) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div style={{ x: tx, y: ty }} className={`absolute ${className}`}>
      {children}
    </motion.div>
  );
}

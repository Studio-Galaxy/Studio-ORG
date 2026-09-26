"use client";

import { useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";

// Pointer position over an element as springy -1..1 values.
export function useParallax() {
  const reduce = useReducedMotion();
  const spring = { stiffness: 60, damping: 16 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const bind = {
    onPointerMove(e: PointerEvent<HTMLElement>) {
      if (reduce || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      x.set(((e.clientX - r.left) / r.width) * 2 - 1);
      y.set(((e.clientY - r.top) / r.height) * 2 - 1);
    },
    onPointerLeave() {
      x.set(0);
      y.set(0);
    },
  };
  return { x, y, bind };
}

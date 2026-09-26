"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { useEffect } from "react";

// The first point of the story: a small glowing point that leans toward the cursor.
export function Orb({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const spring = { stiffness: 40, damping: 14, mass: 1 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set((e.clientX / window.innerWidth - 0.5) * 90);
      y.set((e.clientY / window.innerHeight - 0.5) * 70);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  return (
    <motion.div aria-hidden style={{ x, y }} className={`pointer-events-none ${className}`}>
      <div className="anim-fade relative size-3" style={{ animationDelay: "0.9s" }}>
        <div className="absolute -inset-24 rounded-full bg-[radial-gradient(circle,rgb(116_71_255/0.22),rgb(116_71_255/0.06)_45%,transparent_70%)] anim-breathe" />
        <div className="absolute -inset-5 rounded-full bg-[radial-gradient(circle,rgb(155_123_255/0.55),transparent_70%)] blur-[2px]" />
        <div className="absolute inset-0 rounded-full bg-white shadow-[0_0_12px_4px_rgb(155_123_255/0.9),0_0_2px_1px_rgb(116_71_255)]" />
      </div>
    </motion.div>
  );
}

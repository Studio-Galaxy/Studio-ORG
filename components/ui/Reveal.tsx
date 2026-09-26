"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

// Text that comes into focus as it reaches the reading line.
export function ScrollInk({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.5"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.14, 1]);
  return (
    <motion.p ref={ref} style={{ opacity }} className={className}>
      {children}
    </motion.p>
  );
}

// One-time rise-in when scrolled into view.
export function Rise({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

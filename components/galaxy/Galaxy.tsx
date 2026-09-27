"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { galaxy } from "@/lib/content";
import { js } from "@/lib/scroll";
import { buildField, drawField, type Field, type Sky } from "./field";
import { buildGalaxy, buildStars } from "./sky";

// Scroll timeline (0..1) for the chapter.
const T = {
  dark: [0, 0.06],
  lines: [
    [0.04, 0.1, 0.18, 0.23], // Everything starts with a point.
    [0.27, 0.31, 0.37, 0.41], // An idea.
    [0.43, 0.47, 0.52, 0.56], // A system.
    [0.58, 0.62, 0.67, 0.71], // An experience.
  ],
  universe: [0.73, 0.77, 0.82, 0.85],
  name: [0.86, 0.9],
  light: [0.94, 1],
};

export function Galaxy() {
  const ref = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bg = useTransform(scrollYProgress, js([...T.dark, ...T.light], ["#f7f0e7", "#0c0b10", "#0c0b10", "#f7f0e7"]));
  const nameColor = useTransform(scrollYProgress, js(T.light, ["#f7f0e7", "#242220"]));
  const nameOpacity = useTransform(scrollYProgress, js(T.name, [0, 1]));
  const nameSpacing = useTransform(scrollYProgress, js([T.name[0], 0.94], ["0.06em", "-0.04em"]));
  const nameY = useTransform(scrollYProgress, js(T.name, [40, 0]));

  // Canvas lives outside React: progress is read from a ref inside the frame loop.
  const progress = useRef(0);
  const wake = useRef<() => void>(() => {});
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    wake.current();
  });

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let field: Field;
    let sky: Sky;
    let galaxySize = 0;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = false;
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      dpr = Math.min(devicePixelRatio, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      field = buildField(w < 768 ? 700 : 1500);
      // repaint the galaxy bitmap only when the needed resolution really changes
      const need = Math.min(2048, Math.round(Math.min(w, h) * 1.4 * dpr));
      const galaxy = !sky || Math.abs(need - galaxySize) / need > 0.2 ? buildGalaxy((galaxySize = need), w < 768 ? 38000 : 75000) : sky.galaxy;
      sky = { galaxy, stars: buildStars(w, h, dpr) };
      frame(performance.now());
    };

    const frame = (t: number) => {
      tilt.x += (tilt.tx - tilt.x) * 0.05;
      tilt.y += (tilt.ty - tilt.y) * 0.05;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      drawField(ctx, field, { w, h, p: progress.current, t: reduce ? 0 : t, tiltX: tilt.x, tiltY: tilt.y, sky });
    };

    const loop = (t: number) => {
      frame(t);
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0;
    };
    wake.current = () => {
      if (reduce && visible) frame(0);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tilt.tx = (e.clientX / innerWidth - 0.5) * 2;
      tilt.ty = (e.clientY / innerHeight - 0.5) * 2;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    io.observe(cv);
    addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <section ref={ref} aria-labelledby="galaxy-title" className="relative h-[900vh]">
      <motion.div style={{ backgroundColor: bg }} className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />

        <div className="pointer-events-none absolute inset-x-0 bottom-[12%] px-5 text-center text-white md:bottom-[14%]">
          {galaxy.map((line, i) => (
            <Line key={line} p={scrollYProgress} range={T.lines[i]} className={`absolute inset-x-0 bottom-0 max-w-[16ch] md:max-w-none ${i === 0 ? "text-[clamp(1.8rem,3.6vw,3.2rem)]" : "text-[clamp(2.4rem,6vw,5.6rem)]"}`}>
              {line}
            </Line>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 text-center text-white">
          <Line p={scrollYProgress} range={T.universe} className="text-[clamp(2.8rem,8vw,8rem)]">
            Different ideas.
            <br />
            <span className="text-lavender">One universe.</span>
          </Line>
        </div>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4">
          <motion.h2
            id="galaxy-title"
            style={{ opacity: nameOpacity, color: nameColor, letterSpacing: nameSpacing, y: nameY }}
            className="whitespace-nowrap text-[clamp(2.6rem,10vw,12rem)] font-semibold uppercase leading-[0.9]"
          >
            Studio Galaxy
          </motion.h2>
          <motion.p style={{ opacity: nameOpacity, color: nameColor }} className="label mt-6 opacity-60">
            An idea can become an entire universe.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

function Line({ p, range, className, children }: { p: MotionValue<number>; range: number[]; className: string; children: React.ReactNode }) {
  const opacity = useTransform(p, js(range, [0, 1, 1, 0]));
  const y = useTransform(p, js(range, [30, 0, 0, -30]));
  const blur = useTransform(p, js(range, [8, 0, 0, 8]));
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <motion.p style={{ opacity, y, filter }} className={`display mx-auto [text-shadow:0_2px_40px_rgb(12_11_16/0.7)] ${className}`}>
      {children}
    </motion.p>
  );
}

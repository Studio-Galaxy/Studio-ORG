"use client";

import { useEffect, useRef } from "react";
import { Panel } from "@/components/ui/Panel";

// A field of points that notices you. Canvas 2D; only runs while on screen.
export function AliveVisual() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, active: false };
    const eased = { x: 0, y: 0 };
    let w = 0, h = 0, dpr = 1, raf = 0, visible = false;

    const resize = () => {
      dpr = Math.min(devicePixelRatio, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      if (reduce) draw(0);
    };

    const draw = (t: number) => {
      const gap = Math.max(16, w / 34);
      const sigma = w * 0.11;
      // Idle: the attention drifts on its own.
      const tx = pointer.active ? pointer.x : w * (0.5 + 0.28 * Math.sin(t / 2300));
      const ty = pointer.active ? pointer.y : h * (0.5 + 0.22 * Math.sin(t / 1700));
      const k = reduce ? 1 : 0.08;
      eased.x += (tx - eased.x) * k;
      eased.y += (ty - eased.y) * k;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - eased.x, dy = y - eased.y;
          const f = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
          const wave = reduce ? 0 : Math.sin(x * 0.02 + y * 0.015 + t / 900) * 0.5 + 0.5;
          const d = Math.hypot(dx, dy) || 1;
          const px = x + (dx / d) * f * gap * 0.9;
          const py = y + (dy / d) * f * gap * 0.9;
          const r = 0.9 + wave * 0.5 + f * 3.4;
          ctx.globalAlpha = 0.22 + wave * 0.12 + f * 0.66;
          ctx.fillStyle = f > 0.35 ? "#ffffff" : "#c9b6ff";
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce && !raf) raf = requestAnimationFrame(loop);
    });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
      if (reduce) draw(0);
    };
    const leave = () => (pointer.active = false);

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <Panel className="bg-deep">
      <div ref={wrap} className="absolute inset-0 touch-pan-y">
        <canvas ref={canvas} aria-hidden className="size-full" />
      </div>
      <p className="label pointer-events-none absolute bottom-[5%] left-[6%] text-white/50">Interactive — move across it</p>
    </Panel>
  );
}

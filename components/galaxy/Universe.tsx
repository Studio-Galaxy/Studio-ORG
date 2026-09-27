"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { capabilities } from "@/lib/content";
import { Pill } from "@/components/ui/Pill";

// The galaxy of development: disciplines as orbits, capabilities as planets.
// Pull planets into the core to compose an idea, then take it to the contact form.

type Planet = { name: string; ring: number; ang: number; r: number; state: 0 | 1 | 2; t: number; x: number; y: number; z: number; sx: number; sy: number };

const INK = "36,34,32";
const VIOLET = "116,71,255";
const SPEED = [0.00016, 0.00011, 0.00008, 0.00005]; // inner orbits turn faster
const ROT = -0.18;
const ease = [0.16, 1, 0.3, 1] as const;

export function Universe() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [picked, setPicked] = useState<string[]>([]);
  // the drawing loop reads the current idea through a ref, and is nudged when it changes
  const pickedRef = useRef<string[]>([]);
  const redraw = useRef<() => void>(() => {});
  useEffect(() => {
    pickedRef.current = picked;
    redraw.current();
  }, [picked]);

  useEffect(() => {
    const el = wrap.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace";
    const planets: Planet[] = capabilities.flatMap((c, ring) =>
      c.items.map((name, k) => ({ name, ring, ang: k * (Math.PI / 2) + ring * 0.8, r: 4 + ((k + ring) % 3) * 1.4, state: 0 as const, t: 0, x: 0, y: 0, z: 0, sx: 0, sy: 0 })),
    );
    const pointer = { x: -1e4, y: -1e4 };
    let w = 0, h = 0, dpr = 1, raf = 0, visible = false, hover = -1, pulse = 0, spin = 0, last = performance.now();
    let tilt = 0.4, small = false; // phones get a more open view so the orbits have room

    const radius = (ring: number) => (small ? w * 0.47 : Math.min(w * 0.47, h * 1.05)) * (0.3 + ring * 0.19);
    const cos = Math.cos(ROT), sin = Math.sin(ROT);
    const project = (ang: number, rx: number) => {
      const x = Math.cos(ang) * rx, y = Math.sin(ang) * rx * tilt;
      return [w / 2 + x * cos - y * sin, h / 2 + x * sin + y * cos, Math.sin(ang)] as const;
    };

    const resize = () => {
      dpr = Math.min(devicePixelRatio, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      small = w < 640;
      tilt = small ? 0.72 : 0.4;
      cv.width = w * dpr;
      cv.height = h * dpr;
      frame(performance.now());
    };

    const drawPlanet = (p: Planet, i: number) => {
      if (p.state === 2 && p.t < 0.05) return;
      const depth = 0.55 + 0.45 * ((p.z + 1) / 2);
      const hot = i === hover && p.state === 0;
      const shrink = p.state === 1 ? 1 - p.t : p.state === 2 ? p.t : 1;
      const size = p.r * (0.75 + 0.35 * depth) * shrink * (hot ? 1.5 : 1);
      const alpha = (p.state === 2 ? p.t : 1) * depth;
      const mine = pickedRef.current.includes(p.name);
      if (hot || mine) {
        ctx.strokeStyle = `rgba(${VIOLET},${hot ? 0.5 : 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(${hot || p.state === 1 ? VIOLET : INK},${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, size), 0, Math.PI * 2);
      ctx.fill();
      if ((w >= 640 || hot) && p.state === 0) {
        ctx.font = `${hot ? 600 : 400} ${hot ? 12 : 10}px ${font}`;
        ctx.fillStyle = `rgba(${hot ? VIOLET : INK},${hot ? 1 : 0.45 * depth})`;
        // flip the label to the left when it would run off the edge
        const tw = ctx.measureText(p.name).width;
        const right = p.x + size + 7 + tw < w - 8;
        ctx.fillText(p.name, right ? p.x + size + 7 : p.x - size - 7 - tw, p.y + 3.5);
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      if (!reduce) spin += dt;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      // orbits
      ctx.textAlign = "left";
      capabilities.forEach((_, ring) => {
        const rx = radius(ring);
        ctx.strokeStyle = `rgba(${INK},0.13)`;
        ctx.lineWidth = 1;
        ctx.setLineDash(ring === 3 ? [2, 5] : []);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, rx * tilt, ROT, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // move planets
      let animating = false;
      planets.forEach((p, i) => {
        const [ox, oy, z] = project(p.ang, radius(p.ring));
        if (p.state === 0) {
          // a little gravity toward the cursor, and time slows near it (easier to catch)
          const dx = pointer.x - ox, dy = pointer.y - oy, d = Math.hypot(dx, dy) || 1;
          if (!reduce) p.ang += dt * SPEED[p.ring] * (i === hover ? 0.05 : 0.15 + 0.85 * Math.min(1, d / 160));
          const pull = Math.max(0, 1 - d / 140) * (small ? 6 : 12);
          p.x = ox + (dx / d) * pull;
          p.y = oy + (dy / d) * pull;
          p.z = z;
        } else if (p.state === 1) {
          animating = true;
          p.t = Math.min(1, p.t + dt / 750);
          const e = p.t * p.t * p.t;
          p.x = p.sx + (cx - p.sx) * e;
          p.y = p.sy + (cy - p.sy) * e;
          p.z = 1;
          if (p.t >= 1) {
            p.state = 2;
            p.t = 0;
            pulse = 1;
            const name = p.name;
            setPicked((list) => (list.includes(name) ? list : [...list, name]));
          }
        } else {
          animating = true;
          p.t = Math.min(1, p.t + dt / 1800);
          p.x = ox;
          p.y = oy;
          p.z = z;
          if (p.t >= 1) p.state = 0;
        }
      });

      // back planets, core, front planets
      planets.forEach((p, i) => p.z < 0 && drawPlanet(p, i));

      const core = (small ? 15 : 24) + Math.min(pickedRef.current.length, 10) * (small ? 1 : 1.6);
      if (pulse > 0) {
        animating = true;
        pulse = Math.max(0, pulse - dt / 900);
        ctx.strokeStyle = `rgba(${VIOLET},${pulse * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, core + (1 - pulse) * 70, 0, Math.PI * 2);
        ctx.stroke();
      }
      const g = ctx.createRadialGradient(cx, cy, core * 0.5, cx, cy, core * 3.2);
      g.addColorStop(0, `rgba(${VIOLET},0.16)`);
      g.addColorStop(1, `rgba(${VIOLET},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(cx - core * 3.2, cy - core * 3.2, core * 6.4, core * 6.4);
      ctx.fillStyle = `rgb(${INK})`;
      ctx.beginPath();
      ctx.arc(cx, cy, core, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f7f0e7";
      ctx.lineWidth = Math.max(2.5, core * 0.13);
      ctx.beginPath();
      ctx.arc(cx, cy, core * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      const da = spin * 0.0009 - Math.PI / 4;
      ctx.fillStyle = "#9b7bff";
      ctx.beginPath();
      ctx.arc(cx + Math.cos(da) * core * 0.62, cy + Math.sin(da) * core * 0.62, core * 0.17, 0, Math.PI * 2);
      ctx.fill();

      planets.forEach((p, i) => p.z >= 0 && drawPlanet(p, i));

      raf = visible && (!reduce || animating) ? requestAnimationFrame(frame) : 0;
    };

    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const hit = (x: number, y: number) => {
      let best = -1, bd = 26;
      planets.forEach((p, i) => {
        if (p.state !== 0) return;
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      return best;
    };
    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const move = (e: PointerEvent) => {
      const [x, y] = local(e);
      pointer.x = x;
      pointer.y = y;
      hover = hit(x, y);
      el.style.cursor = hover >= 0 ? "pointer" : "";
      kick();
    };
    const leave = () => {
      pointer.x = pointer.y = -1e4;
      hover = -1;
      el.style.cursor = "";
      kick();
    };
    const down = (e: PointerEvent) => {
      const [x, y] = local(e);
      const i = hit(x, y);
      if (i < 0) return;
      const p = planets[i];
      p.state = 1;
      p.t = 0;
      p.sx = p.x;
      p.sy = p.y;
      hover = -1;
      kick();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    redraw.current = kick;
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
    };
  }, []);

  function prefill() {
    const idea = document.getElementById("idea") as HTMLTextAreaElement | null;
    if (!idea) return;
    const line = `I'm thinking about ${picked.join(", ")}.`;
    idea.value = idea.value ? `${idea.value}\n${line}` : line;
  }

  return (
    <section id="galaxy" aria-labelledby="galaxy-title" className="overflow-x-clip px-5 pb-8 pt-24 md:px-10 md:pt-40 lg:px-16">
      <div className="grid gap-8 md:grid-cols-12">
        <p className="label text-ink-2 md:col-span-3">The galaxy</p>
        <motion.h2
          id="galaxy-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.1, ease }}
          className="display text-[clamp(2.6rem,6.4vw,6.6rem)] md:col-span-9"
        >
          Different ideas.
          <br />
          <span className="text-ink-3">One universe.</span>
        </motion.h2>
      </div>

      <div className="relative mt-6 md:mt-4">
        <div ref={wrap} className="relative h-[50svh] min-h-[360px] touch-pan-y md:h-[72svh]">
          <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
          <p className="sr-only">
            An interactive map of what we build: {capabilities.map((c) => `${c.group}: ${c.items.join(", ")}`).join(". ")}.
          </p>
        </div>

        {/* the idea being built: a slim bar under the galaxy, never on top of it */}
        <div className="mx-auto mt-2 max-w-[860px]">
          <div className="rounded-[22px] bg-paper p-4 ring-1 ring-line md:flex md:min-h-[72px] md:items-center md:gap-6 md:px-6 md:py-3">
            <p className="label flex shrink-0 items-center justify-between gap-3 text-ink-2 md:flex-col md:items-start md:gap-1">
              Your idea
              {picked.length > 0 && <span className="text-ink-3">{`${picked.length} part${picked.length > 1 ? "s" : ""}`}</span>}
            </p>
            {picked.length === 0 ? (
              <p className="mt-2 text-[15px] leading-snug text-ink-2 md:mt-0">Tap any planet to pull it into your idea.</p>
            ) : (
              <ul className="mt-3 flex flex-1 flex-wrap gap-1.5 md:mt-0">
                <AnimatePresence initial={false} mode="popLayout">
                  {picked.map((name) => (
                    <motion.li
                      key={name}
                      layout
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <button
                        type="button"
                        onClick={() => setPicked((l) => l.filter((n) => n !== name))}
                        aria-label={`Remove ${name}`}
                        className="group flex cursor-pointer items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-cream transition-colors hover:bg-violet"
                      >
                        {name}
                        <span aria-hidden className="text-cream/50 group-hover:text-cream">×</span>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
            <AnimatePresence>
              {picked.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.5, ease }} className="shrink-0 overflow-hidden md:ml-auto">
                  <div className="pt-4 md:pt-0">
                    <Pill href="#form" onClick={prefill} className="px-5 py-3 text-[14px]">
                      Build this with us
                    </Pill>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </section>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Synth } from "./synth";

// Conceptual music app. The controls are real: the sound is synthesised live.

const TRACKS = [
  { title: "Low Orbit", side: "Side A — Night Drive", len: 232, art: ["#d8c9ff", "#7447ff", "#221b33"] },
  { title: "Event Horizon", side: "Side A — Deep Field", len: 198, art: ["#ffd1e6", "#e0457b", "#2a1420"] },
  { title: "First Light", side: "Side B — Dawn", len: 254, art: ["#d6f5ff", "#2f8fd8", "#10202b"] },
];
const BARS = 34;
const ease = [0.16, 1, 0.3, 1] as const;
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function PhoneScreen() {
  const root = useRef<HTMLDivElement>(null);
  const synth = useRef<Synth | null>(null);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(84);
  const pos = useRef(84); // exact playhead, read by the timer
  const setPos = (v: number) => {
    pos.current = v;
    setElapsed(v);
  };
  const [liked, setLiked] = useState<Set<number>>(() => new Set([0]));
  const track = TRACKS[i];

  const engine = () => (synth.current ??= new Synth());

  function go(to: number, d: number) {
    const n = (to + TRACKS.length) % TRACKS.length;
    setDir(d);
    setI(n);
    setPos(0);
    if (playing) engine().play(n, true);
  }

  function toggle() {
    if (playing) engine().pause();
    else engine().play(i, false);
    setPlaying(!playing);
  }

  function prev() {
    if (pos.current > 3) {
      setPos(0);
      if (playing) engine().play(i, true);
    } else go(i - 1, -1);
  }

  function seek(e: MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setPos(((e.clientX - r.left) / r.width) * track.len);
  }

  // clock + auto-advance; also stops the music once this screen is out of sight
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      const seen = root.current?.checkVisibility?.({ opacityProperty: true, visibilityProperty: true } as CheckVisibilityOptions) ?? true;
      if (!seen || document.hidden) {
        synth.current?.pause();
        setPlaying(false);
        return;
      }
      pos.current += dt;
      if (pos.current < track.len) return setElapsed(pos.current);
      // track finished: roll on to the next one
      const n = (i + 1) % TRACKS.length;
      pos.current = 0;
      setElapsed(0);
      setDir(1);
      setI(n);
      synth.current?.play(n, true);
    }, 100);
    return () => clearInterval(id);
  }, [playing, i, track.len]);

  useEffect(() => () => synth.current?.dispose(), []);

  const progress = Math.min(1, elapsed / track.len);
  const isLiked = liked.has(i);

  return (
    <div ref={root} className="flex h-full flex-col px-5 pb-3 pt-4 text-white">
      <div className="flex items-center justify-between px-2 text-[12px] font-semibold">
        <span>9:41</span>
        <span className="h-[22px] w-[78px] rounded-full bg-black" />
        <span className="flex gap-1">
          <span className="size-1.5 rounded-full bg-white" />
          <span className="size-1.5 rounded-full bg-white/60" />
        </span>
      </div>

      <p className="label mt-6 text-center text-white/45">{playing ? "Now playing" : "Paused"}</p>

      <motion.div
        animate={{ scale: playing ? 1 : 0.94 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="relative mt-5 aspect-square w-full overflow-hidden rounded-[22px] bg-[#1a1622] shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8)]"
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.svg
            key={i}
            viewBox="0 0 200 200"
            className="absolute inset-0 size-full"
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.6, ease }}
          >
            <defs>
              <radialGradient id={`art-${i}`} cx="0.62" cy="0.38">
                <stop offset="0" stopColor={track.art[0]} />
                <stop offset="0.35" stopColor={track.art[1]} />
                <stop offset="1" stopColor={track.art[2]} />
              </radialGradient>
            </defs>
            <rect width="200" height="200" fill={`url(#art-${i})`} />
            <g
              fill="none"
              stroke="#fff"
              strokeOpacity="0.35"
              className="animate-[spin_40s_linear_infinite] [transform-box:fill-box] [transform-origin:center]"
              style={{ animationPlayState: playing ? "running" : "paused" }}
            >
              {[30, 50, 70, 90, 110].map((r) => (
                <ellipse key={r} cx="124" cy="76" rx={r} ry={r * 0.42} transform={`rotate(${-24 + i * 18} 124 76)`} />
              ))}
            </g>
            <circle cx="124" cy="76" r="5" fill="#fff" />
          </motion.svg>
        </AnimatePresence>
      </motion.div>

      <div className="mt-5 flex items-end justify-between">
        <div className="relative h-[42px] min-w-0 flex-1 overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout" custom={dir}>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease }}
            >
              <p className="truncate text-[19px] font-semibold tracking-[-0.03em]">{track.title}</p>
              <p className="truncate text-[12px] text-white/50">{track.side}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.button
          type="button"
          aria-label={isLiked ? "Unlike" : "Like"}
          aria-pressed={isLiked}
          whileTap={{ scale: 0.8 }}
          onClick={() => setLiked((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; })}
          className="cursor-pointer p-1"
        >
          <motion.svg key={`${i}-${isLiked}`} viewBox="0 0 24 24" className="size-5" initial={{ scale: isLiked ? 0.6 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}>
            <path
              d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"
              fill={isLiked ? "#d8c9ff" : "none"}
              stroke={isLiked ? "#d8c9ff" : "rgb(255 255 255 / 0.5)"}
              strokeWidth="1.6"
            />
          </motion.svg>
        </motion.button>
      </div>

      <button type="button" aria-label="Seek" onClick={seek} className="group mt-4 flex h-8 cursor-pointer items-center gap-[3px]">
        {Array.from({ length: BARS }, (_, b) => (
          <span
            key={b}
            className={`w-full origin-center rounded-full transition-colors duration-300 ${b / BARS < progress ? "bg-white" : "bg-white/25 group-hover:bg-white/35"}`}
            style={{
              height: `${30 + (((b + i * 7) * 37) % 70)}%`,
              animation: `wave ${0.9 + (b % 5) * 0.18}s ease-in-out ${b * -0.07}s infinite`,
              animationPlayState: playing ? "running" : "paused",
            }}
          />
        ))}
      </button>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] tabular-nums text-white/40">
        <span>{clock(elapsed)}</span>
        <span>{clock(track.len)}</span>
      </div>

      <div className="mt-auto flex items-center justify-center gap-10 pb-4">
        <Ctrl label="Previous track" onClick={prev}>
          <Skip flip />
        </Ctrl>
        <motion.button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={toggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="relative flex size-14 cursor-pointer items-center justify-center rounded-full bg-white"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={playing ? "pause" : "play"}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {playing ? (
                <span className="flex gap-[5px]">
                  <span className="h-[18px] w-[5px] rounded-sm bg-[#141217]" />
                  <span className="h-[18px] w-[5px] rounded-sm bg-[#141217]" />
                </span>
              ) : (
                <span className="ml-1 border-y-[9px] border-l-[14px] border-y-transparent border-l-[#141217]" />
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <Ctrl label="Next track" onClick={() => go(i + 1, 1)}>
          <Skip />
        </Ctrl>
      </div>
      <span className="mx-auto h-1 w-28 rounded-full bg-white/60" />
    </div>
  );
}

function Ctrl({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button type="button" aria-label={label} onClick={onClick} whileTap={{ scale: 0.8 }} className="cursor-pointer rounded-full p-1 opacity-90 transition-opacity hover:opacity-100">
      {children}
    </motion.button>
  );
}

function Skip({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-6 fill-white ${flip ? "-scale-x-100" : ""}`}>
      <path d="M4 5 L14 12 L4 19 Z M13 5 L23 12 L13 19 Z" />
    </svg>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// Reads the visitor's own browser, live, so the policy can show rather than promise.

type Reading = { cookies: number; thirdParty: number; stored: number };

function read(): Reading {
  const cookies = document.cookie ? document.cookie.split(";").filter((c) => c.trim()).length : 0;
  const thirdParty = [...document.querySelectorAll<HTMLScriptElement>("script[src]")].filter(
    (s) => new URL(s.src, location.href).origin !== location.origin,
  ).length;
  let stored = 0;
  try {
    stored = localStorage.length + sessionStorage.length;
  } catch {
    stored = 0; // storage blocked: nothing can be stored either
  }
  return { cookies, thirdParty, stored };
}

const ease = [0.16, 1, 0.3, 1] as const;

export function LiveReadout() {
  const [r, setR] = useState<Reading | null>(null);
  const [scan, setScan] = useState(0);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setR(read()), 600); // a beat, so the scan reads as a scan
    return () => clearTimeout(t);
  }, [scan]);

  function recheck() {
    setR(null);
    setCleared(false);
    setScan((s) => s + 1);
  }

  function clear() {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
    setCleared(true);
    setR(null);
    setScan((s) => s + 1);
  }

  const rows = [
    { label: "Cookies on this site", value: r?.cookies },
    { label: "Third-party scripts loaded", value: r?.thirdParty },
    { label: "Things saved in your browser", value: r?.stored },
  ];

  return (
    <div className="rounded-[28px] bg-ink p-6 text-cream md:rounded-[40px] md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label flex items-center gap-2 text-cream/60">
          <span className={`size-1.5 rounded-full ${r ? "bg-lavender" : "animate-pulse bg-cream/60"}`} />
          {r ? "Read live from your browser" : "Reading your browser…"}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={recheck} className="cursor-pointer rounded-full bg-cream/10 px-4 py-2 text-[13px] transition-colors hover:bg-cream/20">
            Check again
          </button>
          <button type="button" onClick={clear} className="cursor-pointer rounded-full bg-cream/10 px-4 py-2 text-[13px] transition-colors hover:bg-cream/20">
            Clear anything stored
          </button>
        </div>
      </div>

      <dl className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-6">
        {rows.map((row, i) => (
          <div key={row.label} className="border-t border-cream/15 pt-5">
            <dt className="text-[14px] text-cream/60">{row.label}</dt>
            <dd className="relative mt-3 h-[clamp(4rem,9vw,7.5rem)] overflow-hidden text-[clamp(4rem,9vw,7.5rem)] font-semibold leading-none tracking-[-0.05em]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={row.value === undefined ? `scan-${scan}` : `v-${scan}`}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                  className={`block ${row.value === 0 ? "text-lavender" : ""}`}
                >
                  {row.value === undefined ? "·" : row.value}
                </motion.span>
              </AnimatePresence>
            </dd>
          </div>
        ))}
      </dl>

      <p aria-live="polite" className="mt-10 max-w-2xl text-[15px] leading-relaxed text-cream/70">
        {!r
          ? "Counting…"
          : cleared
            ? "Cleared. Anything this site could have stored in your browser is gone."
            : r.cookies + r.thirdParty + r.stored === 0
              ? "Nothing. We don't set cookies, load trackers or save anything about you. The galaxy, the music player and the rest all run in your browser and forget you when you leave."
              : "Anything counted here wasn't put there by this site — it can come from your browser, an extension, or another site on the same address. You can clear it with the button above."}
      </p>
    </div>
  );
}

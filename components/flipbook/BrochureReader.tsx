"use client";

import { AnimatePresence, motion } from "motion/react";
import { SGFlipBook, argb, useFlipBookController, useFlipBookValue, type SGFlipBookMode } from "@studio-galaxy/sg-flipbook/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { brochure } from "@/lib/content";

// The SDK draws only the pages. Everything around them is the story:
// the room takes the light of the pages, a narrator follows the chapters,
// the book breathes on every turn, and the last page hands over to us.

const SOURCE = { url: brochure.url }; // stable: a new object would reopen the book
const THEME = {
  pageBackColor: argb(0xfff7f0e7),
  placeholderColor: argb(0xffefe6da),
  placeholderDotColor: argb(0x1f242220),
  curlShadowColor: argb(0x2e1b1428),
  spineShadowColor: argb(0x22000000),
  pageTurnDuration: 420,
};
const DARK = new Set(brochure.darkPages);
const ROOM = { light: "#e9dfd1", dark: "#050407" }; // a shade deeper than the dark pages, so the book keeps its edge
const ease = [0.16, 1, 0.3, 1] as const;

// Full screen, with the older webkit names Safari still uses.
type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitFullscreenEnabled?: boolean; webkitExitFullscreen?: () => void };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => void };
const fsDoc = () => document as FsDoc;
const fsElement = () => fsDoc().fullscreenElement ?? fsDoc().webkitFullscreenElement ?? null;
const onFsChange = (cb: () => void) => {
  document.addEventListener("fullscreenchange", cb);
  document.addEventListener("webkitfullscreenchange", cb);
  return () => {
    document.removeEventListener("fullscreenchange", cb);
    document.removeEventListener("webkitfullscreenchange", cb);
  };
};
const noop = () => () => {};

// The book as it's read: the cover alone, pages in pairs, the back alone. The rail has one segment per spread.
const PAGE_COUNT = 12;
const spreads = (n: number) => {
  const out: number[][] = [[0]];
  for (let p = 1; p < n; p += 2) out.push(p + 1 < n ? [p, p + 1] : [p]);
  return out;
};

const chapterAt = (page: number) => brochure.chapters.findLastIndex((c) => c.from <= page);
const pad = (n: number) => String(n).padStart(2, "0");

export function BrochureReader() {
  const controller = useFlipBookController();
  const load = useFlipBookValue(controller.loadState);
  const visible = useFlipBookValue(controller.visiblePages);
  const [mode, setMode] = useState<SGFlipBookMode>("auto");
  const [sound, setSound] = useState(true);
  const [download, setDownload] = useState(0);
  const [turned, setTurned] = useState(false);
  const [beat, setBeat] = useState(0); // bumps on every settled turn
  const stage = useRef<HTMLElement>(null);
  // iPhone Safari can't make a section full screen: then the button stays hidden
  const canFull = useSyncExternalStore(noop, () => !!(fsDoc().fullscreenEnabled || fsDoc().webkitFullscreenEnabled), () => false);
  const full = useSyncExternalStore(onFsChange, () => fsElement() !== null && fsElement() === stage.current, () => false);

  function toggleFull() {
    if (fsElement()) {
      if (document.exitFullscreen) void document.exitFullscreen();
      else fsDoc().webkitExitFullscreen?.();
      return;
    }
    const el = stage.current as FsEl | null;
    if (el?.requestFullscreen) void el.requestFullscreen();
    else el?.webkitRequestFullscreen?.();
  }

  const total = load.status === "ready" ? load.pageCount : 0;
  const first = visible[0] ?? 0;
  const last = visible[visible.length - 1] ?? 0;
  const leftDark = DARK.has(first);
  const rightDark = DARK.has(last);
  const chapter = chapterAt(first);
  const atStart = first === 0;
  const atEnd = total > 0 && last === total - 1;

  // ← → Home End, F for full screen
  const toggleFullRef = useRef(toggleFull);
  useEffect(() => {
    toggleFullRef.current = toggleFull;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, select")) return;
      const act = {
        ArrowRight: controller.nextPage,
        ArrowLeft: controller.previousPage,
        Home: () => controller.jumpTo(0),
        End: () => controller.jumpTo((controller.pageCount ?? 1) - 1),
        f: toggleFullRef.current,
        F: toggleFullRef.current,
      }[e.key];
      if (!act) return;
      e.preventDefault();
      act();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [controller]);

  const tone = (dark: boolean) => (dark ? "text-cream" : "text-ink");
  const soft = (dark: boolean) => (dark ? "text-cream/55" : "text-ink-2");

  return (
    <section ref={stage} id="book" aria-label="Studio Galaxy brochure — an interactive flipbook" className="relative h-[100svh] min-h-[620px] overflow-hidden">
      {/* the room takes the light of the pages */}
      <motion.div aria-hidden className="absolute inset-y-0 left-0 w-1/2" initial={false} animate={{ backgroundColor: leftDark ? ROOM.dark : ROOM.light }} transition={{ duration: 1.1, ease }} />
      <motion.div aria-hidden className="absolute inset-y-0 right-0 w-[calc(50%+1px)]" initial={false} animate={{ backgroundColor: rightDark ? ROOM.dark : ROOM.light }} transition={{ duration: 1.1, ease }} />

      {/* the book breathes on every turn */}
      <motion.div
        key={beat}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[46%] size-[78vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(116_71_255/0.2),rgb(116_71_255/0.05)_45%,transparent_68%)]"
        initial={{ scale: 0.92, opacity: 0.5 }}
        animate={{ scale: 1.06, opacity: 1 }}
        transition={{ duration: 1.6, ease }}
      />

      {/* the pages */}
      <div className={`absolute inset-x-3 bottom-[11.5rem] md:inset-x-28 md:bottom-[10.5rem] ${full ? "top-6 md:top-8" : "top-24 md:top-28"}`}>
        <SGFlipBook
          source={SOURCE}
          controller={controller}
          mode={mode}
          pageTurnSound={sound}
          theme={THEME}
          onPageChanged={() => {
            setTurned(true);
            setBeat((b) => b + 1);
          }}
          onDownloadProgress={setDownload}
        />

        <AnimatePresence>
          {load.status === "loading" && (
            <motion.div key="loading" exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-ink">
              <span className="relative flex size-3">
                <span className="absolute -inset-6 animate-ping rounded-full bg-violet/20" />
                <span className="size-3 rounded-full bg-violet shadow-[0_0_18px_4px_rgb(116_71_255/0.6)]" />
              </span>
              <p className="label text-ink-2">Opening the book{download > 0 && download < 1 ? ` · ${Math.round(download * 100)}%` : "…"}</p>
            </motion.div>
          )}
          {load.status === "failed" && (
            <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center text-ink">
              <p className="display text-[clamp(1.8rem,3.4vw,3rem)]">The book didn’t open.</p>
              <p className="max-w-sm text-[15px] text-ink-2">
                {load.error.kind === "renderer" ? "Your browser can’t draw it (it needs WebGL2). The PDF still works." : "Check your connection and try again."}
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={controller.retry} className="cursor-pointer rounded-full bg-ink px-5 py-2.5 text-[14px] text-cream">Try again</button>
                <a href={brochure.url} download className="rounded-full bg-cream-2 px-5 py-2.5 text-[14px]">Download the PDF</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* first-time hint: a cursor shows the corner drag */}
        <AnimatePresence>
          {load.status === "ready" && !turned && (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.2 } }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute bottom-6 right-[8%] flex items-center gap-3"
            >
              <span className="label rounded-full bg-paper/90 px-3 py-1.5 text-ink-2 shadow-sm">Drag the corner — or press →</span>
              <motion.svg
                viewBox="0 0 16 20"
                className="w-4 drop-shadow"
                animate={{ x: [0, -70, -70, 0], y: [0, -26, -26, 0], opacity: [1, 1, 0, 0] }}
                transition={{ duration: 2.6, times: [0, 0.55, 0.75, 1], repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M1 1 L15 11 L8.5 12 L5 19 Z" fill="#242220" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* side arrows */}
      {(["prev", "next"] as const).map((dir) => {
        const isPrev = dir === "prev";
        const dark = isPrev ? leftDark : rightDark;
        const disabled = load.status !== "ready" || (isPrev ? atStart : atEnd);
        return (
          <motion.button
            key={dir}
            type="button"
            aria-label={isPrev ? "Previous page" : "Next page"}
            disabled={disabled}
            onClick={isPrev ? controller.previousPage : controller.nextPage}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-[46%] hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[18px] transition-[background-color,color,opacity] duration-500 disabled:cursor-default disabled:opacity-0 md:flex ${
              isPrev ? "left-8" : "right-8"
            } ${dark ? "bg-cream/10 text-cream hover:bg-cream/20" : "bg-ink/5 text-ink hover:bg-ink/10"}`}
          >
            {isPrev ? "←" : "→"}
          </motion.button>
        );
      })}

      {/* the end hands over to us */}
      <AnimatePresence>
        {atEnd && (
          <motion.div
            key="end"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.9, ease } }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-x-4 bottom-[12.5rem] z-10 md:inset-x-auto md:bottom-auto md:right-[9%] md:top-1/2 md:w-[340px] md:-translate-y-1/2"
          >
            <div className="rounded-[22px] bg-paper p-5 text-ink md:rounded-[26px] md:p-6 shadow-[0_30px_60px_-30px_rgb(36_34_32/0.5)] ring-1 ring-line">
              <p className="label text-violet">You’ve reached the end</p>
              <p className="display mt-2 text-[clamp(1.5rem,2.6vw,2.4rem)] md:mt-3">Want a flipbook like this?</p>
              <p className="mt-3 hidden text-[15px] leading-snug text-ink-2 md:block">Catalogues, menus, magazines, reports — turned into books people enjoy opening.</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 md:mt-6">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full load so the home page glides to #contact */}
                <a href="/#contact" className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-cream transition-colors hover:bg-black">
                  Let’s build yours <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
                <button type="button" onClick={() => controller.jumpTo(0)} className="link-line cursor-pointer text-[14px] text-ink-2">
                  Read again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* narrator, counter, controls, story rail */}
      <div className="absolute inset-x-4 bottom-5 md:inset-x-10 md:bottom-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className={`min-w-0 transition-colors duration-700 ${tone(leftDark)}`} aria-live="polite">
            <p className={`label mb-2 transition-colors duration-700 ${soft(leftDark)}`}>
              {pad(chapter + 1)} — {brochure.chapters[chapter]?.title}
            </p>
            <div className="h-[clamp(1.9rem,3vw,2.8rem)] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={chapter}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.8, ease }}
                  className="display truncate text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.15]"
                >
                  {brochure.chapters[chapter]?.line}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className={`flex shrink-0 items-center gap-2 transition-colors duration-700 ${tone(rightDark)}`}>
            <span className={`label mr-2 hidden tabular-nums sm:inline ${soft(rightDark)}`}>
              {total ? `${visible.map((p) => pad(p + 1)).join("–")} / ${pad(total)}` : "—"}
            </span>
            <span className="hidden md:contents">
              <Toggle dark={rightDark} on={mode === "auto"} onClick={() => setMode(mode === "auto" ? "single" : "auto")}>
                {mode === "auto" ? "Spread" : "Single"}
              </Toggle>
            </span>
            <Toggle dark={rightDark} on={sound} onClick={() => setSound(!sound)} label={sound ? "Turn page sound off" : "Turn page sound on"}>
              {sound ? "Sound on" : "Sound off"}
            </Toggle>
            {canFull && (
              <Toggle dark={rightDark} on={full} onClick={toggleFull} label={full ? "Exit full screen" : "View full screen"}>
                {full ? "Exit full screen" : "Full screen"}
              </Toggle>
            )}
            <a
              href={brochure.url}
              download
              className={`rounded-full px-3 py-1.5 text-[12px] transition-colors ${rightDark ? "bg-cream/10 hover:bg-cream/20" : "bg-ink/5 hover:bg-ink/10"}`}
            >
              PDF ↓
            </a>
          </div>
        </div>

        <nav aria-label="Chapters" className="mt-4 flex gap-1.5">
          {spreads(total || PAGE_COUNT).map((pages, i, all) => {
            const start = pages[0];
            const end = pages[pages.length - 1];
            const title = brochure.chapters.filter((c) => c.from >= start && c.from <= end).map((c) => c.title).join(" · ");
            // how much of this spread has been seen: one segment fills per turn
            const fill = last >= end ? 1 : last >= start ? (last - start + 1) / pages.length : 0;
            const dark = i < all.length / 2 ? leftDark : rightDark;
            return (
              <button
                key={start}
                type="button"
                title={title}
                aria-label={`${title}, page ${start + 1}`}
                aria-current={first <= end && last >= start ? "step" : undefined}
                onClick={() => controller.jumpTo(start)}
                disabled={load.status !== "ready"}
                className="group relative h-5 cursor-pointer"
                style={{ flex: pages.length }}
              >
                <span className={`absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full transition-colors duration-700 ${dark ? "bg-cream/15" : "bg-ink/10"}`}>
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full bg-violet"
                    initial={false}
                    animate={{ width: `${fill * 100}%` }}
                    transition={{ duration: 0.8, ease }}
                  />
                </span>
                <span className={`absolute inset-x-0 top-1/2 h-[7px] -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${dark ? "bg-cream/10" : "bg-ink/5"}`} />
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}

function Toggle({ on, dark, onClick, label, children }: { on: boolean; dark: boolean; onClick: () => void; label?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-colors ${dark ? "bg-cream/10 hover:bg-cream/20" : "bg-ink/5 hover:bg-ink/10"}`}
    >
      <span className={`size-1.5 rounded-full transition-colors ${on ? "bg-violet" : dark ? "bg-cream/30" : "bg-ink/25"}`} />
      {children}
    </button>
  );
}

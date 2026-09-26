"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";
import { LogoMark } from "@/components/ui/Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6">
      <nav
        aria-label="Primary"
        className={`pointer-events-auto flex w-full items-center justify-between rounded-full transition-all duration-700 ease-out-expo ${
          scrolled
            ? "max-w-[640px] border border-line bg-cream/75 py-2 pl-3 pr-2 shadow-[0_10px_40px_-20px_rgb(36_34_32/0.35)] backdrop-blur-xl"
            : "max-w-[1440px] border border-transparent py-3 pl-1 pr-1 md:px-4"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5 text-ink" aria-label={`${site.name}, back to top`}>
          <LogoMark className="size-7" />
          <span className="text-[17px] font-semibold tracking-[-0.03em]">{site.name}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3.5 py-2 text-[14px] text-ink-2 transition-colors duration-300 hover:bg-ink/5 hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-cream md:hidden"
        >
          Menu
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-auto fixed inset-0 z-50 flex flex-col bg-cream px-6 pb-10 pt-5"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <LogoMark className="size-7" />
                <span className="text-[17px] font-semibold tracking-[-0.03em]">{site.name}</span>
              </span>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-cream-2 px-4 py-2 text-[13px] font-medium" autoFocus>
                Close
              </button>
            </div>
            <ul className="mt-auto space-y-1">
              {nav.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="display block py-1 text-[15vw] leading-[1]">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href={`mailto:${site.email}`} className="mt-10 text-[15px] text-ink-2">{site.email}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

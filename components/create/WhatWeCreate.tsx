"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { create } from "@/lib/content";
import { DesignVisual } from "./DesignVisual";
import { EngineerVisual } from "./EngineerVisual";
import { AliveVisual } from "./AliveVisual";
import { AutomateVisual } from "./AutomateVisual";

const visuals: ReactNode[] = [<DesignVisual key="d" />, <EngineerVisual key="e" />, <AliveVisual key="a" />, <AutomateVisual key="m" />];
const ease = [0.16, 1, 0.3, 1] as const;

export function WhatWeCreate() {
  return (
    <section id="create" aria-labelledby="create-title" className="scroll-mt-10 px-5 py-24 md:px-10 md:py-40 lg:px-16">
      <h2 id="create-title" className="label mb-16 text-ink-2 md:mb-28">
        What we create
      </h2>

      <div className="space-y-28 md:space-y-48">
        {create.map((c, i) => (
          <article key={c.verb} className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.1, ease }}
              className={`md:col-span-5 ${i % 2 ? "md:order-2 md:col-start-8" : ""}`}
            >
              <p className="label mb-6 flex items-center gap-3 text-ink-2">
                <span className="size-1.5 rounded-full bg-violet" />
                {`0${i + 1}`} <span className="text-ink">{c.verb}</span>
              </p>
              <h3 className="display text-[clamp(2.5rem,5.4vw,5.6rem)]">{c.line}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 60 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.3, ease }}
              className={`md:col-span-7 ${i % 2 ? "md:order-1 md:col-start-1" : ""}`}
            >
              {visuals[i]}
            </motion.div>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/actions";
import { Pill } from "@/components/ui/Pill";

const input =
  "peer w-full border-b border-ink/20 bg-transparent pb-3 pt-1 text-[clamp(1.2rem,1.8vw,1.6rem)] tracking-[-0.02em] outline-none transition-colors duration-300 placeholder:text-ink-3 focus:border-ink focus-visible:outline-none";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, null);

  return (
    <div id="form" className="scroll-mt-28">
      <AnimatePresence mode="wait">
        {state?.ok ? (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-10" role="status">
            <p className="display text-[clamp(2.2rem,4.5vw,4.4rem)]">
              Thank you<span className="text-violet">.</span>
            </p>
            <p className="mt-4 text-[17px] text-ink-2">We read every message. You&apos;ll hear from us soon.</p>
          </motion.div>
        ) : (
          <motion.form key="form" action={action} exit={{ opacity: 0, y: -20 }} className="grid gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12">
            <Field label="Name" id="name">
              <input id="name" name="name" required autoComplete="name" placeholder="Your name" className={input} />
            </Field>
            <Field label="Email" id="email">
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={input} />
            </Field>
            <Field label="Company (optional)" id="company" className="md:col-span-2">
              <input id="company" name="company" autoComplete="organization" placeholder="Where you work, if anywhere" className={input} />
            </Field>
            <Field label="Tell us about your idea" id="idea" className="md:col-span-2">
              <textarea id="idea" name="idea" required rows={4} placeholder="What are you imagining?" className={`${input} resize-none [field-sizing:content] min-h-[7rem]`} />
            </Field>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            <div className="flex flex-col-reverse items-start gap-6 md:col-span-2 md:flex-row md:items-center md:justify-between">
              <p aria-live="polite" className="text-[15px] text-ink-2">
                {state?.error ?? "We usually reply within a few days."}
              </p>
              <Pill type="submit" disabled={pending}>
                {pending ? "Sending…" : "Send message"}
              </Pill>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, id, className = "", children }: { label: string; id: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label mb-3 block text-ink-2">
        {label}
      </label>
      {children}
    </div>
  );
}

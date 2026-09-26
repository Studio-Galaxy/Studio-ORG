"use server";

import { site } from "@/lib/content";

export type ContactState = { ok: boolean; error?: string } | null;

const field = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);

export async function sendMessage(_: ContactState, fd: FormData): Promise<ContactState> {
  if (fd.get("website")) return { ok: true }; // honeypot: bots fill every field

  const name = field(fd, "name", 200);
  const email = field(fd, "email", 200);
  const company = field(fd, "company", 200);
  const idea = field(fd, "idea", 5000);
  if (!name || !idea || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Add your name, a valid email and a few words about your idea." };
  }

  const key = process.env.RESEND_API_KEY;
  const fallback = { ok: false, error: `That didn't go through. Write to us directly at ${site.email}.` };
  if (!key) {
    if (process.env.NODE_ENV === "production") return fallback;
    console.info("[contact] RESEND_API_KEY not set — message not sent:", { name, email, company, idea });
    return { ok: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? `Studio Galaxy <site@${site.domain}>`,
      to: process.env.CONTACT_TO ?? site.email,
      reply_to: email,
      subject: `New idea from ${name}${company ? ` (${company})` : ""}`,
      text: `${name} <${email}>${company ? `\n${company}` : ""}\n\n${idea}`,
    }),
  }).catch(() => null);

  return res?.ok ? { ok: true } : fallback;
}

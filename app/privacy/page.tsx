import type { Metadata } from "next";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/footer/Footer";
import { Rise } from "@/components/ui/Reveal";
import { LiveReadout } from "@/components/privacy/LiveReadout";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy — Studio Galaxy",
  description: "Privacy, in plain sight. No cookies, no trackers — only what you choose to tell us.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "10 October 2026";

// Each section leads with the promise, then the plain detail.
const SECTIONS: { title: string; promise: string; body: React.ReactNode }[] = [
  {
    title: "What we collect",
    promise: "Only what you tell us.",
    body: (
      <>
        <p>
          The contact form is the only place this site collects anything: your <b>name</b>, your <b>email</b>, your <b>company</b> if you add it, and
          the <b>message</b> you write. If you pull planets into &ldquo;Your idea&rdquo;, they are only added to your message text — nothing is sent until
          you press <i>Send message</i>.
        </p>
      </>
    ),
  },
  {
    title: "What we don’t",
    promise: "Nothing behind your back.",
    body: (
      <ul>
        <li>No cookies, of any kind.</li>
        <li>No analytics, ad trackers, pixels or fingerprinting.</li>
        <li>No third-party scripts — our fonts are served from our own site.</li>
        <li>No profiles, no selling, no sharing for marketing.</li>
        <li>The galaxy, the music player and the other demos run entirely in your browser and keep nothing.</li>
      </ul>
    ),
  },
  {
    title: "How your message travels",
    promise: "Straight to our inbox.",
    body: <Journey />,
  },
  {
    title: "Who else sees it",
    promise: "Only the people who help deliver it.",
    body: (
      <p>
        We use an email delivery service (Resend) to pass your message to our inbox, and a hosting provider to run this website. Like any web server,
        the host may keep short-lived technical logs — such as IP address and time of request — to keep the site secure and working. Neither uses your
        message for anything else.
      </p>
    ),
  },
  {
    title: "How long we keep it",
    promise: "Not forever.",
    body: (
      <p>
        We keep your message while we&rsquo;re talking with you, and for as long as a project or its paperwork needs it. When it&rsquo;s no longer
        needed, we delete it — at the latest two years after we last heard from you.
      </p>
    ),
  },
  {
    title: "Your rights",
    promise: "Ask, and it’s done.",
    body: (
      <p>
        You can ask us what we hold about you, to correct it, or to delete it — just email{" "}
        <a href={`mailto:${site.email}`} className="link-line text-ink">
          {site.email}
        </a>
        . We&rsquo;ll reply within 30 days. Depending on where you live (for example the EU, UK or California), you may have further rights, including
        the right to complain to your local data protection authority.
      </p>
    ),
  },
  {
    title: "Changes",
    promise: "If it changes, you’ll see it here.",
    body: <p>If we ever change how we handle data, we&rsquo;ll update this page and the date at the top before it takes effect.</p>,
  },
];

function Journey() {
  const steps = ["Your browser", "Our server", "Email delivery", "Our inbox"];
  return (
    <div>
      <ol aria-label="The journey of a contact message" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s} className="relative rounded-2xl bg-paper p-4 ring-1 ring-line">
            <span className="font-mono text-[10px] text-ink-3">{`0${i + 1}`}</span>
            <span className="mt-2 block text-[15px] font-medium text-ink">{s}</span>
            {i < steps.length - 1 && (
              <svg aria-hidden viewBox="0 0 24 8" className="absolute -right-3 top-1/2 z-10 hidden w-6 -translate-y-1/2 md:block">
                <path d="M0 4 H24" stroke="#7447ff" strokeWidth="1.5" className="anim-flow" />
              </svg>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-5">
        Every step is encrypted in transit (HTTPS). Our server only checks that the form is complete before handing it to the email service — it
        doesn&rsquo;t store a copy.
      </p>
    </div>
  );
}

export default function Privacy() {
  return (
    <>
      <Nav />
      <main>
        <section id="top" className="px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48 lg:px-16">
          <p className="label mb-8 text-ink-2">Privacy · Updated {UPDATED}</p>
          <h1 className="display text-[clamp(3.1rem,10vw,10.5rem)]">
            Privacy, in
            <br />
            plain sight<span className="text-violet">.</span>
          </h1>
          <p className="mt-10 max-w-xl text-[clamp(1.15rem,1.6vw,1.45rem)] leading-snug tracking-[-0.02em] text-ink-2">
            Most policies ask you to trust them. We&rsquo;d rather show you. Here is everything this site knows about you right now.
          </p>
        </section>

        <section aria-label="What this site knows about you" className="px-5 md:px-10 lg:px-16">
          <Rise>
            <LiveReadout />
          </Rise>
        </section>

        <section aria-label="Privacy policy" className="px-5 pb-24 pt-24 md:px-10 md:pb-40 md:pt-40 lg:px-16">
          <div className="border-b border-line">
            {SECTIONS.map((s, i) => (
              <Rise key={s.title}>
                <article className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-8 md:py-20">
                  <div className="md:col-span-4">
                    <p className="label flex items-center gap-3 text-ink-2">
                      <span className="text-violet">{`0${i + 1}`}</span>
                      {s.title}
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <h2 className="display text-[clamp(2rem,4.4vw,4.4rem)]">{s.promise}</h2>
                    <div className="mt-6 max-w-2xl space-y-4 text-[16px] leading-relaxed text-ink-2 md:mt-8 md:text-[17px] [&_b]:font-medium [&_b]:text-ink [&_ul>li]:relative [&_ul>li]:pl-5 [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.7em] [&_ul>li]:before:size-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-violet [&_ul]:space-y-2">
                      {s.body}
                    </div>
                  </div>
                </article>
              </Rise>
            ))}
          </div>

          <Rise className="mt-24 md:mt-32">
            <p className="display text-[clamp(2.4rem,6vw,6rem)]">
              Questions? <span className="text-ink-3">Just ask.</span>
            </p>
            <a href={`mailto:${site.email}`} className="link-line mt-6 inline-block text-[clamp(1.2rem,1.8vw,1.6rem)] font-medium tracking-[-0.02em]">
              {site.email}
            </a>
          </Rise>
        </section>
      </main>
      <Footer />
    </>
  );
}

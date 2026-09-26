import { nav, site } from "@/lib/content";
import { LogoMark } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="px-5 pb-10 pt-10 md:px-10 lg:px-16">
      <div className="grid gap-12 border-t border-line pt-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="flex items-center gap-2.5">
            <LogoMark className="size-7" />
            <span className="text-[19px] font-semibold tracking-[-0.03em]">{site.name}</span>
          </p>
          <p className="mt-4 text-[15px] text-ink-2">{site.tagline}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <ul className="space-y-2 text-[15px]">
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-line">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2 text-[15px] md:col-span-3">
          <a href={`mailto:${site.email}`} className="link-line block w-fit">{site.email}</a>
          <a href={`https://${site.domain}`} className="link-line block w-fit text-ink-2">{site.domain}</a>
        </div>
      </div>
      <div className="mt-16 flex items-center justify-between text-[13px] text-ink-3">
        <p>© 2026 {site.name}</p>
        <a href="#top" className="link-line">Back to top ↑</a>
      </div>
    </footer>
  );
}

import type { ReactNode } from "react";

// One tiny live demonstration per capability. CSS/SVG only, all decorative.

const I = "#242220", V = "#7447ff";

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 160 110" className="size-full" fill="none">
    {children}
  </svg>
);

function ProductDesign() {
  return svg(
    <>
      {[16, 64, 112].map((x, i) => (
        <g key={x}>
          <rect x={x} y="22" width="32" height="58" rx="7" stroke={I} strokeOpacity="0.5" />
          <rect x={x + 6} y="30" width="20" height="4" rx="2" fill={I} opacity={0.6} />
          <rect x={x + 6} y="40" width={[14, 20, 10][i]} height="3" rx="1.5" fill={I} opacity="0.2" />
          <rect x={x + 6} y="64" width="20" height="8" rx="4" fill={i === 2 ? V : I} opacity={i === 2 ? 1 : 0.15} />
        </g>
      ))}
      <path d="M48 51 H64 M96 51 H112" stroke={V} strokeWidth="1.5" className="anim-flow" />
    </>,
  );
}

function UiUx() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <span className="relative rounded-full bg-ink px-5 py-2 text-[12px] font-medium text-cream">
        Continue
        <span className="absolute inset-0 animate-ping rounded-full bg-violet/40 [animation-duration:2.6s]" />
      </span>
      <svg viewBox="0 0 16 20" className="absolute left-[56%] top-[52%] w-3.5 animate-[ux-cursor_2.6s_ease-in-out_infinite] drop-shadow">
        <path d="M1 1 L15 11 L8.5 12 L5 19 Z" fill={I} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function DesignSystems() {
  return (
    <div className="flex size-full flex-col justify-center gap-3 px-6">
      <div className="flex gap-2">
        {["bg-ink", "bg-violet", "bg-lavender", "bg-cream-2"].map((c, i) => (
          <span key={c} className={`size-7 rounded-lg ring-1 ring-line ${c} ${i === 1 ? "animate-pulse" : ""}`} />
        ))}
      </div>
      <div className="flex items-baseline gap-2 font-semibold tracking-[-0.04em]">
        <span className="text-[22px]">Aa</span>
        <span className="text-[16px]">Aa</span>
        <span className="text-[12px]">Aa</span>
        <span className="ml-auto font-mono text-[9px] font-normal tracking-normal text-ink-3">--radius · 8 · 16</span>
      </div>
    </div>
  );
}

function Motion() {
  return (
    <div className="relative size-full">
      {svg(<path d="M22 86 C52 86 58 24 138 24" stroke={I} strokeOpacity="0.25" strokeDasharray="3 4" />)}
      <div className="absolute inset-x-[14%] bottom-[18%]">
        <span className="block size-3 rounded-full bg-violet shadow-[0_0_12px_rgb(116_71_255/0.6)] [--run:clamp(60px,14cqw,110px)] animate-[ease-x_1.6s_cubic-bezier(0.16,1,0.3,1)_infinite_alternate]" />
      </div>
      <span className="absolute right-3 top-3 font-mono text-[9px] text-ink-3">ease-out-expo</span>
    </div>
  );
}

function Web() {
  return (
    <div className="flex size-full items-center justify-center p-5">
      <div className="w-full overflow-hidden rounded-lg bg-white ring-1 ring-line">
        <div className="flex gap-1 border-b border-line px-2 py-1.5">
          {[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full bg-ink/15" />)}
        </div>
        <div className="relative space-y-1.5 p-2.5">
          <span className="block h-2.5 w-2/3 rounded bg-ink/80" />
          <span className="block h-2 w-full rounded bg-ink/10" />
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {[0, 1, 2].map((i) => <span key={i} className="h-7 rounded bg-cream-2" />)}
          </div>
          <span className="absolute inset-0 animate-[shimmer_1.8s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.8),transparent)]" />
        </div>
      </div>
    </div>
  );
}

function Mobile() {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="relative h-[78%] w-[26%] min-w-[54px] rounded-[12px] bg-ink p-1">
        <div className="flex h-full flex-col gap-1 rounded-[9px] bg-paper p-1.5">
          <span className="mx-auto h-1 w-5 rounded-full bg-ink" />
          <span className="mt-1 block h-8 animate-[bob_2.4s_ease-in-out_infinite] rounded-md bg-violet shadow-[0_6px_12px_-6px_rgb(116_71_255/0.8)]" />
          <span className="block h-1.5 w-3/4 rounded bg-ink/15" />
          <span className="block h-1.5 w-1/2 rounded bg-ink/15" />
          <span className="mt-auto flex justify-around">
            {[0, 1, 2].map((i) => <span key={i} className={`size-1 rounded-full ${i ? "bg-ink/25" : "bg-violet"}`} />)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Backend() {
  return (
    <div className="flex size-full flex-col justify-center gap-1.5 px-6">
      {["api", "workers", "db"].map((n, i) => (
        <div key={n} className="flex items-center gap-2 rounded-md bg-ink px-2.5 py-1.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-1.5 animate-pulse rounded-full bg-lavender" style={{ animationDelay: `${(i * 3 + d) * 0.27}s` }} />
          ))}
          <span className="ml-auto font-mono text-[9px] text-white/60">{n}</span>
        </div>
      ))}
    </div>
  );
}

function Cloud() {
  return svg(
    <>
      <path d="M14 78 Q80 10 146 78" stroke={I} strokeOpacity="0.12" />
      {["M30 64 Q60 18 80 36", "M80 36 Q108 20 130 64", "M30 64 Q80 90 130 64"].map((d, i) => (
        <path key={d} d={d} stroke={V} strokeWidth="1.4" className="anim-flow" style={{ animationDelay: `${i * -0.5}s` }} />
      ))}
      {[[30, 64, "eu"], [80, 36, "us"], [130, 64, "ap"]].map(([x, y, t]) => (
        <g key={t as string}>
          <circle cx={x as number} cy={y as number} r="5" fill="#fff" stroke={I} strokeOpacity="0.4" />
          <circle cx={x as number} cy={y as number} r="2" fill={V} />
          <text x={x as number} y={(y as number) + 15} textAnchor="middle" fontSize="8" fill="#a39b91" fontFamily="var(--font-mono)">{t}</text>
        </g>
      ))}
    </>,
  );
}

function Ai() {
  const cols = [[40, [30, 55, 80]], [80, [22, 44, 66, 88]], [120, [40, 70]]] as const;
  return svg(
    <>
      {cols.slice(0, 2).flatMap(([x1, ys1], c) =>
        ys1.flatMap((y1) => cols[c + 1][1].map((y2) => <path key={`${x1}${y1}${y2}`} d={`M${x1} ${y1} L${cols[c + 1][0]} ${y2}`} stroke={I} strokeOpacity="0.12" />)),
      )}
      {cols.flatMap(([x, ys], c) =>
        ys.map((y, k) => (
          <g key={`${x}${y}`}>
            <circle cx={x} cy={y} r="4.5" fill={c === 2 ? V : I} />
            <circle cx={x} cy={y} r="4.5" fill={V} className="animate-ping [transform-box:fill-box] [transform-origin:center]" style={{ animationDelay: `${(c * 4 + k) * 0.3}s`, animationDuration: "2.4s" }} />
          </g>
        )),
      )}
    </>,
  );
}

function Automation() {
  return (
    <div className="flex size-full flex-col justify-center gap-2 px-6">
      {["Collect", "Process", "Report"].map((s, i) => (
        <div key={s} className="flex items-center gap-2 text-[11px]">
          <span className="flex size-4 items-center justify-center rounded-full bg-violet text-[8px] text-white">✓</span>
          <span className="w-12 text-ink-2">{s}</span>
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-cream-2">
            <span className="block h-full animate-[fill_2.4s_ease-in-out_infinite] rounded-full bg-ink" style={{ animationDelay: `${i * 0.4}s` }} />
          </span>
        </div>
      ))}
    </div>
  );
}

function Agents() {
  return (
    <div className="flex size-full flex-col justify-center gap-1.5 px-5 text-[10px]">
      <span className="self-end rounded-xl rounded-br-sm bg-ink px-2.5 py-1.5 text-cream">Book the team offsite</span>
      <span className="self-start rounded-xl rounded-bl-sm bg-white px-2.5 py-1.5 ring-1 ring-line">Found 3 venues. Holding the best one.</span>
      <span className="flex gap-1 self-start rounded-xl bg-white px-2.5 py-2 ring-1 ring-line">
        {[0, 1, 2].map((i) => <span key={i} className="size-1 animate-bounce rounded-full bg-violet" style={{ animationDelay: `${i * 0.15}s` }} />)}
      </span>
    </div>
  );
}

function Data() {
  return (
    <div className="flex size-full items-end justify-center gap-1.5 px-7 pb-6 pt-8">
      {[0.5, 0.8, 0.35, 0.95, 0.6, 0.75, 0.45].map((h, i) => (
        <span
          key={i}
          className={`w-full origin-bottom rounded-t-[3px] ${i === 3 ? "bg-violet" : "bg-ink/80"}`}
          style={{ height: `${h * 100}%`, animation: `wave ${1.6 + (i % 3) * 0.3}s ease-in-out ${i * -0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

function CreativeTech() {
  return (
    <div className="flex size-full items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-[80%] animate-[spin_14s_linear_infinite]">
        {Array.from({ length: 9 }, (_, i) => (
          <ellipse key={i} cx="50" cy="50" rx="40" ry="14" transform={`rotate(${i * 20} 50 50)`} fill="none" stroke={i % 3 ? I : V} strokeOpacity={i % 3 ? 0.25 : 0.9} />
        ))}
        <circle cx="50" cy="50" r="3" fill={V} />
      </svg>
    </div>
  );
}

function ThreeD() {
  const faces = ["rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)"];
  return (
    <div className="flex size-full items-center justify-center [perspective:400px]">
      <div className="relative size-12 animate-[cube_8s_linear_infinite] [transform-style:preserve-3d]">
        {faces.map((f, i) => (
          <span
            key={f}
            className={`absolute inset-0 rounded-[4px] border ${i === 0 ? "border-violet bg-violet/25" : "border-ink/40 bg-lavender/30"}`}
            style={{ transform: `${f} translateZ(24px)` }}
          />
        ))}
      </div>
    </div>
  );
}

function Interactive() {
  return (
    <div className="grid size-full grid-cols-9 place-items-center px-5 py-4">
      {Array.from({ length: 45 }, (_, i) => (
        <span key={i} className="size-1.5 rounded-full bg-ink/25 transition-all duration-300 hover:scale-[2.4] hover:bg-violet" />
      ))}
    </div>
  );
}

function Engines() {
  return (
    <div className="relative flex size-full items-end justify-center pb-[22%]">
      <span className="absolute bottom-[22%] h-px w-2/3 bg-ink/20" />
      <span className="mb-px size-5 animate-[hop_1.1s_infinite] rounded-full bg-violet shadow-[0_4px_10px_rgb(116_71_255/0.4)]" />
      <span className="absolute left-3 top-3 font-mono text-[9px] text-ink-3">update() → render()</span>
    </div>
  );
}

export const SPECIMENS: Record<string, () => ReactNode> = {
  "Product Design": ProductDesign,
  "UI / UX": UiUx,
  "Design Systems": DesignSystems,
  "Motion & Interaction": Motion,
  Web,
  Mobile,
  Backend,
  Cloud,
  AI: Ai,
  Automation,
  Agents,
  Data,
  "Creative Technology": CreativeTech,
  "3D": ThreeD,
  "Interactive Experiences": Interactive,
  "Custom Engines": Engines,
};

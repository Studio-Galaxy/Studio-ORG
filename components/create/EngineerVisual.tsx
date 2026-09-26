import { Panel } from "@/components/ui/Panel";

const N = {
  web: [150, 70], ios: [300, 70], android: [450, 70],
  edge: [300, 160],
  auth: [140, 250], api: [300, 250], queue: [460, 250],
  db: [200, 350], cache: [320, 350], workers: [460, 350],
} as const;
type K = keyof typeof N;

const EDGES: [K, K][] = [
  ["web", "edge"], ["ios", "edge"], ["android", "edge"], ["edge", "api"], ["api", "auth"],
  ["api", "queue"], ["api", "db"], ["api", "cache"], ["queue", "workers"], ["workers", "cache"],
];
const LIVE = new Set([0, 3, 5, 6, 8]);

const path = (a: K, b: K) => {
  const [x1, y1] = N[a];
  const [x2, y2] = N[b];
  if (y1 === y2) return `M${x1} ${y1} H${x2}`;
  const my = (y1 + y2) / 2;
  return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
};

// An architecture that runs: requests flowing through a real-shaped system.
export function EngineerVisual() {
  return (
    <Panel aria-hidden className="bg-[#141217] bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:3cqw_3cqw]">
      <svg viewBox="0 0 600 450" className="absolute inset-0 size-full" fontFamily="var(--font-mono)">
        <g fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="1">
          {EDGES.map(([a, b]) => <path key={a + b} d={path(a, b)} />)}
        </g>
        <g fill="none" stroke="#b69cff" strokeWidth="1.6" strokeLinecap="round">
          {EDGES.map(([a, b], i) =>
            LIVE.has(i) ? <path key={a + b} d={path(a, b)} className="anim-flow" style={{ strokeDasharray: "2 18", animationDelay: `${i * -0.37}s` }} /> : null,
          )}
        </g>
        {(Object.keys(N) as K[]).map((k) => {
          const [x, y] = N[k];
          const main = k === "api";
          return (
            <g key={k} transform={`translate(${x - 46} ${y - 17})`}>
              <rect width="92" height="34" rx="10" fill={main ? "#7447ff" : "#1f1c24"} stroke="#fff" strokeOpacity={main ? 0 : 0.12} />
              <circle cx="16" cy="17" r="3" fill={main ? "#fff" : "#b69cff"} />
              <text x="28" y="21" fontSize="11" fill="#fff" fillOpacity={main ? 1 : 0.82}>{k}</text>
            </g>
          );
        })}
        <text x="36" y="420" fontSize="11" fill="#fff" fillOpacity="0.45">
          $ ship --production<tspan fill="#b69cff" className="anim-breathe"> ▍</tspan>
        </text>
        <text x="564" y="420" fontSize="11" textAnchor="end" fill="#fff" fillOpacity="0.45">
          <tspan fill="#b69cff">●</tspan> healthy
        </text>
      </svg>
    </Panel>
  );
}

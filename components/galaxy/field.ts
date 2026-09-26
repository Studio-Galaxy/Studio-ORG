// Generative point field for the Galaxy chapter. Pure functions, no React.
// One point → a small constellation → connected system → a slow, tilted spiral.

const CORE = 90; // points that form the first constellation

export type Field = {
  n: number;
  spawn: Float32Array;
  cx: Float32Array; cy: Float32Array; // constellation, in units of the half min-dimension
  gr: Float32Array; ga: Float32Array; gz: Float32Array; // galaxy polar radius, angle, height
  size: Float32Array; lum: Float32Array; tint: Uint8Array;
  edges: Uint16Array;
  X: Float32Array; Y: Float32Array; A: Float32Array; // per-frame scratch
};

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildField(n: number): Field {
  const r = rng(7);
  const gauss = () => Math.sqrt(-2 * Math.log(r() || 1e-6)) * Math.cos(2 * Math.PI * r());
  const f: Field = {
    n,
    spawn: new Float32Array(n),
    cx: new Float32Array(n), cy: new Float32Array(n),
    gr: new Float32Array(n), ga: new Float32Array(n), gz: new Float32Array(n),
    size: new Float32Array(n), lum: new Float32Array(n), tint: new Uint8Array(n),
    edges: new Uint16Array(0),
    X: new Float32Array(n), Y: new Float32Array(n), A: new Float32Array(n),
  };

  for (let i = 0; i < n; i++) {
    // constellation: loose disc, denser toward the middle
    const cr = i === 0 ? 0 : 0.06 + 0.5 * Math.sqrt(r());
    const ca = r() * Math.PI * 2;
    f.cx[i] = Math.cos(ca) * cr;
    f.cy[i] = Math.sin(ca) * cr * 0.8;

    // galaxy: three winding arms plus a soft bulge
    const bulge = r() < 0.14;
    const gr = bulge ? Math.abs(gauss()) * 0.12 : 0.1 + Math.pow(r(), 0.8) * 0.95;
    const arm = i % 3;
    f.gr[i] = i === 0 ? 0 : gr;
    f.ga[i] = arm * ((Math.PI * 2) / 3) + gr * 3.4 + gauss() * (bulge ? 1.5 : 0.22 + 0.18 * (1 - gr));
    f.gz[i] = gauss() * (bulge ? 0.05 : 0.018);

    f.size[i] = 0.6 + Math.pow(r(), 3) * 1.7;
    f.lum[i] = 0.45 + r() * 0.55;
    const t = r();
    f.tint[i] = t < 0.05 ? 2 : t < 0.18 ? 1 : 0;

    // when each point arrives: core ripples outward first, the rest pour in with the galaxy
    f.spawn[i] = i === 0 ? 0.04 : i < CORE ? 0.13 + cr * 0.3 + r() * 0.03 : 0.57 + gr * 0.11 + r() * 0.02;
  }

  // constellation links: each core point to its two nearest neighbours
  const edges: number[] = [];
  const seen = new Set<number>();
  for (let i = 1; i < CORE; i++) {
    const near = [-1, -1];
    const nd = [Infinity, Infinity];
    for (let j = 1; j < CORE; j++) {
      if (j === i) continue;
      const d = (f.cx[i] - f.cx[j]) ** 2 + (f.cy[i] - f.cy[j]) ** 2;
      if (d < nd[0]) { nd[1] = nd[0]; near[1] = near[0]; nd[0] = d; near[0] = j; }
      else if (d < nd[1]) { nd[1] = d; near[1] = j; }
    }
    for (const j of near) {
      const key = Math.min(i, j) * CORE + Math.max(i, j);
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(i, j);
    }
  }
  f.edges = Uint16Array.from(edges);
  return f;
}

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ramp = (p: number, a: number, b: number) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const TINTS = ["244,239,232", "201,182,255", "155,123,255"];

type Frame = { w: number; h: number; p: number; t: number; tiltX: number; tiltY: number };

export function drawField(ctx: CanvasRenderingContext2D, f: Field, { w, h, p, t, tiltX, tiltY }: Frame) {
  const cx = w / 2;
  const cy = h * 0.46;
  const m = Math.min(w, h) / 2;
  const R = m * (w < 768 ? 1.05 : 1.25) * (0.92 + 0.12 * ramp(p, 0.66, 0.92));

  const toGalaxy = ramp(p, 0.57, 0.72);
  const links = ramp(p, 0.42, 0.52) * (1 - ramp(p, 0.54, 0.59));
  const dim = 1 - 0.55 * ramp(p, 0.85, 0.9);
  const fade = 1 - ramp(p, 0.93, 0.99);
  if (fade <= 0) return;

  const incl = 1.08 + tiltY * 0.08;
  const spin = t * 0.00003 + tiltX * 0.12;
  const ci = Math.cos(incl), si = Math.sin(incl);
  const drift = t * 0.0004;

  const { X, Y, A } = f;

  for (let i = 0; i < f.n; i++) {
    const a = ramp(p, f.spawn[i], f.spawn[i] + 0.07);
    A[i] = a;
    if (a <= 0) continue;

    // constellation position with a slow breath
    const bx = (f.cx[i] + Math.sin(drift + i) * 0.006) * m * 1.1;
    const by = (f.cy[i] + Math.cos(drift * 1.3 + i) * 0.006) * m * 1.1;

    // galaxy position, inner orbits turning a little faster
    const gr = f.gr[i];
    const ang = f.ga[i] + spin / (0.35 + gr);
    const gx = Math.cos(ang) * gr;
    const gy = Math.sin(ang) * gr;
    const yz = gy * ci - f.gz[i] * si;
    const z = gy * si + f.gz[i] * ci;
    const s = 1 / (1 + z * 0.45);
    const px = gx * s * R;
    const py = yz * s * R;

    const core = i < CORE;
    const k = core ? toGalaxy : 1;
    const sx = core ? bx : 0;
    const sy = core ? by : 0;
    // non-core points travel out from the centre as they spawn
    const e = core ? k : a;
    X[i] = cx + sx + (px - sx) * e;
    Y[i] = cy + sy + (py - sy) * e;
  }

  // links
  if (links > 0.001) {
    ctx.lineWidth = 0.7;
    const total = f.edges.length / 2;
    const shown = total * clamp(links * 1.4);
    for (let e = 0; e < shown; e++) {
      const i = f.edges[e * 2], j = f.edges[e * 2 + 1];
      const al = Math.min(A[i], A[j]) * links * 0.38 * fade;
      if (al <= 0.003) continue;
      ctx.strokeStyle = `rgba(201,182,255,${al})`;
      ctx.beginPath();
      ctx.moveTo(X[i], Y[i]);
      ctx.lineTo(X[j], Y[j]);
      ctx.stroke();
    }
  }

  // orbit guides, drawn in the disc plane
  const guides = ramp(p, 0.62, 0.76) * 0.09 * dim * fade;
  if (guides > 0.002) {
    ctx.strokeStyle = `rgba(244,239,232,${guides})`;
    ctx.lineWidth = 1;
    for (const gr of [0.38, 0.7, 1.02]) {
      ctx.beginPath();
      for (let s = 0; s <= 96; s++) {
        const ang = (s / 96) * Math.PI * 2;
        const gy = Math.sin(ang) * gr;
        const sc = 1 / (1 + gy * si * 0.45);
        const x = cx + Math.cos(ang) * gr * sc * R;
        const y = cy + gy * ci * sc * R;
        if (s) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
  }

  // points
  for (let i = 1; i < f.n; i++) {
    if (A[i] <= 0) continue;
    const al = A[i] * f.lum[i] * dim * fade;
    ctx.fillStyle = `rgba(${TINTS[f.tint[i]]},${al})`;
    ctx.beginPath();
    ctx.arc(X[i], Y[i], f.size[i], 0, Math.PI * 2);
    ctx.fill();
  }

  // the first point: appears, swells, then settles as the galaxy's heart
  const born = ramp(p, 0.03, 0.09);
  if (born > 0) {
    const swell = ramp(p, 0.14, 0.26) * (1 - 0.5 * toGalaxy);
    const glow = (22 + swell * 110) * (w < 768 ? 0.75 : 1);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glow);
    g.addColorStop(0, `rgba(216,201,255,${0.55 * born * fade})`);
    g.addColorStop(0.25, `rgba(116,71,255,${0.22 * born * fade})`);
    g.addColorStop(1, "rgba(116,71,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - glow, cy - glow, glow * 2, glow * 2);
    ctx.fillStyle = `rgba(255,255,255,${born * fade})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 2.4 + swell * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

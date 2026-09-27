// Photographic galaxy + starfield, painted once into offscreen canvases.
// Each frame just rotates/tilts the bitmap, so realism costs one drawImage.

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = Math.ceil(w);
  c.height = Math.ceil(h);
  return c;
};

function blob(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rgb: string, a: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// Face-on two-armed spiral. Drawn tilted at runtime.
export function buildGalaxy(size: number, stars: number) {
  const c = canvas(size, size);
  const ctx = c.getContext("2d")!;
  const r = rng(11);
  const gauss = () => Math.sqrt(-2 * Math.log(r() || 1e-6)) * Math.cos(2 * Math.PI * r());
  const S = size / 2;
  const R = size * 0.48;
  const r0 = R * 0.07;
  const pitch = 1 / Math.tan((13 * Math.PI) / 180);
  const armAngle = (rad: number, arm: number) => arm * Math.PI + Math.log(Math.max(rad, r0) / r0) * pitch * 0.5;
  const polar = (rad: number, ang: number): [number, number] => [S + Math.cos(ang) * rad, S + Math.sin(ang) * rad];
  const onArm = (min = 0.08) => {
    let rad = R * (min + -Math.log(r() || 1e-6) * 0.24);
    if (rad > R) rad = R * (min + r() * (1 - min)); // resample, clamping would draw a rim
    const arm = r() < 0.5 ? 0 : 1;
    const spread = 0.16 + (rad / R) * 0.22;
    return { rad, ang: armAngle(rad, arm) + gauss() * spread };
  };

  ctx.globalCompositeOperation = "lighter";

  // diffuse disc light
  blob(ctx, S, S, R * 0.95, "120,140,200", 0.1);
  blob(ctx, S, S, R * 0.55, "200,190,210", 0.12);

  // unresolved arm haze
  for (let i = 0; i < 520; i++) {
    const { rad, ang } = onArm();
    const [x, y] = polar(rad, ang);
    blob(ctx, x, y, R * (0.035 + r() * 0.07), r() < 0.7 ? "140,165,255" : "210,200,255", 0.05);
  }

  // stars: young blue in the arms, older warm light across the disc
  for (let i = 0; i < stars; i++) {
    const inArm = r() < 0.68;
    let x: number, y: number;
    if (inArm) {
      const p = onArm();
      [x, y] = polar(p.rad, p.ang);
    } else {
      let rad = -Math.log(r() || 1e-6) * R * 0.2;
      if (rad > R) rad = r() * R;
      [x, y] = polar(rad, r() * Math.PI * 2);
    }
    const hot = inArm && r() < 0.75;
    ctx.globalAlpha = 0.08 + Math.pow(r(), 3) * (hot ? 0.7 : 0.4);
    ctx.fillStyle = hot ? (r() < 0.5 ? "#a9c1ff" : "#e4ebff") : r() < 0.5 ? "#ffe2bd" : "#fff4e6";
    const s = r() < 0.02 ? 2 : r() < 0.2 ? 1.4 : 1;
    ctx.fillRect(x, y, s, s);
  }
  ctx.globalAlpha = 1;

  // dust lanes on the inner edge of each arm
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 1600; i++) {
    const rad = R * (0.1 + Math.pow(r(), 0.8) * 0.75);
    const arm = r() < 0.5 ? 0 : 1;
    const ang = armAngle(rad, arm) - 0.2 + gauss() * 0.08;
    const [x, y] = polar(rad, ang);
    blob(ctx, x, y, R * (0.02 + r() * 0.035), "0,0,0", 0.1 + r() * 0.14);
  }

  ctx.globalCompositeOperation = "lighter";

  // star-forming knots and bright clusters strung along the arms
  for (let i = 0; i < 200; i++) {
    const { rad, ang } = onArm(0.18);
    const [x, y] = polar(rad, ang + 0.06);
    const pink = r() < 0.55;
    blob(ctx, x, y, 1.5 + r() * (pink ? 5 : 3.5), pink ? "255,120,170" : "200,220,255", pink ? 0.35 : 0.55);
  }

  // bulge and nucleus
  blob(ctx, S, S, R * 0.34, "255,206,160", 0.22);
  blob(ctx, S, S, R * 0.15, "255,222,185", 0.38);
  blob(ctx, S, S, R * 0.05, "255,240,220", 0.6);
  blob(ctx, S, S, R * 0.014, "255,252,245", 0.9);

  return c;
}

// Background sky: star colours follow real temperature classes.
const TEMPS = ["155,176,255", "202,215,255", "248,247,255", "255,244,234", "255,244,234", "255,221,180", "255,204,140"];

export function buildStars(w: number, h: number, dpr: number) {
  const pad = 40;
  const c = canvas((w + pad * 2) * dpr, (h + pad * 2) * dpr);
  const ctx = c.getContext("2d")!;
  const r = rng(3);
  ctx.scale(dpr, dpr);
  const n = Math.round((w * h) / 900);
  for (let i = 0; i < n; i++) {
    const x = r() * (w + pad * 2);
    const y = r() * (h + pad * 2);
    const rgb = TEMPS[Math.floor(r() * TEMPS.length)];
    const bright = r() < 0.012;
    if (bright) {
      blob(ctx, x, y, 3 + r() * 5, rgb, 0.5);
      ctx.fillStyle = `rgba(255,255,255,0.95)`;
      ctx.beginPath();
      ctx.arc(x, y, 0.9, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = `rgba(${rgb},${0.12 + Math.pow(r(), 2.5) * 0.7})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.35 + r() * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return { canvas: c, pad };
}

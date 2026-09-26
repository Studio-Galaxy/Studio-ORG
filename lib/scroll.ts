// Maps 0..1 scroll progress onto n discrete stages that hold still in the middle
// of their slice and ease between each other. Feed to useTransform(progress, input, output).
export function plateaus(n: number, hold = 0.5) {
  const input: number[] = [];
  const output: number[] = [];
  const pad = (1 - hold) / (2 * n);
  for (let k = 0; k < n; k++) {
    input.push(k === 0 ? 0 : k / n + pad, k === n - 1 ? 1 : (k + 1) / n - pad);
    output.push(k, k);
  }
  return { input, output };
}

// Opacity curve that peaks at stage k, for a stage motion value.
export function peak(k: number, last = false, spread = 0.6) {
  return last
    ? { input: [k - spread, k], output: [0, 1] }
    : { input: [k - spread, k, k + spread], output: [0, 1, 0] };
}

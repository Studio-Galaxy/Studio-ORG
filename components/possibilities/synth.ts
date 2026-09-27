// Tiny generative ambient synth (Web Audio). No audio files: each track is a
// chord loop — pads, a bass note and a plucked arpeggio into a dotted-8th delay.

type Track = { bpm: number; chords: number[][]; bass: number[]; wave: OscillatorType };

export const SONGS: Track[] = [
  // Low Orbit — A minor, unhurried
  { bpm: 84, wave: "triangle", chords: [[57, 60, 64, 67, 71], [53, 57, 60, 64], [48, 55, 59, 64], [55, 59, 62, 64]], bass: [45, 41, 48, 43] },
  // Event Horizon — D minor, a little more urgent
  { bpm: 96, wave: "sine", chords: [[50, 53, 57, 60, 64], [46, 50, 53, 57], [55, 58, 62, 65], [57, 62, 64, 67]], bass: [38, 34, 43, 45] },
  // First Light — E major, open and slow
  { bpm: 72, wave: "sine", chords: [[52, 56, 59, 63], [49, 52, 56, 59], [45, 49, 52, 56], [47, 51, 54, 56]], bass: [40, 37, 45, 47] },
];

const hz = (m: number) => 440 * 2 ** ((m - 69) / 12);
const ARP = [0, 2, 1, 3, 2, 4, 3, 1];

export class Synth {
  private ctx?: AudioContext;
  private out?: GainNode;
  private send?: GainNode;
  private delay?: DelayNode;
  private bus?: GainNode;
  private timer = 0;
  private step = 0;
  private next = 0;
  private song = 0;

  private init() {
    if (this.ctx) return this.ctx;
    const ctx = (this.ctx = new AudioContext());
    const comp = ctx.createDynamicsCompressor();
    this.out = ctx.createGain();
    this.out.gain.value = 0.8;
    this.out.connect(comp).connect(ctx.destination);

    // shared delay: send → delay ⇄ (lowpass → feedback) → wet → out
    const delay = ctx.createDelay(2);
    const fb = ctx.createGain();
    const tone = ctx.createBiquadFilter();
    const wet = ctx.createGain();
    this.send = ctx.createGain();
    this.send.gain.value = 0.35;
    tone.frequency.value = 2400;
    fb.gain.value = 0.38;
    wet.gain.value = 0.5;
    this.send.connect(delay);
    delay.connect(tone).connect(fb).connect(delay);
    delay.connect(wet).connect(this.out);
    this.delay = delay;
    return ctx;
  }

  play(song: number, restart: boolean) {
    const ctx = this.init();
    void ctx.resume();
    this.fadeOut();
    clearInterval(this.timer);
    if (restart || song !== this.song) this.step = 0;
    this.song = song;
    this.delay!.delayTime.setValueAtTime((60 / SONGS[song].bpm) * 0.75, ctx.currentTime);

    // each play gets its own bus so switching tracks crossfades instead of cutting
    const bus = (this.bus = ctx.createGain());
    bus.gain.setValueAtTime(0, ctx.currentTime);
    bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.6);
    bus.connect(this.out!);
    bus.connect(this.send!);

    this.next = ctx.currentTime + 0.06;
    this.timer = window.setInterval(() => this.tick(), 25);
  }

  pause() {
    clearInterval(this.timer);
    this.fadeOut();
  }

  dispose() {
    this.pause();
    const ctx = this.ctx;
    this.ctx = undefined;
    setTimeout(() => ctx?.close(), 500);
  }

  private fadeOut() {
    const ctx = this.ctx, bus = this.bus;
    if (!ctx || !bus) return;
    const now = ctx.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(bus.gain.value, now);
    bus.gain.linearRampToValueAtTime(0, now + 0.4);
    setTimeout(() => bus.disconnect(), 3000);
    this.bus = undefined;
  }

  // look-ahead scheduler: queue every eighth note due in the next 120ms
  private tick() {
    const ctx = this.ctx, bus = this.bus;
    if (!ctx || !bus) return;
    const s = SONGS[this.song];
    const eighth = 60 / s.bpm / 2;
    while (this.next < ctx.currentTime + 0.12) {
      const bar = Math.floor(this.step / 8) % s.chords.length;
      const chord = s.chords[bar];
      if (this.step % 8 === 0) {
        this.pad(bus, chord, this.next, eighth * 8);
        this.bass(bus, s.bass[bar], this.next, eighth * 8);
      }
      if ((this.step * 5) % 13 !== 7) this.pluck(bus, s.wave, chord[ARP[this.step % 8] % chord.length] + 12, this.next);
      this.next += eighth;
      this.step++;
    }
  }

  private pad(bus: GainNode, chord: number[], t: number, len: number) {
    const ctx = this.ctx!;
    const lp = ctx.createBiquadFilter();
    lp.frequency.value = 1100;
    lp.connect(bus);
    for (const m of chord.slice(0, 4)) {
      for (const detune of [-7, 7]) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sawtooth";
        o.frequency.value = hz(m);
        o.detune.value = detune;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.022, t + 0.9);
        g.gain.setValueAtTime(0.022, t + len);
        g.gain.linearRampToValueAtTime(0, t + len + 1.4);
        o.connect(g).connect(lp);
        o.start(t);
        o.stop(t + len + 1.5);
      }
    }
  }

  private bass(bus: GainNode, m: number, t: number, len: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = hz(m);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.05);
    g.gain.linearRampToValueAtTime(0.1, t + len);
    g.gain.linearRampToValueAtTime(0, t + len + 0.3);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + len + 0.35);
  }

  private pluck(bus: GainNode, wave: OscillatorType, m: number, t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = wave;
    o.frequency.value = hz(m);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.7);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + 0.75);
  }
}

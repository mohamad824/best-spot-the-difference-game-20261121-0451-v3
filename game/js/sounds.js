// Tiny WebAudio sound effects — synthesized, no audio files, no network.

let ctx = null;
let muted = false;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.16) {
  if (muted) return;
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.05);
}

export const sfx = {
  setMuted(m) {
    muted = m;
  },
  isMuted() {
    return muted;
  },
  click() {
    tone(520, 0, 0.08, 'triangle', 0.1);
  },
  find() {
    tone(660, 0, 0.12, 'sine', 0.18);
    tone(880, 0.09, 0.16, 'sine', 0.18);
    tone(1320, 0.18, 0.2, 'sine', 0.12);
  },
  wrong() {
    tone(180, 0, 0.22, 'sawtooth', 0.12);
    tone(120, 0.1, 0.25, 'sawtooth', 0.1);
  },
  hint() {
    tone(440, 0, 0.1, 'sine', 0.12);
    tone(587, 0.08, 0.14, 'sine', 0.12);
  },
  level() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.18, 'triangle', 0.15));
  },
  win() {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * 0.13, 0.26, 'triangle', 0.15));
  },
};

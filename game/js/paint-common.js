// Shared painting helpers: deterministic colour, brickwork, vines, gems and glow.
// Every helper is pure canvas drawing — no images, no network.

/** Deterministic pseudo-random generator from a fixed seed. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function glow(ctx, x, y, r, color, alpha = 0.55) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** A warm cream brick wall filling the panel. */
export function brickWall(ctx, W, H, seed = 7) {
  const rand = rng(seed);
  ctx.fillStyle = '#f3e2c2';
  ctx.fillRect(0, 0, W, H);
  const bh = 26;
  const bw = 62;
  for (let row = 0; row * bh < H; row++) {
    const off = row % 2 ? bw / 2 : 0;
    for (let col = -1; col * bw < W + bw; col++) {
      const x = col * bw + off;
      const y = row * bh;
      const shade = 225 + Math.floor(rand() * 22);
      ctx.fillStyle = `rgb(${shade},${Math.floor(shade * 0.82)},${Math.floor(shade * 0.6)})`;
      ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);
    }
  }
  ctx.fillStyle = 'rgba(120,84,40,0.18)';
  ctx.fillRect(0, 0, W, 4);
}

/** A leafy green vine curling from a corner, with optional pink flowers. */
export function vine(ctx, x0, y0, len, flip, flowers) {
  ctx.save();
  ctx.strokeStyle = '#2f7d32';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  const dir = flip ? -1 : 1;
  ctx.bezierCurveTo(x0 + dir * 60, y0 + 30, x0 + dir * 30, y0 + len * 0.6, x0 + dir * 90, y0 + len);
  ctx.stroke();
  const rand = rng(31);
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const lx = x0 + dir * (30 + 55 * t + rand() * 14);
    const ly = y0 + len * t + rand() * 8;
    ctx.fillStyle = i % 2 ? '#43a047' : '#66bb6a';
    ctx.beginPath();
    ctx.ellipse(lx, ly, 13, 7, (rand() - 0.5) * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const f of flowers) {
    ctx.fillStyle = '#ff5fa2';
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(f.x + Math.cos(a) * 6, f.y + Math.sin(a) * 6, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** A faceted gem (diamond) with a bright highlight and sparkle. */
export function gem(ctx, x, y, r, top, bottom) {
  const g = ctx.createLinearGradient(x, y - r, x, y + r);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r * 0.72, y - r * 0.15);
  ctx.lineTo(x + r * 0.45, y + r);
  ctx.lineTo(x - r * 0.45, y + r);
  ctx.lineTo(x - r * 0.72, y - r * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - r * 0.72, y - r * 0.15);
  ctx.lineTo(x + r * 0.72, y - r * 0.15);
  ctx.moveTo(x, y - r);
  ctx.lineTo(x, y + r);
  ctx.moveTo(x - r * 0.45, y + r);
  ctx.lineTo(x, y - r * 0.15);
  ctx.lineTo(x + r * 0.45, y + r);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.ellipse(x - r * 0.28, y - r * 0.45, r * 0.16, r * 0.09, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

export function sparkle(ctx, x, y, s, color = '#ffffff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x, y, x + s, y);
  ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y);
  ctx.quadraticCurveTo(x, y, x, y - s);
  ctx.fill();
  ctx.restore();
}

/** A soft floor band at the bottom of a panel. */
export function floorBand(ctx, W, H, y, c1, c2) {
  const g = ctx.createLinearGradient(0, y, 0, H);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, y, W, H - y);
}

/** A four-point star used for night skies and magic dust. */
export function star4(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x + s * 0.18, y - s * 0.18, x + s, y);
  ctx.quadraticCurveTo(x + s * 0.18, y + s * 0.18, x, y + s);
  ctx.quadraticCurveTo(x - s * 0.18, y + s * 0.18, x - s, y);
  ctx.quadraticCurveTo(x - s * 0.18, y - s * 0.18, x, y - s);
  ctx.fill();
}

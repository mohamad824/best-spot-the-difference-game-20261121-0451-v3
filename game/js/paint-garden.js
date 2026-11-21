// Firefly Garden — a moonlit night garden: deep teal sky, a glowing
// moon, paper lanterns, big blooms, spotted mushrooms, a pond with a frog
// and fireflies drifting over the grass. `changed` holds the right panel's
// differences.

import { glow, sparkle, rr, star4, rng } from './paint-common.js';

const FIREFLIES = [
  [80, 120], [150, 200], [210, 90], [330, 150], [390, 240],
  [480, 110], [560, 200], [300, 210], [120, 260], [540, 290],
];

function lantern(ctx, x, y, pink) {
  glow(ctx, x, y, 46, pink ? '#f48fb1' : '#ffca28', 0.55);
  ctx.strokeStyle = '#4e342e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y - 58);
  ctx.lineTo(x, y - 26);
  ctx.stroke();
  ctx.fillStyle = pink ? '#f06292' : '#ff8f00';
  ctx.beginPath();
  ctx.ellipse(x, y, 22, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = pink ? '#f8bbd0' : '#ffe082';
  ctx.beginPath();
  ctx.ellipse(x, y, 13, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = pink ? '#ad1457' : '#e65100';
  ctx.lineWidth = 2;
  for (const dy of [-16, 0, 16]) {
    ctx.beginPath();
    ctx.moveTo(x - 20, y + dy);
    ctx.quadraticCurveTo(x, y + dy + 6, x + 20, y + dy);
    ctx.stroke();
  }
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(x - 8, y - 34, 16, 6);
  ctx.fillRect(x - 8, y + 28, 16, 6);
}

function flower(ctx, x, y, r, petal, center) {
  ctx.fillStyle = petal;
  for (let p = 0; p < 6; p++) {
    const a = (p / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.5, r * 0.32, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.34, 0, Math.PI * 2);
  ctx.fill();
}

function mushroom(ctx, x, y, spots) {
  ctx.fillStyle = '#fff8e1';
  rr(ctx, x - 9, y - 6, 18, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#e53935';
  ctx.beginPath();
  ctx.moveTo(x - 30, y - 4);
  ctx.quadraticCurveTo(x, y - 40, x + 30, y - 4);
  ctx.closePath();
  ctx.fill();
  if (spots) {
    ctx.fillStyle = '#fffde7';
    ctx.beginPath();
    ctx.arc(x - 14, y - 16, 5, 0, Math.PI * 2);
    ctx.arc(x + 12, y - 20, 6, 0, Math.PI * 2);
    ctx.arc(x + 2, y - 10, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function frog(ctx, x, y) {
  ctx.fillStyle = '#66bb6a';
  ctx.beginPath();
  ctx.ellipse(x, y, 26, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 12, y - 16, 9, 0, Math.PI * 2);
  ctx.arc(x + 12, y - 16, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - 12, y - 18, 6, 0, Math.PI * 2);
  ctx.arc(x + 12, y - 18, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1b5e20';
  ctx.beginPath();
  ctx.arc(x - 12, y - 18, 3, 0, Math.PI * 2);
  ctx.arc(x + 12, y - 18, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 2, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

export function paintGarden(ctx, W, H, changed) {
  // night sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#1a237e');
  sky.addColorStop(0.55, '#283593');
  sky.addColorStop(1, '#004d40');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  const rand = rng(41);
  for (let i = 0; i < 46; i++) {
    star4(ctx, rand() * W, rand() * 220, 2 + rand() * 3, 'rgba(255,255,255,0.9)');
  }
  // moon — pale, or orange when changed
  glow(ctx, 542, 68, 64, changed.has('g6') ? '#ff9800' : '#fffde7', 0.5);
  ctx.fillStyle = changed.has('g6') ? '#ff9800' : '#fffde7';
  ctx.beginPath();
  ctx.arc(542, 68, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = changed.has('g6') ? '#fb8c00' : '#e8e6c8';
  ctx.beginPath();
  ctx.arc(532, 60, 6, 0, Math.PI * 2);
  ctx.arc(552, 76, 4, 0, Math.PI * 2);
  ctx.fill();
  // grassy hill
  ctx.fillStyle = '#2e7d32';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(180, 250, 330, 300);
  ctx.quadraticCurveTo(480, 345, W, 290);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#388e3c';
  ctx.beginPath();
  ctx.moveTo(0, 340);
  ctx.quadraticCurveTo(220, 300, 420, 345);
  ctx.quadraticCurveTo(520, 365, W, 340);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  // pond, bottom right
  ctx.fillStyle = '#1565c0';
  ctx.beginPath();
  ctx.ellipse(380, 408, 150, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#42a5f5';
  ctx.beginPath();
  ctx.ellipse(380, 404, 132, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(350, 404, 46, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
  // pond stone — missing on the right panel
  if (!changed.has('g7')) {
    ctx.fillStyle = '#78909c';
    ctx.beginPath();
    ctx.ellipse(352, 402, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#90a4ae';
    ctx.beginPath();
    ctx.ellipse(348, 398, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // lily pads
  ctx.fillStyle = '#43a047';
  ctx.beginPath();
  ctx.ellipse(430, 412, 26, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(300, 416, 20, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  // lanterns on posts
  lantern(ctx, 118, 152, changed.has('g1'));
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(114, 182, 8, 118);
  lantern(ctx, 520, 210, false);
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(516, 240, 8, 100);
  // big blooms — the centre one changes colour
  flower(ctx, 300, 332, 34, changed.has('g2') ? '#ab47bc' : '#ff7043', '#ffd54f');
  flower(ctx, 180, 300, 24, '#42a5f5', '#fff176');
  flower(ctx, 440, 300, 24, '#ec407a', '#fff176');
  // berry bush — berries vanish on the right panel
  ctx.fillStyle = '#1b5e20';
  ctx.beginPath();
  ctx.arc(82, 302, 34, 0, Math.PI * 2);
  ctx.arc(108, 318, 26, 0, Math.PI * 2);
  ctx.arc(58, 318, 24, 0, Math.PI * 2);
  ctx.fill();
  if (!changed.has('g9')) {
    ctx.fillStyle = '#e53935';
    for (const [bx, by] of [[72, 292], [96, 306], [60, 306], [88, 322], [112, 288]]) {
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // mushrooms
  mushroom(ctx, 502, 342, !changed.has('g3'));
  mushroom(ctx, 556, 366, true);
  // frog on the pond edge — hops away on the right panel
  if (!changed.has('g5')) frog(ctx, 198, 372);
  // butterfly (right panel only)
  if (changed.has('g8')) {
    ctx.fillStyle = '#ce93d8';
    ctx.beginPath();
    ctx.ellipse(242, 116, 10, 14, -0.5, 0, Math.PI * 2);
    ctx.ellipse(262, 116, 10, 14, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath();
    ctx.ellipse(252, 122, 4, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // fireflies — one extra on the right panel
  for (const [fx, fy] of FIREFLIES) {
    glow(ctx, fx, fy, 12, '#ffee58', 0.8);
    ctx.fillStyle = '#fff176';
    ctx.beginPath();
    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (changed.has('g4')) {
    glow(ctx, 432, 182, 16, '#ffee58', 0.9);
    ctx.fillStyle = '#fff176';
    ctx.beginPath();
    ctx.arc(432, 182, 4, 0, Math.PI * 2);
    ctx.fill();
    sparkle(ctx, 432, 182, 7);
  }
  sparkle(ctx, 90, 60, 6);
  sparkle(ctx, 330, 70, 5);
}

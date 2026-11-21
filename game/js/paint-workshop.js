// Clockmaker's Workshop — a cosy wooden interior: a wall of clocks,
// brass gears, a glowing lamp, a workbench of tools, a bookshelf and a
// window with the moon. `changed` holds the differences of the right panel.

import { glow, sparkle, rr, rng } from './paint-common.js';

function wallClock(ctx, x, y, r, hourAngle, minuteAngle, rim) {
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(x, y, r + 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fffde7';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3e2723';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * (r - 8), y + Math.sin(a) * (r - 8), 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#3e2723';
  ctx.lineCap = 'round';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(hourAngle) * r * 0.5, y + Math.sin(hourAngle) * r * 0.5);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(minuteAngle) * r * 0.78, y + Math.sin(minuteAngle) * r * 0.78);
  ctx.stroke();
  ctx.fillStyle = '#d32f2f';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function gear(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const a2 = a + Math.PI / 8;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.lineTo(x + Math.cos(a2) * (r * 0.72), y + Math.sin(a2) * (r * 0.72));
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5d4037';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8d6e63';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.14, 0, Math.PI * 2);
  ctx.fill();
}

function lamp(ctx, x, y, green) {
  glow(ctx, x, y + 26, 74, green ? '#aed581' : '#ffca28', 0.5);
  ctx.strokeStyle = '#4e342e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.fillStyle = green ? '#7cb342' : '#ffb300';
  ctx.beginPath();
  ctx.moveTo(x - 26, y + 8);
  ctx.lineTo(x + 26, y + 8);
  ctx.lineTo(x + 14, y - 16);
  ctx.lineTo(x - 14, y - 16);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = green ? '#dcedc8' : '#fff176';
  ctx.beginPath();
  ctx.arc(x, y + 16, 7, 0, Math.PI * 2);
  ctx.fill();
}

export function paintWorkshop(ctx, W, H, changed) {
  // wooden plank wall
  const wood = ctx.createLinearGradient(0, 0, 0, H);
  wood.addColorStop(0, '#a9743f');
  wood.addColorStop(1, '#7a4a21');
  ctx.fillStyle = wood;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(62,39,35,0.5)';
  ctx.lineWidth = 2;
  for (let y = 44; y < H; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  const rand = rng(23);
  ctx.fillStyle = 'rgba(62,39,35,0.25)';
  for (let i = 0; i < 10; i++) {
    ctx.fillRect(rand() * W, rand() * 300, 3, 22);
  }
  // window with the moon — or a star when changed
  ctx.fillStyle = '#1a237e';
  rr(ctx, 500, 22, 96, 84, 10);
  ctx.fill();
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 6;
  rr(ctx, 500, 22, 96, 84, 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(548, 22);
  ctx.lineTo(548, 106);
  ctx.moveTo(500, 64);
  ctx.lineTo(596, 64);
  ctx.stroke();
  if (changed.has('w6')) {
    ctx.fillStyle = '#fff176';
    sparkle(ctx, 548, 56, 16);
    sparkle(ctx, 524, 40, 6);
    sparkle(ctx, 570, 84, 5);
  } else {
    ctx.fillStyle = '#fffde7';
    ctx.beginPath();
    ctx.arc(548, 56, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a237e';
    ctx.beginPath();
    ctx.arc(556, 50, 14, 0, Math.PI * 2);
    ctx.fill();
    sparkle(ctx, 520, 88, 5);
    sparkle(ctx, 574, 92, 4);
  }
  // shelf of small clocks, left
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(28, 130, 130, 10);
  wallClock(ctx, 60, 102, 20, -1.2, 0.4, '#8d6e63');
  wallClock(ctx, 118, 100, 24, 2.2, -0.6, '#6d4c41');
  // bookshelf with one book that changes colour
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(52, 210, 92, 130);
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(60, 218, 76, 114);
  const bookColors = ['#ef5350', '#42a5f5', '#66bb6a', '#ab47bc'];
  bookColors.forEach((c, i) => {
    ctx.fillStyle = i === 1 && changed.has('w5') ? '#e53935' : c;
    ctx.fillRect(64 + i * 18, 226, 14, 52);
  });
  ctx.fillStyle = '#ffee58';
  ctx.fillRect(64, 226, 14, 6);
  ctx.fillStyle = '#ffee58';
  ctx.fillRect(100, 226, 14, 6);
  // big wall clock, centre — hands move when changed
  glow(ctx, 310, 138, 110, '#fff8e1', 0.25);
  if (changed.has('w1')) wallClock(ctx, 310, 138, 62, -0.4, 1.9, '#ffb300');
  else wallClock(ctx, 310, 138, 62, -2.1, 0.9, '#ffb300');
  // pendulum below it — gone on the right panel
  if (!changed.has('w7')) {
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(310, 202);
    ctx.lineTo(310, 288);
    ctx.stroke();
    ctx.fillStyle = '#ffb300';
    ctx.beginPath();
    ctx.arc(310, 302, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffca28';
    ctx.beginPath();
    ctx.arc(310, 302, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  // brass gears on the wall — the big one goes missing on the right panel
  if (!changed.has('w2')) gear(ctx, 482, 118, 26, '#d7ccc8');
  gear(ctx, 440, 168, 18, '#a1887f');
  gear(ctx, 524, 176, 15, '#8d6e63');
  // hanging lamp
  lamp(ctx, 180, 92, changed.has('w3'));
  // workbench along the bottom
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(0, 350, W, 90);
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(0, 350, W, 12);
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(20, 396, 12, 44);
  ctx.fillRect(588, 396, 12, 44);
  // tools on the bench: hammer, screwdriver, spanner
  ctx.strokeStyle = '#a1887f';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(176, 368);
  ctx.lineTo(210, 400);
  ctx.stroke();
  ctx.fillStyle = '#9e9e9e';
  ctx.fillRect(202, 390, 26, 14);
  ctx.strokeStyle = '#d32f2f';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(258, 370);
  ctx.lineTo(282, 398);
  ctx.stroke();
  ctx.fillStyle = '#b0bec5';
  ctx.fillRect(278, 394, 8, 10);
  ctx.strokeStyle = '#546e7a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(330, 396);
  ctx.lineTo(372, 372);
  ctx.stroke();
  // extra wrench (right panel only)
  if (changed.has('w4')) {
    ctx.strokeStyle = '#78909c';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(408, 398);
    ctx.lineTo(452, 368);
    ctx.stroke();
    ctx.fillStyle = '#b0bec5';
    ctx.beginPath();
    ctx.arc(456, 366, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6d4c41';
    ctx.beginPath();
    ctx.arc(456, 366, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  // a jar of golden gears on the bench
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  rr(ctx, 520, 366, 56, 52, 8);
  ctx.fill();
  ctx.fillStyle = '#ffd54f';
  ctx.beginPath();
  ctx.arc(536, 402, 7, 0, Math.PI * 2);
  ctx.arc(556, 408, 7, 0, Math.PI * 2);
  ctx.arc(548, 390, 6, 0, Math.PI * 2);
  ctx.fill();
  sparkle(ctx, 120, 320, 5, '#fff9c4');
  sparkle(ctx, 420, 250, 5, '#fff9c4');
}

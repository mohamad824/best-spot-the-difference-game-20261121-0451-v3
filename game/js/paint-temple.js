// Crystal Temple — a glowing shrine: cream brick walls, green vines,
// a huge purple crystal on a golden pedestal, a golden statue and torches.
// `changed` is a Set of difference ids applied to the right-hand panel.

import { brickWall, vine, gem, glow, sparkle, floorBand, rr } from './paint-common.js';

function torch(ctx, x, y, flame) {
  glow(ctx, x, y - 18, 52, flame === 'blue' ? '#4fc3f7' : '#ffab40', 0.5);
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(x - 5, y, 10, 34);
  ctx.fillStyle = '#5d3a17';
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.lineTo(x + 11, y);
  ctx.lineTo(x + 6, y + 12);
  ctx.lineTo(x - 6, y + 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = flame === 'blue' ? '#4fc3f7' : '#ff9100';
  ctx.beginPath();
  ctx.moveTo(x, y - 34);
  ctx.quadraticCurveTo(x + 13, y - 16, x, y - 2);
  ctx.quadraticCurveTo(x - 13, y - 16, x, y - 34);
  ctx.fill();
  ctx.fillStyle = flame === 'blue' ? '#b3e5fc' : '#ffe082';
  ctx.beginPath();
  ctx.moveTo(x, y - 24);
  ctx.quadraticCurveTo(x + 7, y - 12, x, y - 4);
  ctx.quadraticCurveTo(x - 7, y - 12, x, y - 24);
  ctx.fill();
}

function statue(ctx, x, y) {
  glow(ctx, x, y - 30, 70, '#ffd54f', 0.35);
  ctx.fillStyle = '#f9a825';
  rr(ctx, x - 26, y + 52, 52, 14, 5);
  ctx.fill();
  ctx.fillStyle = '#ffb300';
  ctx.beginPath();
  ctx.ellipse(x, y + 52, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // body: a robed figure with raised arms
  ctx.fillStyle = '#ffca28';
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 52);
  ctx.quadraticCurveTo(x - 24, y - 6, x - 8, y - 18);
  ctx.lineTo(x + 8, y - 18);
  ctx.quadraticCurveTo(x + 24, y - 6, x + 18, y + 52);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f57f17';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 18);
  ctx.lineTo(x - 26, y - 44);
  ctx.moveTo(x + 8, y - 18);
  ctx.lineTo(x + 26, y - 44);
  ctx.stroke();
  ctx.fillStyle = '#ffe082';
  ctx.beginPath();
  ctx.arc(x, y - 30, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffb300';
  ctx.beginPath();
  ctx.arc(x, y - 30, 12, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#fff176';
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 38);
  ctx.lineTo(x, y - 52);
  ctx.lineTo(x + 14, y - 38);
  ctx.closePath();
  ctx.fill();
}

export function paintTemple(ctx, W, H, changed) {
  brickWall(ctx, W, H, 11);
  // arched doorway behind the crystal
  ctx.fillStyle = '#7e57c2';
  ctx.beginPath();
  ctx.moveTo(210, 330);
  ctx.lineTo(210, 150);
  ctx.arc(310, 150, 100, Math.PI, 0);
  ctx.lineTo(410, 330);
  ctx.closePath();
  ctx.fill();
  const arch = ctx.createLinearGradient(0, 60, 0, 330);
  arch.addColorStop(0, '#b39ddb');
  arch.addColorStop(1, '#5e35b1');
  ctx.fillStyle = arch;
  ctx.beginPath();
  ctx.moveTo(222, 330);
  ctx.lineTo(222, 152);
  ctx.arc(310, 152, 88, Math.PI, 0);
  ctx.lineTo(398, 330);
  ctx.closePath();
  ctx.fill();
  glow(ctx, 310, 170, 130, '#ce93d8', 0.5);
  // vines in the top corners — the top-right vine loses a flower on the right panel
  vine(ctx, 8, -6, 150, false, [{ x: 74, y: 46 }]);
  vine(ctx, W - 8, -6, 150, true, changed.has('t5') ? [{ x: W - 40, y: 110 }] : [{ x: W - 74, y: 46 }, { x: W - 40, y: 110 }]);
  // floor steps
  floorBand(ctx, W, H, 330, '#d7a86a', '#a5713a');
  ctx.fillStyle = '#c68f4e';
  ctx.fillRect(0, 330, W, 10);
  ctx.fillStyle = '#b57e3f';
  ctx.fillRect(0, 372, W, 10);
  // torches
  torch(ctx, 96, 150, changed.has('t4') ? 'blue' : 'orange');
  torch(ctx, 524, 150, 'orange');
  // golden pedestal
  ctx.fillStyle = '#ffb300';
  rr(ctx, 250, 300, 120, 34, 8);
  ctx.fill();
  ctx.fillStyle = '#ffca28';
  rr(ctx, 262, 288, 96, 14, 6);
  ctx.fill();
  ctx.fillStyle = '#f57f17';
  ctx.fillRect(250, 322, 120, 6);
  // the great crystal: purple, or teal when changed
  if (changed.has('t1')) gem(ctx, 310, 168, 92, '#4dd0e1', '#00695c');
  else gem(ctx, 310, 168, 92, '#ce93d8', '#6a1b9a');
  sparkle(ctx, 252, 108, 9);
  sparkle(ctx, 372, 96, 7);
  sparkle(ctx, 310, 66, 8, '#e1bee7');
  // small gems flanking the pedestal
  gem(ctx, 205, 356, 22, '#f48fb1', '#ad1457');
  gem(ctx, 415, 356, 22, '#81d4fa', '#01579b');
  gem(ctx, 468, 372, 16, '#a5d6a7', '#1b5e20');
  // extra gem on the steps (right panel only)
  if (changed.has('t3')) gem(ctx, 148, 362, 24, '#f48fb1', '#ad1457');
  // golden statue (missing on the right panel)
  if (!changed.has('t2')) statue(ctx, 522, 200);
  // scattered sparkles on the wall
  sparkle(ctx, 160, 90, 6, '#fff9c4');
  sparkle(ctx, 470, 210, 6, '#fff9c4');
  sparkle(ctx, 60, 260, 5, '#e1bee7');
}

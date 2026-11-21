// Gameplay: level state, timer, clicks, hearts, streak, score, hints,
// markers on found differences and the hover magnifier.

import { SCENES, PANEL_W, PANEL_H, starsFor } from './scenes.js';
import { paintTemple } from './paint-temple.js';
import { paintWorkshop } from './paint-workshop.js';
import { paintGarden } from './paint-garden.js';
import { sfx } from './sounds.js';

const PAINTERS = { temple: paintTemple, workshop: paintWorkshop, garden: paintGarden };

function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function createGame(els, hooks) {
  const state = {
    screen: 'title',
    levelIndex: 0,
    found: new Set(),
    hearts: 3,
    streak: 0,
    bestStreak: 0,
    score: 0,
    timeLeft: 0,
    hintsLeft: 3,
    hintsUsed: 0,
    hintId: null,
    frozen: false,
    results: [],
    totalFinds: 0,
    wrongClicks: 0,
  };
  let timerId = null;

  const scene = () => SCENES[state.levelIndex];

  function paintPanel(canvas, changed) {
    const ctx = canvas.getContext('2d');
    PAINTERS[scene().id](ctx, PANEL_W, PANEL_H, changed);
    drawMarkers(ctx);
  }

  function drawMarkers(ctx) {
    for (const id of state.found) {
      const d = scene().diffs.find((x) => x.id === id);
      if (!d) continue;
      ctx.save();
      ctx.strokeStyle = '#ffd600';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(d.x - 12, d.y);
      ctx.lineTo(d.x - 3, d.y + 10);
      ctx.lineTo(d.x + 14, d.y - 10);
      ctx.stroke();
      ctx.restore();
    }
    if (state.hintId) {
      const d = scene().diffs.find((x) => x.id === state.hintId);
      if (d) {
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 180);
        ctx.save();
        ctx.strokeStyle = `rgba(255,214,0,${0.5 + pulse * 0.5})`;
        ctx.lineWidth = 4 + pulse * 3;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function renderPanels() {
    const changed = new Set(scene().diffs.map((d) => d.id));
    paintPanel(els.left, new Set());
    paintPanel(els.right, changed);
  }

  function updateHud() {
    const s = scene();
    const left = s.diffs.length - state.found.size;
    els.levelPill.textContent = `LEVEL ${s.level} · ${s.name.toUpperCase()}`;
    els.counter.textContent = `${left} LEFT`;
    els.counter.classList.toggle('urgent', left <= 2);
    els.timerText.textContent = fmtTime(state.timeLeft);
    els.timerBar.style.width = `${Math.max(0, (state.timeLeft / s.parSeconds) * 100)}%`;
    els.timerBar.classList.toggle('low', state.timeLeft <= 20);
    els.scoreText.textContent = state.score.toLocaleString('en-US');
    els.streakText.textContent = state.streak > 1 ? `STREAK ×${state.streak}` : 'STREAK ×0';
    els.streakText.classList.toggle('hot', state.streak >= 3);
    els.hearts.textContent = '♥'.repeat(state.hearts) + '♡'.repeat(Math.max(0, 3 - state.hearts));
    els.hintBtn.textContent = `💡 Hint (${state.hintsLeft})`;
    els.hintBtn.disabled = state.hintsLeft <= 0 || left === 0;
    els.dots.innerHTML = s.diffs
      .map((d) => `<span class="dot${state.found.has(d.id) ? ' found' : ''}" title="${d.name}"></span>`)
      .join('');
    els.foundList.innerHTML =
      s.diffs
        .map((d) =>
          state.found.has(d.id)
            ? `<span class="chip found">✓ ${d.name}</span>`
            : `<span class="chip">? ? ?</span>`,
        )
        .join('') || '';
    els.foundCount.textContent = `${state.found.size}/${s.diffs.length} FOUND`;
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    if (state.frozen) return;
    timerId = setInterval(() => {
      if (state.screen !== 'play' || state.paused) return;
      state.timeLeft -= 1;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        updateHud();
        outOfTime();
        return;
      }
      updateHud();
    }, 1000);
  }

  function finishLevel(failed) {
    stopTimer();
    const s = scene();
    const stars = failed ? 0 : starsFor(state.hearts, state.timeLeft, s.parSeconds);
    const timeBonus = failed ? 0 : Math.round(state.timeLeft * 2);
    if (!failed) state.score += timeBonus;
    state.results[state.levelIndex] = {
      scene: s.name,
      stars,
      score: state.score,
      timeLeft: state.timeLeft,
      timeBonus,
      hearts: state.hearts,
      bestStreak: state.bestStreak,
      failed,
    };
    state.screen = 'level';
    updateHud();
    if (failed) sfx.wrong();
    else sfx.level();
    hooks.onLevelEnd(state.results[state.levelIndex], state.levelIndex);
  }

  function outOfTime() {
    finishLevel(true);
  }

  function startLevel(index, staged) {
    state.levelIndex = index;
    state.found = new Set(staged?.found ?? []);
    state.hearts = staged?.hearts ?? 3;
    state.streak = staged?.streak ?? 0;
    state.bestStreak = state.streak;
    state.score = staged?.score ?? (index === 0 ? 0 : state.score);
    state.timeLeft = staged?.timeLeft ?? scene().parSeconds;
    state.hintsLeft = 3;
    state.hintsUsed = 0;
    state.hintId = null;
    state.frozen = !!staged?.freeze;
    state.paused = false;
    state.screen = 'play';
    hooks.onPlay();
    renderPanels();
    updateHud();
    startTimer();
  }

  function clickAt(canvas, clientX, clientY) {
    if (state.screen !== 'play' || state.paused) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * PANEL_W;
    const y = ((clientY - rect.top) / rect.height) * PANEL_H;
    const s = scene();
    const hit = s.diffs.find((d) => !state.found.has(d.id) && Math.hypot(d.x - x, d.y - y) <= d.r + 6);
    if (hit) {
      state.found.add(hit.id);
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.totalFinds += 1;
      const gained = 100 + 25 * (state.streak - 1);
      state.score += gained;
      state.hintId = null;
      sfx.find();
      renderPanels();
      updateHud();
      flashFound(hit);
      if (state.found.size === s.diffs.length) finishLevel(false);
    } else {
      state.hearts -= 1;
      state.streak = 0;
      state.wrongClicks += 1;
      sfx.wrong();
      els.stage.classList.add('shake');
      setTimeout(() => els.stage.classList.remove('shake'), 350);
      updateHud();
      if (state.hearts <= 0) finishLevel(true);
    }
  }

  function flashFound(d) {
    const el = document.createElement('div');
    el.className = 'float-score';
    el.textContent = `+${100 + 25 * (state.streak - 1)}  ${d.name}`;
    el.style.left = '50%';
    el.style.top = '18%';
    els.stage.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }

  function useHint() {
    if (state.screen !== 'play' || state.paused || state.hintsLeft <= 0) return;
    const remaining = scene().diffs.filter((d) => !state.found.has(d.id));
    if (!remaining.length) return;
    state.hintsLeft -= 1;
    state.hintsUsed += 1;
    state.score = Math.max(0, state.score - 50);
    state.streak = 0;
    state.hintId = remaining[Math.floor(Math.random() * remaining.length)].id;
    sfx.hint();
    renderPanels();
    updateHud();
    setTimeout(() => {
      state.hintId = null;
      renderPanels();
    }, 3000);
  }

  function togglePause() {
    if (state.screen === 'play') {
      state.paused = true;
      state.screen = 'pause';
      hooks.onPause();
    } else if (state.screen === 'pause') {
      state.paused = false;
      state.screen = 'play';
      hooks.onPlay();
    }
    updateHud();
  }

  function showTitle() {
    stopTimer();
    state.screen = 'title';
    hooks.onTitle(state.results);
  }

  // Magnifier: a circular lens that zooms the panel under the cursor 2x.
  function bindMagnifier() {
    const lens = els.lens;
    const zoom = lens.querySelector('canvas');
    zoom.width = 170;
    zoom.height = 170;
    const zctx = zoom.getContext('2d');
    for (const canvas of [els.left, els.right]) {
      canvas.addEventListener('mousemove', (e) => {
        if (state.screen !== 'play' || state.paused) {
          lens.classList.remove('on');
          return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * PANEL_W;
        const y = ((e.clientY - rect.top) / rect.height) * PANEL_H;
        const stageRect = els.stage.getBoundingClientRect();
        lens.style.left = `${e.clientX - stageRect.left + 18}px`;
        lens.style.top = `${e.clientY - stageRect.top - 190}px`;
        lens.classList.add('on');
        zctx.clearRect(0, 0, 170, 170);
        zctx.drawImage(canvas, x - 42, y - 42, 84, 84, 0, 0, 170, 170);
        zctx.strokeStyle = 'rgba(255,214,0,0.9)';
        zctx.lineWidth = 3;
        zctx.beginPath();
        zctx.arc(85, 85, 80, 0, Math.PI * 2);
        zctx.stroke();
        zctx.beginPath();
        zctx.moveTo(85, 70);
        zctx.lineTo(85, 100);
        zctx.moveTo(70, 85);
        zctx.lineTo(100, 85);
        zctx.strokeStyle = 'rgba(255,255,255,0.7)';
        zctx.lineWidth = 2;
        zctx.stroke();
      });
      canvas.addEventListener('mouseleave', () => lens.classList.remove('on'));
      canvas.addEventListener('click', (e) => clickAt(canvas, e.clientX, e.clientY));
    }
  }

  bindMagnifier();

  return {
    state,
    startLevel,
    clickAt,
    useHint,
    togglePause,
    showTitle,
    renderPanels,
    updateHud,
    nextLevel() {
      if (state.levelIndex + 1 < SCENES.length) startLevel(state.levelIndex + 1);
    },
  };
}

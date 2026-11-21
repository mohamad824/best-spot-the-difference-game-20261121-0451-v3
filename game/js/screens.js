// Overlay screens: title, pause, level-complete and the win screen with
// grade and run statistics. Pure DOM — the game itself lives on canvas.

import { SCENES, gradeFor } from './scenes.js';

function starsRow(n, max = 3) {
  return '★'.repeat(n) + '☆'.repeat(Math.max(0, max - n));
}

export function createScreens(els, api) {
  function hideAll() {
    for (const el of [els.screenTitle, els.screenPause, els.screenLevel, els.screenWin]) {
      el.classList.add('hidden');
    }
  }

  function showTitle(results) {
    hideAll();
    els.levelCards.innerHTML = SCENES.map((s, i) => {
      const r = results[i];
      const stars = r ? starsRow(r.stars) : '☆☆☆';
      const best = r ? (r.failed ? 'Not cleared yet' : `${r.stars}/3 stars`) : 'Not played yet';
      return `<button class="level-card" data-level="${i}">
        <span class="lc-num">LEVEL ${s.level}</span>
        <span class="lc-name">${s.name}</span>
        <span class="lc-tag">${s.tagline}</span>
        <span class="lc-diffs">${s.diffs.length} differences · ${Math.floor(s.parSeconds / 60)}:${String(s.parSeconds % 60).padStart(2, '0')} par</span>
        <span class="lc-stars">${stars}</span>
        <span class="lc-best">${best}</span>
      </button>`;
    }).join('');
    els.levelCards.querySelectorAll('.level-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        api.startLevel(Number(btn.dataset.level));
      });
    });
    els.screenTitle.classList.remove('hidden');
  }

  function showPause() {
    hideAll();
    els.screenPause.classList.remove('hidden');
  }

  function showLevelEnd(result, levelIndex) {
    hideAll();
    const s = SCENES[levelIndex];
    const last = levelIndex === SCENES.length - 1;
    els.levelTitle.textContent = result.failed
      ? (result.timeLeft <= 0 ? "Time's up!" : 'Out of hearts!')
      : `${s.name} — Cleared!`;
    els.levelStars.textContent = starsRow(result.stars);
    els.levelStars.classList.toggle('gold', result.stars > 0);
    els.levelStats.innerHTML = result.failed
      ? `<div><b>${result.score.toLocaleString('en-US')}</b><span>score</span></div>
         <div><b>${result.bestStreak}</b><span>best streak</span></div>
         <div><b>${s.diffs.length}</b><span>differences</span></div>`
      : `<div><b>+${result.timeBonus}</b><span>time bonus</span></div>
         <div><b>${result.bestStreak}</b><span>best streak</span></div>
         <div><b>${result.hearts} ♥</b><span>hearts left</span></div>`;
    els.levelNext.textContent = result.failed
      ? 'Try Again'
      : last
        ? 'See Results'
        : `Next: ${SCENES[levelIndex + 1].name} →`;
    els.levelNext.dataset.mode = result.failed ? 'retry' : last ? 'win' : 'next';
    els.screenLevel.classList.remove('hidden');
  }

  function showWin(game) {
    hideAll();
    const totalStars = game.results.reduce((n, r) => n + (r?.stars ?? 0), 0);
    const g = gradeFor(totalStars, game.score);
    els.winGrade.textContent = g.grade;
    els.winBlurb.textContent = g.blurb;
    els.winStars.textContent = `${starsRow(totalStars, 9)}  ${totalStars}/9 stars`;
    els.winStats.innerHTML = `
      <div><b>${game.score.toLocaleString('en-US')}</b><span>total score</span></div>
      <div><b>${game.totalFinds}</b><span>differences found</span></div>
      <div><b>${game.wrongClicks}</b><span>wrong clicks</span></div>
      <div><b>${game.hintsUsed}</b><span>hints used</span></div>`;
    els.winRows.innerHTML = game.results
      .map(
        (r, i) =>
          `<div class="win-row"><span>${SCENES[i].name}</span><span class="wr-stars">${starsRow(r?.stars ?? 0)}</span><span>${(r?.score ?? 0).toLocaleString('en-US')} pts</span></div>`,
      )
      .join('');
    els.screenWin.classList.remove('hidden');
  }

  return { hideAll, showTitle, showPause, showLevelEnd, showWin };
}

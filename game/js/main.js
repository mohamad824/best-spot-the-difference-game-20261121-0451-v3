// Boot: wire the HUD buttons, the overlay screens, keyboard shortcuts
// and the optional staged screenshot states, then show the title screen.

import { SCENES } from './scenes.js';
import { createGame } from './play.js';
import { createScreens } from './screens.js';
import { readShot } from './shots.js';
import { sfx } from './sounds.js';

const $ = (id) => document.getElementById(id);

const els = {
  stage: $('stage'),
  left: $('panel-left'),
  right: $('panel-right'),
  lens: $('lens'),
  levelPill: $('level-pill'),
  counter: $('counter'),
  dots: $('dots'),
  timerText: $('timer-text'),
  timerBar: $('timer-bar'),
  scoreText: $('score-text'),
  streakText: $('streak-text'),
  hearts: $('hearts'),
  hintBtn: $('hint-btn'),
  pauseBtn: $('pause-btn'),
  muteBtn: $('mute-btn'),
  foundList: $('found-list'),
  foundCount: $('found-count'),
  screenTitle: $('screen-title'),
  screenPause: $('screen-pause'),
  screenLevel: $('screen-level'),
  screenWin: $('screen-win'),
  levelCards: $('level-cards'),
  levelTitle: $('level-title'),
  levelStars: $('level-stars'),
  levelStats: $('level-stats'),
  levelNext: $('level-next'),
  winGrade: $('win-grade'),
  winBlurb: $('win-blurb'),
  winStars: $('win-stars'),
  winStats: $('win-stats'),
  winRows: $('win-rows'),
};

let game;
let screens;

const hooks = {
  onPlay() {
    screens.hideAll();
  },
  onPause() {
    screens.showPause();
  },
  onTitle(results) {
    screens.showTitle(results);
  },
  onLevelEnd(result, levelIndex) {
    if (game.state.screen === 'level') screens.showLevelEnd(result, levelIndex);
  },
};

game = createGame(els, hooks);
screens = createScreens(els, {
  startLevel: (i) => game.startLevel(i),
});

function startFresh() {
  game.state.score = 0;
  game.state.results = [];
  game.state.totalFinds = 0;
  game.state.wrongClicks = 0;
  game.state.hintsUsed = 0;
  game.startLevel(0);
}

$('start-btn').addEventListener('click', () => {
  sfx.click();
  startFresh();
});
$('how-btn').addEventListener('click', () => {
  $('how-box').classList.toggle('hidden');
});
els.hintBtn.addEventListener('click', () => game.useHint());
els.pauseBtn.addEventListener('click', () => game.togglePause());
els.muteBtn.addEventListener('click', () => {
  sfx.setMuted(!sfx.isMuted());
  els.muteBtn.textContent = sfx.isMuted() ? '🔇 Sound Off' : '🔊 Sound On';
});
$('resume-btn').addEventListener('click', () => game.togglePause());
$('quit-btn').addEventListener('click', () => game.showTitle());
els.levelNext.addEventListener('click', () => {
  sfx.click();
  const mode = els.levelNext.dataset.mode;
  if (mode === 'retry') game.startLevel(game.state.levelIndex);
  else if (mode === 'win') {
    screens.showWin(game.state);
    sfx.win();
  } else game.nextLevel();
});
$('level-menu-btn').addEventListener('click', () => game.showTitle());
$('again-btn').addEventListener('click', () => {
  sfx.click();
  startFresh();
});
$('win-menu-btn').addEventListener('click', () => game.showTitle());

document.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') game.useHint();
  else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
    if (game.state.screen === 'play' || game.state.screen === 'pause') game.togglePause();
  } else if (e.key === 'm' || e.key === 'M') els.muteBtn.click();
  else if (e.key === 'Enter' && game.state.screen === 'title') startFresh();
  else if (['1', '2', '3'].includes(e.key) && game.state.screen === 'title') {
    game.state.score = 0;
    game.state.results = [];
    game.startLevel(Number(e.key) - 1);
  }
});

// Staged screenshot states, or the title screen for normal play.
const shot = readShot();
if (shot?.kind === 'play') {
  game.startLevel(shot.level, shot.staged);
} else if (shot?.kind === 'win') {
  game.state.results = shot.stagedResults;
  Object.assign(game.state, shot.stagedState);
  screens.showWin(game.state);
  window.__shotReady = true;
} else {
  game.showTitle();
  if (shot?.kind === 'title') window.__shotReady = true;
}
if (shot?.kind === 'play') window.__shotReady = true;

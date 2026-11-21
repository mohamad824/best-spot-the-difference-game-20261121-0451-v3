// Staged states for the maker's own screenshots (?shot=...).
// These freeze the timer so a screenshot is deterministic. Normal play
// (no query string) never touches this module's states.

export function readShot() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return null;
  if (shot === 'cover') {
    return {
      kind: 'play',
      level: 1,
      staged: { found: ['w1', 'w3', 'w5'], timeLeft: 72, score: 1250, streak: 3, hearts: 3, freeze: true },
    };
  }
  if (shot === 'temple') {
    return {
      kind: 'play',
      level: 0,
      staged: { found: ['t1', 't4'], timeLeft: 61, score: 640, streak: 2, hearts: 3, freeze: true },
    };
  }
  if (shot === 'garden') {
    return {
      kind: 'play',
      level: 2,
      staged: { found: ['g1', 'g2', 'g5', 'g6'], timeLeft: 96, score: 2140, streak: 2, hearts: 3, freeze: true },
    };
  }
  if (shot === 'title') return { kind: 'title' };
  if (shot === 'win') {
    return {
      kind: 'win',
      stagedResults: [
        { scene: 'Crystal Temple', stars: 3, score: 1480, timeLeft: 52, timeBonus: 104, hearts: 3, bestStreak: 5, failed: false },
        { scene: "Clockmaker's Workshop", stars: 3, score: 3120, timeLeft: 48, timeBonus: 96, hearts: 3, bestStreak: 4, failed: false },
        { scene: 'Firefly Garden', stars: 2, score: 4860, timeLeft: 31, timeBonus: 62, hearts: 2, bestStreak: 6, failed: false },
      ],
      stagedState: { score: 4860, totalFinds: 21, wrongClicks: 2, hintsUsed: 1 },
    };
  }
  return null;
}

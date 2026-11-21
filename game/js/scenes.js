// Scene data for Gem Rush — Spot the Difference.
// Each scene lists its differences in panel coordinates (620 x 440).
// A difference is found by clicking near its point on either panel.

export const PANEL_W = 620;
export const PANEL_H = 440;

export const SCENES = [
  {
    id: 'temple',
    level: 1,
    name: 'Crystal Temple',
    tagline: 'A glowing shrine of purple gems and gold',
    parSeconds: 90,
    diffs: [
      { id: 't1', name: 'Crystal turns teal', x: 310, y: 168, r: 48 },
      { id: 't2', name: 'Golden statue vanishes', x: 522, y: 252, r: 52 },
      { id: 't3', name: 'Extra gem on the steps', x: 148, y: 362, r: 26 },
      { id: 't4', name: 'Torch flame turns blue', x: 96, y: 148, r: 30 },
      { id: 't5', name: 'Vine flower missing', x: 546, y: 46, r: 22 },
    ],
  },
  {
    id: 'workshop',
    level: 2,
    name: "Clockmaker's Workshop",
    tagline: 'Gears, clocks and lamplight in a cosy workshop',
    parSeconds: 120,
    diffs: [
      { id: 'w1', name: 'Big clock hands move', x: 310, y: 138, r: 42 },
      { id: 'w2', name: 'Wall gear goes missing', x: 482, y: 118, r: 34 },
      { id: 'w3', name: 'Lamp glows green', x: 180, y: 92, r: 30 },
      { id: 'w4', name: 'Extra wrench on the bench', x: 432, y: 382, r: 26 },
      { id: 'w5', name: 'Book turns red', x: 92, y: 252, r: 28 },
      { id: 'w6', name: 'Moon becomes a star', x: 542, y: 56, r: 24 },
      { id: 'w7', name: 'Pendulum swings away', x: 310, y: 302, r: 26 },
    ],
  },
  {
    id: 'garden',
    level: 3,
    name: 'Firefly Garden',
    tagline: 'A moonlit garden buzzing with fireflies',
    parSeconds: 150,
    diffs: [
      { id: 'g1', name: 'Lantern turns pink', x: 118, y: 152, r: 30 },
      { id: 'g2', name: 'Flower changes colour', x: 300, y: 332, r: 30 },
      { id: 'g3', name: 'Mushroom spots vanish', x: 502, y: 342, r: 28 },
      { id: 'g4', name: 'Extra firefly appears', x: 432, y: 182, r: 20 },
      { id: 'g5', name: 'Frog hops away', x: 198, y: 372, r: 30 },
      { id: 'g6', name: 'Moon turns orange', x: 542, y: 68, r: 28 },
      { id: 'g7', name: 'Pond stone goes missing', x: 352, y: 402, r: 22 },
      { id: 'g8', name: 'Butterfly appears', x: 252, y: 122, r: 24 },
      { id: 'g9', name: 'Bush berries vanish', x: 82, y: 302, r: 26 },
    ],
  },
];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}

/** Stars for a finished level: 3 for a flawless fast clear, 2 for a solid clear, else 1. */
export function starsFor(heartsLeft, secondsLeft, parSeconds) {
  if (heartsLeft === 3 && secondsLeft >= parSeconds * 0.5) return 3;
  if (heartsLeft >= 2) return 2;
  return 1;
}

/** Grade for the whole run from total stars (max 9) and total score. */
export function gradeFor(totalStars, totalScore) {
  if (totalStars >= 9) return { grade: 'S', blurb: 'Flawless gem hunter!' };
  if (totalStars >= 7) return { grade: 'A', blurb: 'A sparkling clear!' };
  if (totalStars >= 5) return { grade: 'B', blurb: 'A bright clear!' };
  if (totalStars >= 3) return { grade: 'C', blurb: 'A clear — keep hunting!' };
  return { grade: 'D', blurb: 'Finished — try for more stars!' };
}

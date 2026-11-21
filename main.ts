// Gem Rush — Spot the Difference: the entry program (Node 22, stdlib only).
// It hands the game in by copying this repository's game/ and screenshots/
// beside it into the grader's output directory, then writing the dossier
// the judge reads, built with the vendored make.fun library.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for
// /output, e.g.  MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message) {
  throw new Error(`main.ts: ${message}`);
}

function checkTree() {
  const gameDir = join(repoRoot, 'game');
  const page = join(gameDir, 'index.html');
  if (!existsSync(page) || !statSync(page).isFile()) fail('game/index.html is missing');
  const shotsDir = join(repoRoot, 'screenshots');
  if (!existsSync(shotsDir)) fail('screenshots/ is missing');
  const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
  if (shots.length < 3 || shots.length > 4) fail(`screenshots/ holds ${shots.length} images, need 3 or 4`);
  for (const name of shots) {
    const size = statSync(join(shotsDir, name)).size;
    if (size > 262144) fail(`screenshots/${name} is ${size} bytes, over the 256 KiB cap`);
  }
}

function handIn() {
  checkTree();
  mkdirSync(targetDir, { recursive: true });
  cpSync(join(repoRoot, 'game'), join(targetDir, 'game'), { recursive: true });
  mkdirSync(join(targetDir, 'screenshots'), { recursive: true });
  cpSync(join(repoRoot, 'screenshots'), join(targetDir, 'screenshots'), { recursive: true });
  const dossier = buildDossier(targetDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  });
  writeFileSync(join(targetDir, 'dossier.json'), dossier);
}

handIn();

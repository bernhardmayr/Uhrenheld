import type { Rng } from '../rng';
import type { Block, Difficulty, Task } from '../tasks';
import { generateBlockA } from './blockA';
import { generateBlockB } from './blockB';
import { generateBlockC } from './blockC';
import { generateBlockD } from './blockD';
import { generateBlockE } from './blockE';
import { generateBlockF } from './blockF';
import { generateBlockG } from './blockG';
import { generateBlockH } from './blockH';
import type { Generator } from './util';

/** Maps each learning block to its task generator. */
export const GENERATORS: Record<Block, Generator> = {
  A: generateBlockA,
  B: generateBlockB,
  C: generateBlockC,
  D: generateBlockD,
  E: generateBlockE,
  F: generateBlockF,
  G: generateBlockG,
  H: generateBlockH,
};

/** Generate one task for the given block and difficulty. */
export function generateTask(
  block: Block,
  rng: Rng,
  difficulty: Difficulty,
): Task {
  return GENERATORS[block](rng, difficulty);
}

export {
  generateBlockA,
  generateBlockB,
  generateBlockC,
  generateBlockD,
  generateBlockE,
  generateBlockF,
  generateBlockG,
  generateBlockH,
};
